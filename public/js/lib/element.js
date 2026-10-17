import { loadStyles } from "./css.js";

const toCamel = (value) => value.replace(/-([a-z])/g, (_, char) => char.toUpperCase());

/**
 * Universal layout sheet (reset + sections + cards + page shell). Every shadow
 * root adopts it, so components share the same structure no matter where they
 * live. Cascade layers do not cross shadow boundaries, hence the direct adopt.
 */
const layoutStyles = await loadStyles(new URL("../../css/layout.css", import.meta.url));

/**
 * Upgrades a subtree so custom element properties can be assigned.
 */
export function upgradeTree(root) {
  for (const element of root.querySelectorAll("*")) {
    if (element.constructor === HTMLElement) customElements.upgrade(element);
  }
  return root;
}

/**
 * Base class for every component.
 *
 * - `static template` -> <template> with the shadow root markup.
 * - `static styles`   -> CSSStyleSheet or array of CSSStyleSheets (shared sheets).
 * - `static props`    -> { "attribute-name": { prop, type, default, reflect, attr } }
 */
export class BaseElement extends HTMLElement {
  static props = {};
  static styles = null;
  static template = null;

  #data = new Map();
  #scheduled = false;
  #attributes = new Map();

  constructor() {
    super();

    const root = this.attachShadow({ mode: "open" });

    const sheets = this.constructor.styles;
    const list = Array.isArray(sheets) ? sheets : sheets ? [sheets] : [];
    root.adoptedStyleSheets = [...new Set([layoutStyles, ...list])];

    if (this.constructor.template) {
      root.append(this.constructor.template.content.cloneNode(true));
    }

    for (const [attr, definition] of Object.entries(this.constructor.props)) {
      const prop = definition.prop ?? toCamel(attr);
      this.#data.set(prop, definition.default ?? null);
      this.#attributes.set(definition.attr ?? attr, { prop, definition });

      Object.defineProperty(this, prop, {
        get: () => this.#data.get(prop),
        set: (value) => {
          const previous = this.#data.get(prop);
          if (previous === value) return;
          this.#data.set(prop, value);

          if (this.isConnected && definition.reflect && definition.type) {
            const name = definition.attr ?? attr;
            const serialized = String(value);
            if (serialized) this.setAttribute(name, serialized);
            else this.removeAttribute(name);
          }

          this.#schedule();
        },
      });
    }
  }

  static get observedAttributes() {
    return Object.entries(this.props)
      .filter(([, definition]) => definition?.type)
      .map(([attr, definition]) => definition.attr ?? attr);
  }

  #schedule() {
    if (this.#scheduled) return;
    this.#scheduled = true;
    queueMicrotask(() => {
      this.#scheduled = false;
      this.render();
    });
  }

  connectedCallback() {
    upgradeTree(this.shadowRoot);
    this.render();
  }

  disconnectedCallback() {}

  attributeChangedCallback(attr, _previous, next) {
    const entry = this.#attributes.get(attr);
    if (!entry) return;
    const { prop, definition } = entry;

    if (definition.type === Boolean) {
      this[prop] = next !== null && next !== "false";
    } else if (definition.type === Number) {
      this[prop] = next === null ? null : Number(next);
    } else {
      this[prop] = next;
    }
  }

  render() {}

  /* Helpers */

  $(selector) {
    return this.shadowRoot.querySelector(selector);
  }

  $$(selector) {
    return this.shadowRoot.querySelectorAll(selector);
  }

  emit(type, detail) {
    return this.dispatchEvent(new CustomEvent(type, { detail, bubbles: true, composed: true }));
  }
}
