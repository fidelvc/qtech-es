import { Elemento } from "../lib/elemento.js";
import { define } from "../lib/define.js";

const template = document.createElement("template");
template.innerHTML = `<slot></slot>`;

const styles = new CSSStyleSheet();
styles.replaceSync(`
  :host {
    display: grid;
    gap: var(--space-2);
    max-inline-size: 46rem;
  }

  summary {
    padding: var(--space-3) 0;
    border-block-end: 1px solid var(--color-border);
    font-weight: 600;
    cursor: pointer;
    list-style-position: outside;
  }

  summary:hover { color: var(--color-accent); }

  ::slotted(details) { padding-block: var(--space-2); }

  ::slotted(p) {
    padding-block-start: var(--space-2);
    color: var(--color-text-muted);
    text-wrap: pretty;
  }
`);

class Faq extends Elemento {
  static template = template;
  static styles = styles;
}

define("q-faq", Faq);
