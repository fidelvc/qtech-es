import { Elemento } from "../lib/elemento.js";
import { define } from "../lib/define.js";
import { crear, rellenar } from "../lib/rellenar.js";

const euros = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

const template = document.createElement("template");
template.innerHTML = `
  <form class="filtros" role="search">
    <fieldset>
      <legend class="sr-only">Filtrar productos por categoría</legend>
      <label><input type="radio" name="categoria" value="" checked> Todas</label>
      <slot name="categorias"></slot>
    </fieldset>
  </form>

  <p class="conteo" role="status" aria-live="polite"></p>

  <ul class="grid" part="grid"></ul>

  <template data-producto>
    <li>
      <q-product-card>
        <span slot="nombre" data-nombre></span>
        <span slot="ref" data-ref></span>
        <span slot="descripcion" data-desc></span>
        <span slot="precio" data-precio></span>
        <button type="button" slot="accion" data-ver>Ver ficha</button>
      </q-product-card>
    </li>
  </template>`;

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

class ProductGrid extends Elemento {
  static template = template;
  static styles = styles;

  static props = {
    productos: { valor: [] },
    categorias: { valor: [] },
    categoria: { prop: "categoria", valor: "" },
  };

  #plantilla;

  connectedCallback() {
    super.connectedCallback();

    this.#plantilla = this.$("[data-producto]");

    // El grid no sabe quién lo escucha: solo emite.
    this.addEventListener("change", (evento) => {
      if (evento.target.name !== "categoria") return;
      this.categoria = evento.target.value;
      this.#aplicarFiltro();
      this.emit("q-product-grid:filtro", { categoria: this.categoria });
    });

    this.addEventListener("click", (evento) => {
      // Las tarjetas viven dentro del shadow root del grid, así que en este
      // punto `event.target` ya viene retargeteado al propio host. La ruta
      // real del evento hay que sacarla de composedPath().
      const origen = evento.composedPath()[0];
      const boton = origen?.closest?.("[data-ver]");
      if (!boton) return;

      const card = boton.closest("q-product-card");
      this.emit("q-product-grid:seleccion", {
        ref: card.ref,
        nombre: card.querySelector('[slot="nombre"]').textContent,
      });
    });
    this.render();
  }

  render() {
    if (!this.#plantilla || !this.productos.length) return;
    if (this.$(".grid").childElementCount) return; // ya construido

    const frag = document.createDocumentFragment();

    for (const producto of this.productos) {
      // `rellenar` devuelve el fragmento completo, así que el <li> se busca
      // dentro de él para poder marcarlo con datos.
      const item = rellenar(this.#plantilla.content.cloneNode(true), {
        "[data-nombre]": producto.nombre,
        "[data-ref]": producto.ref,
        "[data-desc]": producto.descripcion,
        "[data-precio]": euros.format(producto.precio),
      });

      // La referencia y la categoría viajan en el <li> para poder asignarlas
      // a la tarjeta más tarde, ya personalizada.
      item.querySelector("li").dataset.categoria = producto.categoria;

      frag.append(item);
    }

    const grid = this.$(".grid");
    grid.append(frag);

    // Orden importante: un clon de <template> pertenece al documento inerte del
    // template, y `customElements.upgrade()` no hace nada ahí porque su
    // documento no está activo. Al insertarlo en el shadow root el elemento
    // queda personalizado y sus accesores existen. Si se asignara `card.ref`
    // antes, se crearía un campo de datos propio que el constructor
    // sobrescribiría al definir el accessor, y el valor se perdería.
    for (const li of grid.querySelectorAll("li")) {
      const card = li.querySelector("q-product-card");
      card.ref = li.querySelector("[data-ref]").textContent;
      card.categoria = li.dataset.categoria;
    }

    // Los chips de categoría llegan por el slot desde la vista, que es quien
    // conoce la taxonomía.
    if (this.categorias.length && !this.querySelector('[slot="categorias"]')) {
      for (const categoria of this.categorias) {
        const label = document.createElement("label");
        label.append(
          crear("input", null, { type: "radio", name: "categoria", value: categoria }),
          document.createTextNode(` ${categoria}`),
        );
        label.slot = "categorias";
        this.append(label);
      }
    }

    this.#aplicarFiltro();
  }

  #aplicarFiltro() {
    let visibles = 0;

    for (const li of this.$$("li")) {
      const card = li.querySelector("q-product-card");
      const coincide = !this.categoria || card.categoria === this.categoria;
      li.hidden = !coincide;
      if (coincide) visibles++;
    }

    this.$(".conteo").textContent =
      `${visibles} de ${this.productos.length} producto${visibles === 1 ? "" : "s"}`;
  }
}

define("q-product-grid", ProductGrid);
