import { Elemento } from "../lib/elemento.js";
import { define } from "../lib/define.js";

const template = document.createElement("template");
template.innerHTML = `
  <section class="cta">
    <h2><slot name="titulo"></slot></h2>
    <p class="texto"><slot name="texto"></slot></p>
    <div class="acciones"><slot name="accion"></slot></div>
  </section>`;

const styles = new CSSStyleSheet();
styles.replaceSync(`
  :host { display: block; }

  .cta {
    display: grid;
    gap: var(--space-3);
    justify-items: start;
    padding: var(--space-5);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    background-color: var(--color-surface-alt);
  }

  h2 {
    font-size: var(--font-size-step-2);
    line-height: 1.15;
    text-wrap: balance;
  }

  .texto {
    color: var(--color-text-muted);
  }

  .acciones {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-3);
    margin-block-start: var(--space-2);
  }

  ::slotted(a) {
    display: inline-flex;
    align-items: center;
    padding: var(--space-2) var(--space-4);
    border-radius: var(--radius-sm);
    font-weight: 600;
    text-decoration: none;
    background-color: var(--color-accent);
    color: var(--color-accent-contrast);
  }
`);

class Cta extends Elemento {
  static template = template;
  static styles = styles;
}

define("q-cta", Cta);
