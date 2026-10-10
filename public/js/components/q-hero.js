import { Elemento } from "../lib/elemento.js";
import { define } from "../lib/define.js";

const template = document.createElement("template");
template.innerHTML = `
  <section class="hero">
    <p class="eyebrow"><slot name="eyebrow"></slot></p>
    <h1 tabindex="-1"><slot name="titulo"></slot></h1>
    <p class="intro"><slot name="intro"></slot></p>
    <div class="acciones"><slot name="accion"></slot></div>
  </section>`;

const styles = new CSSStyleSheet();
styles.replaceSync(`
  :host { display: block; }

  .hero {
    display: grid;
    gap: var(--space-4);
    max-inline-size: 52rem;
    padding: var(--space-5) 0 var(--space-6);
  }

  .eyebrow {
    font-size: 0.875rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--color-accent);
  }

  h1 {
    font-size: var(--font-size-step-3);
    line-height: 1.05;
    text-wrap: balance;
  }

  .intro {
    font-size: var(--font-size-step-1);
    color: var(--color-text-muted);
    max-inline-size: 40rem;
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
    border: 1px solid transparent;
    border-radius: var(--radius-sm);
    font-weight: 600;
    text-decoration: none;
    background-color: var(--color-accent);
    color: var(--color-accent-contrast);
  }

  ::slotted(a.secundario) {
    background-color: transparent;
    border-color: var(--color-border);
    color: var(--color-text);
  }

  ::slotted(a):hover { filter: brightness(1.08); }
`);

class Hero extends Elemento {
  static template = template;
  static styles = styles;
}

define("q-hero", Hero);
