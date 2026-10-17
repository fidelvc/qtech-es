import { BaseElement } from "../lib/element.js";
import { define } from "../lib/define.js";
import { loadStyles } from "../lib/css.js";
import { create } from "../lib/fill.js";

const template = document.createElement("template");
template.innerHTML = `<dl class="prices"></dl>`;

const styles = await loadStyles(new URL("./q-pricing.css", import.meta.url));

/**
 * Labour rates list. `items` is an array of `{ concept, price, note }`.
 */
class Pricing extends BaseElement {
  static template = template;
  static styles = styles;

  static props = {
    items: { default: [] },
  };

  #signature = "";

  render() {
    const signature = JSON.stringify(this.items);
    if (signature === this.#signature) return;
    this.#signature = signature;

    const list = this.$(".prices");
    list.replaceChildren();

    for (const item of this.items) {
      const amount = document.createElement("dd");
      amount.append(
        create("span", item.price, { class: "amount" }),
        create("span", item.note, { class: "note" }),
      );

      const row = document.createElement("div");
      row.className = "row";
      row.append(create("dt", item.concept), amount);
      list.append(row);
    }
  }
}

define("q-pricing", Pricing);
