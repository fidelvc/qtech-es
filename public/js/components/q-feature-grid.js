import { BaseElement } from "../lib/element.js";
import { define } from "../lib/define.js";
import { loadStyles } from "../lib/css.js";
import { create } from "../lib/fill.js";

const template = document.createElement("template");
template.innerHTML = `<ul class="grid"></ul>`;

const primitives = await loadStyles(new URL("../../css/primitives.css", import.meta.url));
const styles = await loadStyles(new URL("./q-feature-grid.css", import.meta.url));

/**
 * Responsive card grid for short feature lists (guarantees, logistics…).
 * `items` is an array of `{ title, description }`.
 */
class FeatureGrid extends BaseElement {
  static template = template;
  static styles = [primitives, styles];

  static props = {
    items: { default: [] },
  };

  #signature = "";

  render() {
    const signature = JSON.stringify(this.items);
    if (signature === this.#signature) return;
    this.#signature = signature;

    const grid = this.$(".grid");
    grid.replaceChildren();

    for (const item of this.items) {
      const card = document.createElement("article");
      card.className = "feature";
      card.append(create("h3", item.title), create("p", item.description));

      const cell = document.createElement("li");
      cell.append(card);
      grid.append(cell);
    }
  }
}

define("q-feature-grid", FeatureGrid);
