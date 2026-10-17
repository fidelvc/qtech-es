# Informe de mejoras — Qtech.es

Fecha: 2026-10-17
Rama: `layout` (working tree con cambios aplicados)

## 1. Resumen

Se han aplicado las mejoras recomendadas del checklist de implementación, adaptadas
a las decisiones tomadas durante la planificación:

- **Los datos se mantienen en `site.js`** (no se convierten a JSON ni se usa `fetch`),
  porque la web se sirve como sitio estático y no se quiere depender de un servidor
  HTTP ni de un backend.
- **Los temas siguen ligados al sistema operativo** (`prefers-color-scheme`), sin
  toggle manual, pero se ha **ampliado la gama de colores** (tokens semánticos,
  superficies, bordes, acentos secundarios, sombras, etc.) tanto en claro como en
  oscuro.
- Se ha introducido una **capa de almacenamiento** (`localStorage` /
  `sessionStorage`) mediante la clase `StorageManager`, con usos reales y
  funcionales en un sitio estático:
  - `localStorage`: recuerda el último filtro seleccionado en las listas.
  - `sessionStorage`: guarda el borrador del formulario de contacto.
- Se ha refactorizado el código para usar **más clases de JS** (clases base
  `QCard` y `ListBase`, `Router`, `StorageManager`), eliminando duplicación.
- Se ha añadido el **menú de navegación (`q-site-nav`)** que faltaba, con
  `aria-current="page"`.
- Se han añadido **estados de carga y error** en el router, **datos
  estructurados JSON-LD**, **títulos dinámicos**, **saltar al contenido** y
  mejoras de accesibilidad.
- Se ha hecho un **refactor de nomenclatura a inglés** (código) manteniendo el
  **contenido en español**, y un **nuevo sistema de layout con CSS Grid**
  (áreas con nombre, sin rejilla de 12 columnas, con media queries y nesting).
  Todo ello se detalla en la sección 7.
- Se ha **actualizado el contenido de `site.js`** con los datos reales del negocio
  (contacto, tipos de mantenimiento, catálogo sin precios, proceso, garantías,
  logística, tarifas y FAQ) y se han añadido los componentes `q-steps`,
  `q-feature-grid` y `q-pricing`. Se detalla en la sección 8.

## 2. Estructura final del proyecto

```
public/
  index.html
  css/
    global.css
    layout.css           (reset + shell + contenedores: .section / .card / .card-grid)
    forms.css
    typography.css
    themes/
      light.css          (paleta ampliada, modo claro)
      dark.css           (paleta ampliada, modo oscuro vía prefers-color-scheme)
  js/
    data/
      site.js            (única fuente de verdad; claves en inglés, valores en español)
    lib/
      storage.js         (StorageManager + local/session)
      css.js             (loadStyles: cargador de hojas .css externas)
      element.js         (BaseElement: estilos en array, mapeo attr→prop)
      define.js
      fill.js            (fill + create)
      router.js          (clase Router, carga/error, títulos)
      seo.js             (JSON-LD)
    components/
      base/
        q-card.js        (base de tarjetas)
        q-list.js        (base de listas filtrables)
      q-app-view.js
      q-site-nav.js
      q-hero.js
      q-page-head.js
      q-cta.js
      q-faq.js
      q-steps.js         (NUEVO: pasos del proceso)
      q-feature-grid.js  (NUEVO: garantías / logística)
      q-pricing.js       (NUEVO: tarifas de mano de obra)
      q-service-card.js
      q-product-card.js
      q-service-list.js
      q-product-grid.js
    views/
      home-view.js
      services-view.js
      products-view.js
      contact-view.js
    main.js              (SEO, wiring)
docs/
  INFORME-MEJORAS.md    (este archivo)
  INFORME-DESPLIEGUE.md
```

## 3. Cambios por área

### 3.1 Almacenamiento (`lib/storage.js`)

Clase `StorageManager` que envuelve `localStorage` / `sessionStorage`:

- Serialización JSON automática (`get`/`set`).
- Captura de errores (modo privado, cuota) con caída a memoria.
- Instancias listas: `local` y `session`.

```js
import { local, session } from "../lib/storage.js";
local.set("filter", "Correctivo");
const f = local.get("filter", "");
session.set("draft", { name: "Ana" });
```

### 3.2 Dónde se usa

| Almacenamiento | Uso | Por qué tiene sentido en un sitio estático |
|----------------|-----|--------------------------------------------|
| `localStorage` | Último filtro seleccionado en `q-service-list` y `q-product-grid` | Persiste entre visitas; es solo preferencia de UI del usuario, no datos del negocio. |
| `sessionStorage` | Borrador del formulario de contacto | Sobrevive a recargas dentro de la misma pestaña; se borra al cerrar. No requiere backend. |

**Importante:** los datos maestros (servicios, productos, contacto, nav) siguen viviendo en
`site.js` y no se persisten en el navegador. Si en el futuro se quisiera que un cliente
edite esos datos desde la web y que se vean para todos, haría falta un **backend con base
de datos y autenticación**. Para un sitio informativo estático, editar `site.js` y
volver a desplegar es la opción correcta y segura.

### 3.3 Clases de JS (más herencia)

- `BaseElement` (`lib/element.js`, base): acepta `static styles` como hoja única o
  array de hojas, y mapea atributos a propiedades en `attributeChangedCallback`
  (mejor soporte de atributos booleanos/numéricos). Los atributos booleanos se
  declaran en kebab-case (p. ej. `no-filters`, `featured`).
- `QCard` (`components/base/q-card.js`): cáscara visual compartida por
  `q-service-card` y `q-product-card`. Elimina la duplicación de CSS de tarjeta.
- `ListBase` (`components/base/q-list.js`): lógica común de filtrado (chips de
  radio, contador `aria-live`, ocultar elementos, persistencia del filtro en
  `localStorage`). `q-service-list` y `q-product-grid` la extienden e implementan
  `items` y `createItem(item)`.
- `Router` (`lib/router.js`): clase con estados de carga y error (404), guardia
  contra carreras de navegación y títulos dinámicos. API:
  `start`, `navigate`, `subscribe`, `current`.

### 3.4 Menú de navegación (`q-site-nav`)

Componente que lee `site.nav` y genera el `<nav>` con `aria-current="page"` en la
ruta activa. Se suscribe al router para actualizar el estado activo al navegar. Está
en el `<header>` de `index.html`, por lo que persiste entre rutas.

### 3.5 Temas (paleta ampliada)

Se mantuvo la estructura basada en `prefers-color-scheme` (light.css / dark.css vía
media query en global.css), pero se amplió la gama de colores con nuevos tokens:

- Superficies: `--color-surface-elevated`, `--color-overlay`.
- Texto: `--color-text-subtle`, `--color-heading`.
- Bordes: `--color-border-strong`.
- Acento: `--color-accent-hover`, `--color-accent-soft`.
- Acento secundario: `--color-accent-2`, `--color-accent-2-soft`.
- Semánticos: `--color-success`, `--color-warning`, `--color-danger`,
  `--color-info` (con variantes `-soft`).
- Sombras: `--shadow-3`.
- Selección de texto: `--color-selection`.

`dark.css` ya no repite el `@media (prefers-color-scheme: dark)` porque el propio
`@import` de `global.css` ya lo condiciona.

### 3.6 Vistas

- `home-view` reutiliza `q-service-list` y `q-product-grid` (con `no-filters`)
  en lugar de construir tarjetas a mano. Se eliminó la selección frágil por índice.
  Además monta, a partir de `site.js`, las secciones de **cómo trabajo**
  (`q-steps`), **garantías** y **logística** (`q-feature-grid`), **tarifas**
  (`q-pricing`), **FAQ** (`q-faq`) y **CTA** (`q-cta`).
- `services-view` y `products-view` pasan `filters` al componente (que los renderiza
  internamente, evitando el problema de agrupación de radios entre shadow y light DOM).
- `contact-view` incluye un formulario que abre el cliente de correo (`mailto:`) y
  guarda/restaura el borrador con `sessionStorage`. Muestra correo, teléfono,
  horario, dirección estructurada y zona de cobertura desde `site.contact`.

### 3.7 Router

- Clase `Router` con `start`, `navigate`, `subscribe`, `current`.
- Estado de carga (`aria-busy`, "Cargando...") y página 404 amigable.
- Guardia con token para evitar condiciones de carrera al navegar rápido.
- Mueve el foco al `<h1>` y hace scroll al inicio.
- Títulos dinámicos por ruta.

### 3.8 Accesibilidad y SEO

- Enlace "Saltar al contenido" (`#content`) al inicio del `<body>`.
- `::selection` con color del tema.
- Datos estructurados JSON-LD (`LocalBusiness`) inyectados desde `site.js`, con
  dirección postal estructurada (`streetAddress`, `postalCode`, `addressLocality`,
  `addressRegion`) y `areaServed`.
- `aria-current="page"` en el nav activo.
- `aria-live="polite"` en contadores de filtrado; el sustantivo del contador concuerda
  con el total (`1 de 13 servicios`, no `1 de 13 servicio`).

### 3.9 CSS externo por componente

Todo el CSS de componentes y vistas vive en archivos `.css` propios (uno por
componente), en lugar de dentro del `.js`:

- `lib/css.js` expone `loadStyles(url)`: descarga el `.css`, lo convierte en
  `CSSStyleSheet` y lo **memoiza** (una sola descarga por URL).
- Cada módulo hace:
  `const styles = await loadStyles(new URL("./q-hero.css", import.meta.url));`
- Las clases base (`QCard`, `ListBase`) exportan su hoja y las subclases la combinan
  en un array: `static styles = [QCard.sharedStyles, ownStyles];`
- Se mantiene el Shadow DOM y su encapsulación, pero el CSS vuelve a ser **CSS real**
  (resaltado, autocompletado, formateo y posibilidad de usar linters).
- Los tokens de diseño siguen en `themes/light.css` y `themes/dark.css`.

> Nota: esto hace que **servir por HTTP sea obligatorio** (los módulos ES ya lo
> exigían; ahora además se descargan las hojas con `fetch`).

## 4. Cómo ejecutar y probar

La web debe servirse por HTTP: los módulos ES y la carga de las hojas `.css` con
`fetch` no funcionan desde `file://`.

```bash
cd public
python3 -m http.server 8000
# abrir http://localhost:8000
```

Pruebas sugeridas:

1. Navegar entre las cuatro rutas con el menú y con el teclado (Tab).
2. En Inicio, revisar las secciones **Cómo trabajo**, **Garantías**, **Logística**,
   **Tarifas de mano de obra** y **Preguntas frecuentes**.
3. En Servicios, filtrar por tipo de mantenimiento (Preventivo, Correctivo,
   Paliativo, Adaptativo) y comprobar el contador y la persistencia del filtro al
   recargar.
4. En Productos, filtrar por categoría, comprobar que **no se muestra precio** y
   pulsar "Ver ficha" (debe emitir `app:item` en consola).
5. En Contacto, comprobar correo, teléfono, horario, dirección y zona; escribir en el
   formulario, recargar la pestaña y verificar que el borrador se restaura; enviar
   debe abrir el cliente de correo.
6. Cambiar el tema del sistema operativo y comprobar que la paleta cambia.
7. Reducir movimiento (`prefers-reduced-motion`) y verificar que se anulan
   transiciones.
8. Inspeccionar el `<head>` para confirmar el JSON-LD y la dirección estructurada.

## 5. Notas sobre almacenamiento en sitios estáticos

- `localStorage`/`sessionStorage` son **del cliente**: cada navegador tiene su propia
  copia y el usuario puede verla/editarla desde las DevTools. Por eso solo se usan
  para preferencias de UI (filtros, borrador), nunca para datos oficiales del sitio.
- Si en el futuro se quisiera modificar los datos maestros desde la web y que se
  vean para todos, haría falta un backend con base de datos y autenticación.
  Para este caso, editar `site.js` y redesplegar es la opción segura y sencilla.
- La persistencia del filtro se guarda con la clave `qtech:filter:<componente>`
  (ej. `qtech:filter:q-service-list`). Para resetear, borrar esa clave en DevTools
  o usar el botón "Limpiar" del formulario.

## 6. Archivos creados / modificados

Creados:
- `public/js/lib/storage.js`
- `public/js/lib/css.js`
- `public/js/lib/seo.js`
- `public/js/lib/element.js` (antes `elemento.js`)
- `public/js/lib/fill.js` (antes `rellenar.js`)
- `public/js/components/base/q-card.js`
- `public/js/components/base/q-card.css`
- `public/js/components/base/q-list.js` (antes `q-lista.js`)
- `public/js/components/base/q-list.css` (antes `q-lista.css`)
- `public/js/components/q-site-nav.js`
- `public/js/components/q-site-nav.css`
- `public/js/components/q-app-view.css`
- `public/js/components/q-hero.css`
- `public/js/components/q-page-head.css`
- `public/js/components/q-cta.css`
- `public/js/components/q-faq.css`
- `public/js/components/q-steps.js`
- `public/js/components/q-steps.css`
- `public/js/components/q-feature-grid.js`
- `public/js/components/q-feature-grid.css`
- `public/js/components/q-pricing.js`
- `public/js/components/q-pricing.css`
- `public/js/components/q-service-card.css`
- `public/js/components/q-product-card.css`
- `public/js/views/home-view.css`
- `public/js/views/services-view.css` (antes `servicios-view.css`)
- `public/js/views/products-view.css` (antes `productos-view.css`)
- `public/js/views/contact-view.css` (antes `contacto-view.css`)
- `docs/INFORME-MEJORAS.md`
- `docs/INFORME-DESPLIEGUE.md`

Modificados:
- `public/js/components/q-app-view.js`
- `public/js/components/q-hero.js`
- `public/js/components/q-page-head.js`
- `public/js/components/q-cta.js`
- `public/js/components/q-faq.js`
- `public/js/lib/router.js`
- `public/js/components/q-service-card.js`
- `public/js/components/q-product-card.js`
- `public/js/components/q-service-list.js`
- `public/js/components/q-product-grid.js`
- `public/js/views/home-view.js`
- `public/js/views/services-view.js` (antes `servicios-view.js`)
- `public/js/views/products-view.js` (antes `productos-view.js`)
- `public/js/views/contact-view.js` (antes `contacto-view.js`)
- `public/js/main.js`
- `public/index.html`
- `public/css/themes/light.css`
- `public/css/themes/dark.css`
- `public/css/layout.css`
- `public/css/global.css`

## 7. Refactor de nomenclatura y sistema de layout (2026-10-17)

### 7.1 Convención: código en inglés, contenido en español

Los identificadores (archivos, clases CSS, props, atributos, funciones, variables,
slots y eventos) pasan a **inglés**. Los textos visibles y las rutas URL se mantienen
en **español**.

| Antes | Ahora |
|---|---|
| `lib/elemento.js` / `Elemento` | `lib/element.js` / `BaseElement` |
| `lib/rellenar.js` / `rellenar` / `crear` | `lib/fill.js` / `fill` / `create` |
| `cargarEstilos` | `loadStyles` |
| `components/base/q-lista.*` / `ListaBase` | `components/base/q-list.*` / `ListBase` |
| `views/servicios-view.*` (tag `servicios-view`) | `views/services-view.*` (tag `services-view`) |
| `views/productos-view.*` | `views/products-view.*` |
| `views/contacto-view.*` | `views/contact-view.*` |
| `inyectarJsonLd` | `injectJsonLd` |
| `app:ficha` | `app:item` |
| props `filtros` / `filtro` / `sinFiltros` / `destacado` | `filters` / `filter` / `no-filters` / `featured` |
| `crearItem` | `createItem` |
| slots `titulo`/`texto`/`accion`/`descripcion`/`marcas`/`precio`/`nombre` | `title`/`text`/`action`/`description`/`tags`/`name` (el precio desaparece de la tarjeta de producto) |
| datos `nombre`/`claim`/`contacto`/`telefono`/`horario`/`direccion`/`servicios`/`productos`/`categoria`/`precio`/`familia`/`descripcion`/`marcas` | `name`/`tagline`/`contact`/`phone`/`hours`/`address`/`services`/`products`/`category`/`family`/`description`/`equipment` (el `price` de producto se elimina; `price` solo se usa en `pricing`) |
| clases CSS `.ancho`/`.bloque`/`.acciones`/`.cabecera-sitio`/`.pie-sitio`/`.marca`/`.saltar`/`.lista`/`.conteo`/`.campo`/`.formulario`/`.secundario` | `.container`/`.stack`/`.cluster`/`.site-header`/`.site-footer`/`.brand`/`.skip-link`/`.list`/`.count`/`.field`/`.form-section`/`.secondary` |
| anchor `#contenido` | `#content` |

> Los atributos booleanos se declaran en kebab-case (`no-filters`, `featured`),
> de forma que casen con `observedAttributes` (el antiguo `sinFiltros` en camelCase
> no llegaba a coincidir con el atributo HTML).

### 7.2 Sistema de layout (CSS Grid)

- **Breakpoints** (mobile-first, documentados como comentario): móvil base, móvil
  grande `≥ 30rem`, tablet `≥ 48rem`, PC `≥ 64rem`.
- **`css/layout.css`** (sin `@layer`, para poder adoptarse en shadow roots) reúne
  en un solo sitio el reset universal, el shell de página y los contenedores de
  contenido:
  - `.stack` — apilado vertical.
  - `.cluster` — fila que envuelve (nav, chips, acciones); flex a propósito, porque
    Grid no auto-envuelve filas.
  - `.section` / `.section-head` — sección de contenido y fila de título + acción.
  - `.card-grid` — rejilla de tarjetas con **columnas explícitas** `1 → 2 → 3`, sin
    usar la clásica división de 12 columnas.
  - `.card` — superficie de tarjeta compartida por todos los componentes tipo card.
  - Shell con **áreas con nombre**: `.page` → `grid-template-areas: "header" "main"
    "footer"` + `grid-template-rows: auto 1fr auto`; `.site-header` → `"brand"
    "nav"`, que pasa a `"brand nav"` en `≥ 48rem`; `.container` (antes `.ancho`),
    `.site-footer`, `.skip-link`, y los estados del router `.loading` / `.not-found`.
- **Nesting nativo** en todas las hojas (`> .brand`, `&:hover`, `@media` anidadas).
- Se eliminó el **código muerto** (`.grid-2`, `.grid-3`, `.boton`) y la
  **duplicación** de `.bloque`/`.acciones`: ahora hay una sola hoja de layout
  compartida entre el light DOM y los shadow roots (vía `adoptedStyleSheets`), y
  `forms.css` se reutiliza dentro de `contact-view`.
- **Verificación** en Chrome headless (390, 780 y 1280 px): las 4 rutas + 404
  renderizan sin errores de consola; el header usa `grid-template-areas`
  correctamente según el ancho; `.grid`, `q-steps` y `q-feature-grid` pasan de 1 a
  2 y 3 columnas; el filtrado funciona (`1 de 13 servicios`, persistencia en
  `localStorage`); las tarjetas se actualizan como custom elements, no muestran
  marcadores de lista y comparten altura por fila; y los productos no muestran
  precio.

## 8. Actualización de contenido y secciones nuevas (2026-10-17)

### 8.1 Datos reales del negocio

`site.js` pasa de contenido de ejemplo a los datos reales:

- **Contacto**: `qtech.servicios@gmail.com`, `662 93 00 58`,
  `Carrer de la Duana, 3 · 08003 Barcelona`, lunes a viernes de 9:00 a 15:00.
- **Zona**: Barcelona y área metropolitana; respuesta en menos de 24 horas
  laborables.
- **Dirección estructurada** (`street`, `postalCode`, `city`, `region`, `country`)
  para que `seo.js` genere un `PostalAddress` correcto.

### 8.2 Tipos de mantenimiento y catálogo

- `families` pasa a los cuatro tipos de mantenimiento:
  **Preventivo**, **Correctivo**, **Paliativo** y **Adaptativo**.
- La **revisión** y el **diagnóstico** son los primeros pasos del proceso
  (`process`), no una familia de servicio.
- **13 servicios** repartidos por tipo y por equipo (IPL, diodo, picosegundo,
  EMSculpt, criolipólisis, diatermia), con 3 marcados como `featured`.
- **14 productos** (cartuchos, puntas, filtros, módulos, consumibles y
  accesorios) **sin precio**: se consulta disponibilidad y presupuesto.
- El antiguo campo `brands` desaparece: el negocio es multimarca y de marca
  blanca. En su lugar, cada servicio declara `equipment` (tipos de equipo que
  cubre) y la tarjeta lo muestra en el slot `tags` (antes `brands`).

### 8.3 Secciones nuevas en Inicio

Todas se alimentan de `site.js` y se montan en `home-view`:

| Sección | Clave en `site.js` | Componente |
|---|---|---|
| Cómo trabajo | `process` | `q-steps` (lista ordenada numerada) |
| Garantías | `guarantees` | `q-feature-grid` |
| Logística | `logistics` | `q-feature-grid` |
| Tarifas de mano de obra | `pricing` | `q-pricing` |
| Preguntas frecuentes | `faqs` | `q-faq` (se rellena desde datos) |
| Llamada a la acción | `cta` | `q-cta` (se rellena desde datos) |

Tarifas: **45 €/hora + IVA**, presupuesto sin compromiso y desplazamiento según
zona. El precio ya no forma parte de las tarjetas de producto.

### 8.4 Ajustes de componentes

- `q-product-card` y `q-product-grid`: se elimina el slot `price`, el formateo
  con `Intl.NumberFormat` y la columna de precio del pie.
- `q-service-card`: slot `brands` → `tags`; se elimina la regla `.brands`.
- Se añaden `q-steps`, `q-feature-grid` y `q-pricing` con sus hojas `.css`.
- `q-service-list` importa `q-service-card.js` y `q-product-grid` importa
  `q-product-card.js`: sin esa importación los elementos creados dinámicamente
  no se actualizaban y su contenido se veía como texto plano.
- `q-list.css` y `q-service-card.css` reinician `list-style`, `margin` y
  `padding` de las listas dentro del shadow root (el reset global no cruza esa
  frontera).
- `q-card.css` fija `block-size: 100%` en el host para que las tarjetas de una
  misma fila compartan altura.
- El contador de `ListBase` concuerda con el total: `1 de 13 servicios`
  (antes `1 de 13 servicio`).
- `index.html` actualiza título, meta description, pie y `<noscript>` con el
  correo, teléfono, dirección y horario reales.

### 8.5 Verificación

35 comprobaciones automáticas en Chrome headless (CDP) sobre las cuatro rutas y
la 404:

- Contenido esperado presente y consola sin errores.
- 3 servicios destacados, 6 pasos, 3 tarifas y 7 FAQ en Inicio.
- 13 servicios con 4 filtros; el filtro deja `1 de 13 servicios` y persiste.
- 14 productos sin ningún símbolo `€`.
- Tarjetas actualizadas como custom elements, sin viñetas y con altura igualada.
- Contacto con correo, teléfono, dirección, zona y horario reales.
- JSON-LD con dirección estructurada y `areaServed`.
- Layout de 1/2/3 columnas en 390/780/1280 px para `.grid`, `q-steps` y
  `q-feature-grid`.

## 9. Layout universal y paleta sRGB (2026-10-18)

### 9.1 El problema: dos tarjetas que no encajaban

En móvil, al pasar a 2 columnas (`≥ 30rem`) las tarjetas se solapaban con la fila
siguiente. La causa no era el contenido: el reset `box-sizing: border-box` estaba
solo en el light DOM (`global.css`) y **no cruza el shadow boundary**. Dentro de
cada shadow root las tarjetas usaban `content-box`, de modo que con
`block-size: 100%` + `padding` + `border` medían 50 px más que su celda de grid:

| Componente | Celda (`li`) | Tarjeta interior | Desborde |
|---|---|---|---|
| `q-service-card` | 561 px | 611 px | **+50 px** |
| `q-product-card` | 364 px | 414 px | **+50 px** |
| `q-feature-grid` | 258 px | 308 px | **+50 px** |

### 9.2 Un solo `layout.css` adoptado en todos los shadow roots

- `css/layout.css` es ahora la única hoja de layout e incluye tres bloques: el
  **reset** que entra en shadow DOM (`box-sizing`, listas, márgenes), el **shell**
  de página y los **contenedores de contenido** (`.section`, `.section-head`,
  `.card`, `.card-grid`, `.stack`, `.cluster`). Se mantiene sin `@layer`, porque
  las capas no cruzan el shadow boundary.
- `css/primitives.css` desaparece: su contenido se fusiona en `layout.css`.
- `BaseElement` (`js/lib/element.js`) carga la hoja una sola vez y la antepone a
  **todas** las hojas de cada shadow root:
  `root.adoptedStyleSheets = [...new Set([layoutStyles, ...componentSheets])]`.
  Así cualquier componente, presente o futuro, hereda el mismo layout sin
  importarlo a mano; se eliminaron los 7 imports repetidos de `primitives.css`.
- `q-card.css` se reduce a comportamiento (`:host`, hover, `@starting-style`); la
  superficie `.card` vive en `layout.css`. `q-feature-grid` deja de definir su
  propia tarjeta y usa `.card` + `.card-grid`.
- Los componentes usan `.card-grid` (antes `.grid`) y comparten el reset
  `ul[class]`, que elimina los reset de listas repetidos.

### 9.3 Paleta sRGB

Los temas abandonan `oklch` y pasan a **sRGB** (hex / `rgb()`), manteniendo los
nombres de token. Retoques de contraste aplicados:

| Token | Antes | Ahora |
|---|---|---|
| claro `--color-text-subtle` | `#82868e` (3,34:1) | `#6a6e75` (4,69:1) |
| claro `--color-border` | `#d4d8dd` (1,44:1) | `#c9cdd3` (1,60:1) |
| oscuro `--color-border` | `#34383f` (1,40:1) | `#3e434b` (1,66:1) |

Las sombras usan `rgb(... / α)` y `--color-selection` usa `color-mix(in srgb, …)`.
Los tags de `q-service-card` usan `--color-accent-soft` en vez de
`color-mix(in oklab, …)`.

### 9.4 Aviso: enlaces y `::slotted()`

En contenido proyectado (slotted), las reglas del **árbol externo** ganan a las
reglas `::slotted()` del componente, **con independencia de la especificidad**.
Por eso `layout.css` **no** define un color global para `a`: chocaría con los
botones-enlace de `q-hero`/`q-cta`. Cada vista o componente fija su color
(`.section-head a`, `.contact a`, `::slotted(a)` en las tarjetas), y los enlaces
del light DOM heredan el color de `global.css`.

### 9.5 Verificación

- `box-sizing: border-box` y **altura de tarjeta == celda** en 390/480/768/1280 px,
  sin desbordes.
- Rejilla de 1/2/3 columnas en 390/480/1280 px.
- Colores de enlace correctos tanto en views como en slotted (`Solicitar`, botones
  del hero y del CTA) en claro y oscuro.
- 4 rutas + 404 sin errores de consola ni peticiones fallidas (ya no existe
  `primitives.css`).
- 13 servicios y 14 productos, sin `€` en productos, filtro persistente.

## 10. Sin `position` ni `z-index`, y menú móvil (2026-10-18)

### 10.1 Regla: todo en el flujo normal

El layout **no usa `position: absolute`, `fixed` ni `z-index`**. Todo se resuelve
con Grid/Flex y con el flujo normal del documento:

| Caso | Antes | Ahora |
|---|---|---|
| Skip link | `position: absolute` + `z-index: 100` | En flujo, 1×1 px con `clip-path: inset(50%)`; al enfocar crece y empuja la página |
| Chips de filtro | `<input type="radio">` oculto con `position: absolute` | `<button>` reales con `aria-pressed` |
| Grupo de filtros | `<fieldset>` + `<legend class="sr-only">` | `<div role="group" aria-label>`; se elimina `.sr-only` |
| Menú móvil | — | Panel en flujo: al abrirse empuja `main` hacia abajo |

El skip link oculto fija `padding: 0` (con `box-sizing: border-box`, un padding
distinto de cero impediría que la caja bajara de 32×16 px); al recibir `:focus`
recupera padding, tamaño y `clip-path: none`.

Como corolario, los chips dejan de ser radios y pasan a ser botones: se pierde la
navegación con flechas del grupo de radios (pasan a ser 5 tab stops), algo
aceptable con solo 4 filtros. El estado sigue persistiendo en `localStorage`.

### 10.2 Cabecera y menú hamburguesa

- `.site-header` usa Grid en una sola fila: `grid-template-areas: "brand nav"` con
  `grid-template-columns: auto 1fr`; marca a la izquierda y navegación a la
  derecha. En móvil se alinea arriba (`align-items: start`) y desde `≥ 48rem` se
  centra.
- `q-site-nav` añade un `<button class="toggle">` visible solo en móvil, con
  `aria-label="Menú"`, `aria-expanded` y `aria-controls="site-menu"`. Al pulsarlo
  conmuta el atributo `data-open` en el `<nav>`; el `<ul>` pasa de
  `display: none` a `display: grid` y ocupa el ancho de la columna de navegación.
- No es un overlay: el panel se abre **en el flujo**, así que no necesita
  `position` ni `z-index` y nunca tapa contenido. En escritorio (`≥ 48rem`) el
  botón se oculta y la lista vuelve a ser una fila `flex` con `flex-wrap`.
- El menú se cierra al navegar (suscripción a `router`) y con `Escape`, que
  devuelve el foco al botón. El estado no se refleja vía `props` porque la
  reflexión booleana deja el atributo en `"false"` en lugar de eliminarlo; se
  conmuta manualmente con `toggleAttribute`.
- Enlaces del menú a ancho completo de su fila para que el objetivo táctil no se
  limite al texto.

### 10.3 Verificación

- 0 declaraciones `position: absolute|fixed|sticky` y 0 `z-index` en las 43 hojas
  (globales y adoptadas por los shadow roots), y 0 estilos en línea.
- Skip link: 1×1 px oculto; al enfocar, 171×42 px con padding y sin `clip-path`.
- Chips: `role="group"` con `aria-label`, botones con `aria-pressed`, filtro y
  persistencia correctos (`5 de 13 servicios`).
- Menú: a 390 px el botón es visible y la lista no; al pulsar, `data-open`,
  `aria-expanded="true"` y `display: grid`; `Escape` cierra y devuelve el foco;
  a 768 px el botón se oculta y la lista es `flex`.
- Cabecera en la misma fila (marca y nav con el mismo `top`), tarjetas sin
  desbordes en 390/480/1280 px y sin errores de consola.
