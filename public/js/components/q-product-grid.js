import { ListBase } from "./base/q-list.js";
import { define } from "../lib/define.js";
import { create } from "../lib/fill.js";
import "./q-product-card.js";

class ProductGrid extends ListBase {
  static noun = "producto";
  static filterLabel = "Filtrar productos por categoría";

  static props = {
    ...ListBase.props,
    products: { default: [] },
  };

  get items() {
    return this.products;
  }

  createItem(product) {
    const li = document.createElement("li");
    li.dataset.category = product.category;

    const card = document.createElement("q-product-card");
    card.ref = product.ref;
    card.category = product.category;

    card.append(
      create("span", product.name, { slot: "name" }),
      create("span", product.ref, { slot: "ref" }),
      create("span", product.description, { slot: "description" }),
    );

    const button = create("button", "Ver ficha", { type: "button" });
    button.slot = "action";
    button.dataset.view = "";
    card.append(button);

    li.append(card);
    return li;
  }

  connectedCallback() {
    super.connectedCallback();

    this.addEventListener("click", (event) => {
      const source = event.composedPath()[0];
      const button = source?.closest?.("[data-view]");
      if (!button) return;

      const card = button.closest("q-product-card");
      this.emit("q-product-grid:select", {
        ref: card.ref,
        name: card.querySelector('[slot="name"]')?.textContent ?? "",
      });
    });
  }
}

define("q-product-grid", ProductGrid);
