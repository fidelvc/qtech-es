import { Elemento } from "../lib/elemento.js";
import { define } from "../lib/define.js";
import { crear } from "../lib/rellenar.js";

const template = document.createElement("template");
template.innerHTML = `
  <div class="filtros">
    <fieldset>
      <legend class="sr-only">Filtrar por familia de servicio</legend>
      <label><input type="radio" name="familia" value="" checked> Todas</label>
      <slot name="familias"></slot>
    </fieldset>
  </div>
  <p class="conteo" role="status" aria-live="polite"></p>
  <ul class="grid" part="grid"><slot></slot></ul>`;

const styles = new CSSStyleSheet();
styles.replaceSync(`
  :host {
    display: grid;
    gap: var(--space-4);
  }

  fieldset {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
    border: 0;
    padding: 0;
    margin: 0;
  }

  .filtros label {
    padding: var(--space-1) var(--space-3);
    border: 1px solid var(--color-border);
    border-radius: 999px;
    font-size: 0.875rem;
    cursor: pointer;
  }

  .filtros input {
    position: absolute;
    opacity: 0;
  }

  .filtros label:has(:checked) {
    background-color: var(--color-accent);
    border-color: var(--color-accent);
    color: var(--color-accent-contrast);
  }

  .filtros label:has(:focus-visible) {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
  }

  /* El <legend> vive dentro del shadow root, así que no hereda utilidades
     del documento: hay que definirlo aquí. */
  .sr-only {
    position: absolute;
    inline-size: 1px;
    block-size: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }

  .conteo {
    font-size: 0.875rem;
    color: var(--color-text-muted);
  }

  .grid {
    display: grid;
    gap: var(--space-4);
    grid-template-columns: repeat(auto-fill, minmax(18rem, 1fr));
  }

  li[hidden] { display: none; }
`);

class ServiceList extends Elemento {
  static template = template;
  static styles = styles;

  static props = {
    servicios: { valor: [] },
    familia: { prop: "familia", valor: "" },
  };

  #construido = false;

  connectedCallback() {
    super.connectedCallback();

    this.addEventListener("change", (evento) => {
      if (evento.target.name !== "familia") return;
      this.familia = evento.target.value;
      this.#aplicarFiltro();
      this.emit("q-service-list:filtro", { familia: this.familia });
    });

    // Delegación: los eventos de las tarjetas (composed:true) suben por el
    // light DOM hasta aquí, así que no hace falta un listener por tarjeta.
    this.addEventListener("q-service-card:activar", (evento) => {
      this.emit("q-service-list:activar", { titulo: evento.detail.titulo });
    });

    this.render();
  }

  render() {
    if (this.#construido || !this.servicios.length) return;

    const frag = document.createDocumentFragment();

    for (const servicio of this.servicios) {
      const card = document.createElement("q-service-card");
      card.destacado = Boolean(servicio.destacado);
      card.dataset.familia = servicio.familia;

      card.append(
        crear("span", servicio.titulo, { slot: "titulo" }),
        crear("span", servicio.descripcion, { slot: "descripcion" }),
      );

      // Cada <li> va como hijo directo de la tarjeta: el slot solo proyecta
      // nodos del light DOM que sean hijos directos del host.
      if (servicio.marcas.length) {
        for (const marca of servicio.marcas) {
          card.append(crear("li", marca, { slot: "marcas" }));
        }
      }

      const accion = crear("a", "Solicitar", {
        slot: "accion",
        href: "#/contacto",
      });
      card.append(accion);

      const li = document.createElement("li");
      li.dataset.familia = servicio.familia;
      li.append(card);
      frag.append(li);
    }

    this.$(".grid").append(frag);
    this.#construido = true;
    this.#aplicarFiltro();
  }

  #aplicarFiltro() {
    let visibles = 0;

    for (const li of this.$$("li")) {
      const coincide = !this.familia || li.dataset.familia === this.familia;
      li.hidden = !coincide;
      if (coincide) visibles++;
    }

    this.$(".conteo").textContent =
      `${visibles} de ${this.servicios.length} servicio${visibles === 1 ? "" : "s"}`;
  }
}

define("q-service-list", ServiceList);
