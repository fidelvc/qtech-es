const camel = (s) => s.replace(/-([a-z])/g, (_, c) => c.toUpperCase());

/**
 * Fuerza el "upgrade" de un subárbol para poder asignarle propiedades.
 *
 * Trampa importante: los elementos que salen de `template.content.cloneNode()`
 * se crean sin ejecutar su constructor. Cuando esa plantilla vive en un shadow
 * root y el padre se inserta en el documento, las reacciones de upgrade se
 * ejecutan de arriba abajo: en el `connectedCallback` de la vista, el hijo
 * todavía NO está personalizado, así que su accessor `productos` no existe.
 * `hijo.productos = [...]` crea entonces un campo propio que el constructor
 * sobrescribe en cuanto define el accessor, y el dato se pierde en silencio.
 *
 * `customElements.upgrade()` sube el subárbol en orden de árbol, define los
 * hijos y dispara sus `connectedCallback` de forma síncrona.
 *
 * Limitación: no sirve para contenido que sigue en un `DocumentFragment`
 * clonado de un `<template>`. Ese contenido pertenece al documento inerte del
 * template, y la especificación hace que `upgrade` retorne sin hacer nada si
 * el documento no está activo. En ese caso hay que insertar primero en el DOM
 * y asignar las propiedades después (ver `render()` de q-product-grid).
 *
 * @param {ParentNode} raiz
 * @returns {ParentNode} la misma raíz, para encadenar
 */
export function subir(raiz) {
  for (const el of raiz.querySelectorAll("*")) {
    if (el.constructor === HTMLElement) customElements.upgrade(el);
  }
  return raiz;
}

/**
 * Clase base de todos los componentes.
 *
 * - `static template`  -> <template> con el markup del shadow root.
 * - `static styles`    -> CSSStyleSheet (hoja compartida entre instancias).
 * - `static props`     -> { attr: { prop, tipo, valor, refleja } }
 *
 * Los estilos nunca usan selectores del documento: solo `:host()`, `::slotted()`
 * y tokens heredados. Por eso el cambio de tema llega a los shadow roots sin
 * necesidad de re-renderizar nada.
 */
export class Elemento extends HTMLElement {
  static props = {};
  static styles = null;
  static template = null;

  #datos = new Map();
  #pendiente = false;

  constructor() {
    super();

    // Sin `delegatesFocus`: estos componentes son contenedores, no widgets.
    // Delegar el foco haría que `document.activeElement` fuera siempre el host
    // y complicaría mover el foco al <h1> de cada vista.
    const root = this.attachShadow({ mode: "open" });

    if (this.constructor.styles) {
      root.adoptedStyleSheets = [this.constructor.styles];
    }

    if (this.constructor.template) {
      root.append(this.constructor.template.content.cloneNode(true));
    }

    for (const [attr, def] of Object.entries(this.constructor.props)) {
      const prop = def.prop ?? camel(attr);
      this.#datos.set(prop, def.valor ?? null);

      Object.defineProperty(this, prop, {
        get: () => this.#datos.get(prop),
        set: (valor) => {
          const anterior = this.#datos.get(prop);
          if (anterior === valor) return;
          this.#datos.set(prop, valor);

          if (this.isConnected && def.refleja && def.tipo) {
            const serializado = String(valor);
            if (serializado) this.setAttribute(attr, serializado);
            else this.removeAttribute(attr);
          }

          this.#programar();
        },
      });
    }
  }

  static get observedAttributes() {
    return Object.entries(this.props)
      .filter(([, def]) => def?.tipo)
      .map(([attr, def]) => def.attr ?? attr);
  }

  #programar() {
    if (this.#pendiente) return;
    this.#pendiente = true;
    queueMicrotask(() => {
      this.#pendiente = false;
      this.render();
    });
  }

  /* Puntos de extensión */

  connectedCallback() {
    // Antes de renderizar: personaliza el subárbol de la plantilla, para que
    // quien extienda esta clase pueda asignar propiedades a sus hijos
    // inmediatamente después de `super.connectedCallback()`.
    subir(this.shadowRoot);
    this.render();
  }

  disconnectedCallback() {}

  attributeChangedCallback() {
    this.#programar();
  }

  render() {}

  /* Utilidades */

  $(selector) {
    return this.shadowRoot.querySelector(selector);
  }

  $$(selector) {
    return this.shadowRoot.querySelectorAll(selector);
  }

  /**
   * Evento con composed:true para que atraviese el shadow root.
   * El nombre debe llevar el prefijo del componente (p. ej. "q-product-grid:seleccion").
   */
  emit(tipo, detail) {
    return this.dispatchEvent(
      new CustomEvent(tipo, { detail, bubbles: true, composed: true }),
    );
  }
}
