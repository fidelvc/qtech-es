import { BaseElement } from "../lib/element.js";
import { define } from "../lib/define.js";
import { loadStyles } from "../lib/css.js";
import { site } from "../data/site.js";
import "./../components/q-page-head.js";
import "./../components/q-product-grid.js";

const template = document.createElement("template");
template.innerHTML = `
  <q-page-head>
    <span slot="eyebrow">Catálogo</span>
    <span slot="title">Productos</span>
    <p slot="intro">
      Repuestos, cartuchos y consumibles con calibración verificada en banco.
      Consulta disponibilidad y precio según referencia.
    </p>
  </q-page-head>

  <q-product-grid></q-product-grid>`;

const styles = await loadStyles(new URL("./products-view.css", import.meta.url));

class ProductsView extends BaseElement {
  static template = template;
  static styles = styles;

  connectedCallback() {
    super.connectedCallback();

    const grid = this.$("q-product-grid");
    grid.products = site.products;
    grid.filters = [...new Set(site.products.map((product) => product.category))];

    grid.addEventListener("q-product-grid:select", (event) => {
      this.emit("app:item", event.detail);
    });
  }
}

define("products-view", ProductsView);
