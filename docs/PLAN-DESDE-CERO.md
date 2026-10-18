# Plan desde cero — Qtech.es

Fecha: 2026-10-18

Guía de reconstrucción del proyecto **desde 0**: en qué orden hacer las tareas y por
qué ese orden. Recoge las decisiones ya tomadas (web estática vanilla, un solo
`index.html`, router por hash, custom elements con Shadow DOM y CSS externo por
componente) y las convierte en una secuencia con dependencias.

---

## 1. Idea clave

El orden no es arbitrario: sigue las **dependencias reales** entre capas.

```
decisiones → CSS base (tokens + layout) → libs JS → componentes base
          → componentes → datos → vistas → main.js → pruebas → despliegue
```

Regla que gobierna todo lo demás:

> **Nunca dejar `layout.css` (ni los tokens) para el final.** Los componentes viven
> dentro de shadow roots que adoptan `layout.css`, y su CSS usa los tokens de color.
> Si creas componentes antes de que existan esas hojas, se ven sin reset y sin color.

---

## 2. El "huevo y gallina" de los estilos

`BaseElement` (`js/lib/element.js`) antepone `layout.css` a **todas** las hojas de
cada shadow root:

```js
root.adoptedStyleSheets = [...new Set([layoutStyles, ...componentSheets])];
```

Consecuencias de crear un componente antes de tiempo:

| Falta… | Qué se rompe |
|---|---|
| `layout.css` | Sin `box-sizing: border-box`, sin reset de listas ni de márgenes dentro del shadow root; `.card` / `.card-grid` no existen → cajas que desbordan su celda |
| `themes/light.css` + `dark.css` | Los componentes que usan `--color-surface`, `--color-border`, etc. se ven sin color |
| `lib/css.js` | Ningún componente puede cargar su `.css` con `loadStyles()` |

Por eso el CSS base va **antes** de los componentes, no después.

---

## 3. Secuencia recomendada (lineal)

### Fase 0 · Decisiones y preparación

1. **Fijar el enfoque técnico**: web estática (HTML/CSS/JS), **sin backend, sin base
   de datos, sin build**, con `index.html` único y todo lo demás generado por JS.
2. **Elegir el modelo de rutas**: SPA con **router por hash** (`#/`, `#/servicios`,
   `#/productos`, `#/contacto`), para no depender de reglas de rewrite en el hosting.
3. **Crear el repositorio** e inicializar Git; añadir `.gitignore`.
4. **Preparar el entorno local**: navegador con DevTools + servidor HTTP gratuito
   (`python3 -m http.server` dentro de `public/`, o Live Server). Es **obligatorio**
   servir por HTTP: sin `file://` no funcionan los módulos ES ni el `fetch` del CSS.

### Fase 1 · Estructura (HTML)

5. **Crear la estructura de carpetas**:
   `public/`, `public/css/`, `public/css/themes/`, `public/js/data/`,
   `public/js/lib/`, `public/js/components/` (con `base/`), `public/js/views/`.
6. **`index.html`**: es el "contrato" de todo el proyecto. Define qué etiquetas
   existen antes de escribirlas.
   - `<head>`: charset, viewport, `color-scheme`, meta SEO, favicon, fuente,
     `global.css`, `main.js` (`type="module"`).
   - `<body>`: skip link, shell `.page` (`header` / `main#content` / `footer`),
     `<q-site-nav>`, `<q-app-view>`, `<noscript>`.

### Fase 2 · CSS base (antes que los componentes)

7. **Tokens y temas**: `themes/light.css` + `themes/dark.css` (paleta en **sRGB**,
   tokens semánticos), conmutados con `prefers-color-scheme` desde `global.css`.
8. **`layout.css`**: reset que **cruce el shadow boundary** (`box-sizing`, listas,
   márgenes) + shell de página (`.page` con `grid-template-areas`) + contenedores
   (`.container`, `.section`, `.section-head`, `.card`, `.card-grid`, `.stack`,
   `.cluster`).
9. **`typography.css`** y **`forms.css`**.
10. **Reglas de estilo del proyecto**: mobile-first (base, `30rem`, `48rem`,
    `64rem`), **sin `position` ni `z-index`**, nesting nativo, **código en inglés /
    contenido en español**.

### Fase 3 · Núcleo JS (librerías)

11. **`lib/css.js`**: `loadStyles(url)` — descarga el `.css`, lo convierte a
    `CSSStyleSheet` y lo memoiza (una descarga por URL).
12. **`lib/element.js`**: `BaseElement` — estilos en array, adopta `layout.css` +
    hojas propias en **todos** los shadow roots, mapeo atributo→propiedad,
    booleanos en kebab-case.
13. **`lib/fill.js`**: helpers `fill` / `create` para render declarativo.
14. **`lib/define.js`**: helper de registro de custom elements.

### Fase 4 · Componentes base

15. **`base/q-card.js` + `.css`**: cáscara visual compartida por las tarjetas.
16. **`base/q-list.js` + `.css`**: lógica común de filtrado (chips, contador
    `aria-live`, ocultar/mostrar, persistencia del filtro en `localStorage`).
17. **Validar el patrón end-to-end** con un componente vertical sencillo
    (p. ej. `q-site-nav` o `q-hero`): si carga su CSS, hereda `layout.css` y usa
    tokens, el patrón está bien y se puede replicar.

### Fase 5 · Componentes específicos y de contenido

18. **Estructura y navegación**: `q-app-view.js` (outlet que monta la vista según el
    router) y `q-site-nav.js` (menú desde `site.nav`, `aria-current`, botón
    hamburguesa en móvil **en flujo**).
19. **Bloques de contenido**: `q-hero`, `q-page-head`, `q-cta`, `q-faq`, `q-steps`,
    `q-feature-grid`, `q-pricing` (cada uno con su `.css`).
20. **Tarjetas y listas concretas**: `q-service-card`, `q-product-card`,
    `q-service-list`, `q-product-grid` (extienden `QCard` / `ListBase` e importan su
    tarjeta; sin esa importación los elementos creados dinámicamente no se
    actualizan).
21. Cada componente carga su CSS con
    `loadStyles(new URL("./x.css", import.meta.url))`.

### Fase 6 · Lógica de aplicación

22. **`lib/router.js`**: clase `Router` con `start` / `navigate` / `subscribe` /
    `current`, estados de carga y 404, guardia anti-carrera, título dinámico, foco al
    `<h1>` y scroll al inicio.
23. **`lib/storage.js`**: `StorageManager` (`get`/`set` con JSON y fallback en
    memoria) + instancias `local` y `session`.
24. **`lib/seo.js`**: `injectJsonLd` — JSON-LD `LocalBusiness` desde `site.js`
    (dirección estructurada + `areaServed`).

### Fase 7 · Datos

25. **`data/site.js`**: única fuente de verdad — nombre, tagline, nav, contacto,
    dirección, `families`, servicios, productos, `process`, `guarantees`,
    `logistics`, `pricing`, `faqs`, `cta`.

### Fase 8 · Vistas

26. **`home-view`**: hero + servicios destacados + productos + `q-steps` +
    `q-feature-grid` (garantías, logística) + `q-pricing` + `q-faq` + `q-cta`.
27. **`services-view`**: lista con filtros por tipo de mantenimiento.
28. **`products-view`**: grid con filtros por categoría (sin precios).
29. **`contact-view`**: datos de contacto + formulario `mailto:` con borrador en
    `sessionStorage`.
30. **CSS de cada vista** (`.css` propio, reutilizando `forms.css` donde haga falta).

### Fase 9 · Montaje final

31. **`main.js`**: importar datos, router, SEO, componentes y vistas; escuchar
    eventos `app:*`; suscribir el router; `injectJsonLd(site)`; `router.start(outlet)`;
    título inicial.
32. **Repasar `index.html`** con el contenido real (título, meta, autor, pie, correo,
    teléfono, dirección, horario).

### Fase 10 · Verificación

33. **Servir en local** y revisar las 4 rutas + 404 sin errores de consola ni
    peticiones fallidas.
34. **Responsive**: 1/2/3 columnas en 390/480/768/1280 px; sin desbordes (altura de
    tarjeta == altura de celda).
35. **Accesibilidad**: navegación por teclado, skip link, menú móvil (apertura,
    cierre con `Escape`, foco devuelto al botón), contadores `aria-live`,
    `aria-current`.
36. **Persistencia**: filtro recordado en `localStorage`, borrador del formulario en
    `sessionStorage`.
37. **Temas**: claro/oscuro según el sistema, contraste de tokens,
    `prefers-reduced-motion`.
38. **SEO**: `<title>` dinámico y JSON-LD con dirección estructurada.
39. **Auditoría de reglas**: 0 `position: absolute|fixed|sticky`, 0 `z-index`, 0
    estilos en línea.

### Fase 11 · Despliegue

40. **Elegir hosting estático** (Netlify / Cloudflare Pages / Vercel / GitHub Pages) y
    publicar **solo `public/`**, sin comando de build.
41. **Conectar el repo** para despliegue automático en cada `push`.
42. **Dominio y DNS**: apuntar el dominio y verificar HTTPS.
43. **(Opcional) Formularios**: sustituir el `mailto:` por un servicio estático
    (Netlify Forms, Formspree, Web3Forms…).

---

## 4. Camino alternativo (iterativo)

Si prefieres ver resultados cuanto antes y construir "de fuera hacia dentro", es
válido mientras respetes la regla del punto 2 (el CSS base siempre antes que los
componentes):

1. `index.html` con la estructura.
2. `global.css` + tokens mínimos + `layout.css` (aunque sea básico).
3. `BaseElement` + `loadStyles`.
4. Un componente "vertical" (`q-site-nav` o `q-hero`) para validar el patrón.
5. Replicar el patrón con el resto de componentes.
6. Vistas + router + `main.js`.

La única diferencia con la secuencia lineal es **cuándo** escribes cada pieza de
CSS; lo que **no** funciona es escribir componentes y dejar el layout para el final.

---

## 5. Checklist resumido

- [ ] Fase 0 — Decisiones y preparación.
- [ ] Fase 1 — Estructura `index.html`.
- [ ] Fase 2 — CSS base (tokens, `layout.css`, typography, forms).
- [ ] Fase 3 — Libs JS (`css`, `element`, `fill`, `define`).
- [ ] Fase 4 — Componentes base (`q-card`, `q-list`).
- [ ] Fase 5 — Componentes específicos y de contenido.
- [ ] Fase 6 — `router`, `storage`, `seo`.
- [ ] Fase 7 — `data/site.js`.
- [ ] Fase 8 — Vistas (`home`, `services`, `products`, `contact`).
- [ ] Fase 9 — `main.js` y contenido real en `index.html`.
- [ ] Fase 10 — Verificación (rutas, responsive, a11y, temas, SEO, reglas).
- [ ] Fase 11 — Despliegue (hosting, dominio, formularios).
