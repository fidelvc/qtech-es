import { Elemento } from "../lib/elemento.js";
import { define } from "../lib/define.js";

const template = document.createElement("template");
template.innerHTML = `
  <article class="card" part="card">
    <header>
      <h3><slot name="nombre"></slot></h3>
      <p class="ref"><slot name="ref"></slot></p>
    </header>
    <p class="desc"><slot name="descripcion"></slot></p>
    <footer>
      <p class="precio"><slot name="precio"></slot></p>
      <slot name="accion"></slot>
    </footer>
  </article>`;

const styles = new CSSStyleSheet();
styles.replaceSync(`
  :host {
    display: block;
    transition: translate 180ms, opacity 180ms;
  }

  :host(:hover) { translate: 0 -2px; }

  .card {
    display: grid;
    gap: var(--space-3);
    align-content: start;
    block-size: 100%;
    padding: var(--space-4);
    background-color: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-1);
  }

  :host(:hover) .card { border-color: var(--color-accent); }

  header {
    display: grid;
    gap: var(--space-1);
  }

  h3 {
    font-size: var(--font-size-step-0);
    font-weight: 600;
    line-height: 1.3;
    text-wrap: balance;
  }

  .ref {
    font-family: ui-monospace, monospace;
    font-size: 0.75rem;
    color: var(--color-text-muted);
  }

  .desc {
    font-size: 0.9375rem;
    color: var(--color-text-muted);
  }

  footer {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-3);
    align-items: center;
    justify-content: space-between;
    margin-block-start: auto;
    padding-block-start: var(--space-2);
    border-block-start: 1px solid var(--color-border);
  }

  .precio {
    font-size: var(--font-size-step-1);
    font-weight: 600;
    font-variant-numeric: tabular-nums;
  }

  ::slotted(button) {
    padding: var(--space-1) var(--space-3);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    background-color: transparent;
    font-size: 0.875rem;
  }

  ::slotted(button:hover) { border-color: var(--color-accent); }

  @starting-style {
    :host { opacity: 0; translate: 0 8px; }
  }
`);

class ProductCard extends Elemento {
  static template = template;
  static styles = styles;

  static props = {
    ref: { valor: "" },
    categoria: { valor: "" },
  };
}

define("q-product-card", ProductCard);
