import { Elemento } from "../lib/elemento.js";
import { define } from "../lib/define.js";
import { site } from "../data/site.js";
import "./../components/q-page-head.js";
import "./../components/q-product-grid.js";

const template = document.createElement("template");
template.innerHTML = `
  <q-page-head>
    <span slot="eyebrow">Catálogo</span>
    <span slot="titulo">Productos</span>
    <p slot="intro">
      Repuestos, cartuchos y consumibles con calibración verificada en banco.
      Precios orientativos sin IVA.
    </p>
  </q-page-head>

  <q-product-grid></q-product-grid>`;

const styles = new CSSStyleSheet();
styles.replaceSync(`
  :host { display: block; }
`);

const categorias = [...new Set(site.productos.map((p) => p.categoria))];

class ProductosView extends Elemento {
  static template = template;
  static styles = styles;

  connectedCallback() {
    super.connectedCallback();

    // Los hijos de la plantilla ya están personalizados: la clase base los
    // sube en su connectedCallback (ver nota en lib/elemento.js).
    const grid = this.$("q-product-grid");
    grid.productos = site.productos;
    grid.categorias = categorias;

    grid.addEventListener("q-product-grid:seleccion", (evento) => {
      this.emit("app:ficha", evento.detail);
    });
  }
}

define("productos-view", ProductosView);
