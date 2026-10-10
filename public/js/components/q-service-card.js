import { Elemento } from "../lib/elemento.js";
import { define } from "../lib/define.js";

const template = document.createElement("template");
template.innerHTML = `
  <article class="card" part="card">
    <header><h3><slot name="titulo"></slot></h3></header>
    <p class="desc"><slot name="descripcion"></slot></p>
    <ul class="marcas" part="marcas"><slot name="marcas"></slot></ul>
    <footer><slot name="accion"></slot></footer>
  </article>`;

const styles = new CSSStyleSheet();
styles.replaceSync(`
  :host {
    display: block;
    transition: border-color 180ms, translate 180ms, opacity 180ms;
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

  :host([destacado]) .card {
    border-inline-start: 4px solid var(--color-accent);
  }

  h3 {
    font-size: var(--font-size-step-1);
    line-height: 1.25;
    text-wrap: balance;
  }

  .desc {
    color: var(--color-text-muted);
  }

  .marcas {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
  }

  ::slotted(li) {
    padding: var(--space-1) var(--space-2);
    font-size: 0.875rem;
    border-radius: 999px;
    color: var(--color-accent);
    background-color: color-mix(in oklab, var(--color-accent) 14%, transparent);
  }

  ::slotted(a) { font-weight: 600; }

  @starting-style {
    :host { opacity: 0; translate: 0 8px; }
  }
`);

class ServiceCard extends Elemento {
  static template = template;
  static styles = styles;

  static props = {
    destacado: { tipo: Boolean, refleja: true, valor: false },
    titulo: { valor: "" },
  };

  connectedCallback() {
    super.connectedCallback();

    // El título vive en el light DOM (slot), así que se lee de los nodos
    // asignados en lugar de desde el shadow.
    this.addEventListener("click", (evento) => {
      // El contenido viene por slots, así que puede estar dentro de otro
      // shadow root: `target` retargeteado no sirve, hace falta composedPath().
      const origen = evento.composedPath()[0];
      if (origen?.closest?.('a[href^="#/"]')) return;

      this.emit("q-service-card:activar", { titulo: this.#titulo() });
    });
  }

  #titulo() {
    const slot = this.$('slot[name="titulo"]');
    return (slot?.assignedNodes({ flatten: true }) ?? [])
      .map((nodo) => nodo.textContent ?? "")
      .join("")
      .trim();
  }
}

define("q-service-card", ServiceCard);
