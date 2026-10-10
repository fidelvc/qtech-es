import { Elemento } from "../lib/elemento.js";
import { define } from "../lib/define.js";

const template = document.createElement("template");
template.innerHTML = `
  <header class="cabecera">
    <p class="eyebrow"><slot name="eyebrow"></slot></p>
    <h1 tabindex="-1"><slot name="titulo"></slot></h1>
    <p class="intro"><slot name="intro"></slot></p>
  </header>`;

const styles = new CSSStyleSheet();
styles.replaceSync(`
  :host {
    display: grid;
    gap: var(--space-3);
    max-inline-size: 46rem;
    margin-block-end: var(--space-5);
  }

  h1 {
    font-size: var(--font-size-step-3);
    line-height: 1.1;
    text-wrap: balance;
  }

  h1:focus { outline: none; }

  .eyebrow {
    font-size: 0.875rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--color-accent);
  }

  .eyebrow:empty { display: none; }

  .intro {
    font-size: var(--font-size-step-1);
    color: var(--color-text-muted);
    text-wrap: pretty;
  }

  .intro:empty { display: none; }
`);

class PageHead extends Elemento {
  static template = template;
  static styles = styles;
}

define("q-page-head", PageHead);
