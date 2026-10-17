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
    primitives.css       (NUEVO: .stack / .cluster / .grid compartidos)
    forms.css
    typography.css
    layout.css           (shell: .page / .site-header / main / .site-footer)
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
- `public/css/primitives.css`
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
- **`css/primitives.css`** (sin `@layer`, para poder adoptarse en shadow roots):
  - `.stack` — apilado vertical.
  - `.cluster` — fila que envuelve (nav, chips, acciones); flex a propósito, porque
    Grid no auto-envuelve filas.
  - `.grid` — rejilla de tarjetas con **columnas explícitas** `1 → 2 → 3`, sin usar
    la clásica división de 12 columnas.
- **`css/layout.css`**: shell con **áreas con nombre**:
  - `.page` → `grid-template-areas: "header" "main" "footer"` + `grid-template-rows: auto 1fr auto`.
  - `.site-header` → `"brand" "nav"`, que pasa a `"brand nav"` en `≥ 48rem`.
  - `.container` (antes `.ancho`), `.site-footer`, `.skip-link`, y los estados del
    router `.loading` / `.not-found`.
- **Nesting nativo** en todas las hojas (`> .brand`, `&:hover`, `@media` anidadas).
- Se eliminó el **código muerto** (`.grid-2`, `.grid-3`, `.boton`) y la
  **duplicación** de `.bloque`/`.acciones`: ahora hay una sola primitiva compartida
  entre el light DOM y los shadow roots (vía `adoptedStyleSheets`), y `forms.css`
  se reutiliza dentro de `contact-view`.
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
