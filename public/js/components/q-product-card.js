import { QCard } from "./base/q-card.js";
import { define } from "../lib/define.js";
import { loadStyles } from "../lib/css.js";

const template = document.createElement("template");
template.innerHTML = `
  <article class="card" part="card">
    <header>
      <h3><slot name="name"></slot></h3>
      <p class="ref"><slot name="ref"></slot></p>
    </header>
    <p class="desc"><slot name="description"></slot></p>
    <footer>
      <slot name="action"></slot>
    </footer>
  </article>`;

const ownStyles = await loadStyles(new URL("./q-product-card.css", import.meta.url));

class ProductCard extends QCard {
  static template = template;
  static styles = [QCard.sharedStyles, ownStyles];

  static props = {
    ref: { default: "" },
    category: { default: "" },
  };
}

define("q-product-card", ProductCard);
