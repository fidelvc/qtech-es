import { BaseElement } from "../lib/element.js";
import { define } from "../lib/define.js";
import { loadStyles } from "../lib/css.js";
import { create } from "../lib/fill.js";

const template = document.createElement("template");
template.innerHTML = `<ol class="steps"></ol>`;

const primitives = await loadStyles(new URL("../../css/primitives.css", import.meta.url));
const styles = await loadStyles(new URL("./q-steps.css", import.meta.url));

/**
 * Ordered process list: each item is rendered as a numbered step.
 * `items` is an array of `{ title, description }`.
 */
class Steps extends BaseElement {
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

    const list = this.$(".steps");
    list.replaceChildren();

    for (const [index, item] of this.items.entries()) {
      const step = document.createElement("li");
      step.className = "step";
      step.append(
        create("span", String(index + 1).padStart(2, "0"), {
          class: "number",
          "aria-hidden": "true",
        }),
        create("h3", item.title),
        create("p", item.description),
      );
      list.append(step);
    }
  }
}

define("q-steps", Steps);
