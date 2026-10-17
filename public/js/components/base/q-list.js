import { BaseElement } from "../../lib/element.js";
import { loadStyles } from "../../lib/css.js";
import { local } from "../../lib/storage.js";

const template = document.createElement("template");
template.innerHTML = `
  <fieldset class="filters cluster" part="filters">
    <legend class="sr-only"></legend>
  </fieldset>
  <p class="count" role="status" aria-live="polite"></p>
  <ul class="grid" part="grid"></ul>
`;

const primitives = await loadStyles(new URL("../../../css/primitives.css", import.meta.url));
const styles = await loadStyles(new URL("./q-list.css", import.meta.url));

/**
 * Shared base for filterable lists (services and products).
 * Handles filter chips, the accessible counter and filtering by category.
 * Subclasses implement the `items` getter and `createItem(item)`.
 */
export class ListBase extends BaseElement {
  static template = template;
  static styles = [primitives, styles];
  static noun = "elemento";
  static filterLabel = "Filtrar";

  static props = {
    filters: { default: [] },
    filter: { default: "" },
    "no-filters": { type: Boolean, reflect: true, default: false },
  };

  #built = false;
  #filtersSignature = "";
  #builtItems = null;

  get items() {
    return [];
  }

  createItem() {
    throw new Error("ListBase: subclasses must implement createItem()");
  }

  connectedCallback() {
    if (!this.noFilters) {
      const key = `qtech:filter:${this.tagName.toLowerCase()}`;
      const saved = local.get(key);
      if (saved != null) this.filter = saved;
    }

    super.connectedCallback();

    // Radios live inside the shadow root; `change` is not composed by
    // default, so it is listened for on the shadow root.
    this.shadowRoot.addEventListener("change", (event) => {
      if (event.target.name !== "filter") return;
      this.filter = event.target.value;
      if (!this.noFilters) {
        local.set(`qtech:filter:${this.tagName.toLowerCase()}`, this.filter);
      }
      this.#applyFilter();
      this.emit(`${this.tagName.toLowerCase()}:filter`, { category: this.filter });
    });
  }

  render() {
    this.#renderFilters();
    if ((!this.#built || this.items !== this.#builtItems) && this.items.length) {
      this.#buildItems();
      this.#built = true;
      this.#builtItems = this.items;
    }
    this.#applyFilter();
  }

  #renderFilters() {
    const fieldset = this.$(".filters");
    const legend = fieldset?.querySelector("legend");
    if (!fieldset) return;

    const signature = (this.filters ?? []).join("|");
    if (signature === this.#filtersSignature) return;
    this.#filtersSignature = signature;

    if (legend) legend.textContent = this.constructor.filterLabel;

    for (const chip of fieldset.querySelectorAll(".chip")) chip.remove();

    const options = ["", ...(this.filters ?? [])];
    for (const value of options) {
      const label = document.createElement("label");
      label.className = "chip";
      const input = document.createElement("input");
      input.type = "radio";
      input.name = "filter";
      input.value = value;
      if (value === this.filter) input.checked = true;
      label.append(input, document.createTextNode(value === "" ? " Todas" : ` ${value}`));
      fieldset.append(label);
    }
  }

  #buildItems() {
    const grid = this.$(".grid");
    if (!grid) return;
    grid.replaceChildren();
    const fragment = document.createDocumentFragment();
    for (const item of this.items) {
      fragment.append(this.createItem(item));
    }
    grid.append(fragment);
  }

  #applyFilter() {
    const items = this.$$(".grid > li");
    let visible = 0;
    for (const li of items) {
      const match = !this.filter || li.dataset.category === this.filter;
      li.hidden = !match;
      if (match) visible++;
    }
    const count = this.$(".count");
    if (count) {
      // The noun agrees with the total, not with the visible subset:
      // "1 de 13 servicios", "1 de 1 servicio".
      const noun = items.length === 1 ? this.constructor.noun : `${this.constructor.noun}s`;
      count.textContent = `${visible} de ${items.length} ${noun}`;
    }
  }
}
