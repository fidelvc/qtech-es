import { BaseElement } from "../../lib/element.js";
import { loadStyles } from "../../lib/css.js";
import { local } from "../../lib/storage.js";

const template = document.createElement("template");
template.innerHTML = `
  <div class="filters cluster" part="filters" role="group"></div>
  <p class="count" role="status" aria-live="polite"></p>
  <ul class="card-grid" part="grid"></ul>
`;

const styles = await loadStyles(new URL("./q-list.css", import.meta.url));

/**
 * Shared base for filterable lists (services and products).
 * Handles filter chips, the accessible counter and filtering by category.
 * Subclasses implement the `items` getter and `createItem(item)`.
 */
export class ListBase extends BaseElement {
  static template = template;
  static styles = styles;
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

    // Chips are real buttons inside the shadow root: the group is labelled
    // with `aria-label` and each chip exposes its state with `aria-pressed`.
    this.shadowRoot.addEventListener("click", (event) => {
      const chip = event.target.closest?.(".chip");
      if (chip) this.#select(chip.dataset.value ?? "");
    });
  }

  #select(value) {
    if (value === this.filter) return;
    this.filter = value;
    if (!this.noFilters) {
      local.set(`qtech:filter:${this.tagName.toLowerCase()}`, this.filter);
    }
    this.#syncPressed();
    this.#applyFilter();
    this.emit(`${this.tagName.toLowerCase()}:filter`, { category: this.filter });
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
    const group = this.$(".filters");
    if (!group) return;

    const signature = (this.filters ?? []).join("|");
    if (signature !== this.#filtersSignature) {
      this.#filtersSignature = signature;
      group.setAttribute("aria-label", this.constructor.filterLabel);
      group.replaceChildren();

      for (const value of ["", ...(this.filters ?? [])]) {
        const chip = document.createElement("button");
        chip.type = "button";
        chip.className = "chip";
        chip.dataset.value = value;
        chip.textContent = value === "" ? "Todas" : value;
        group.append(chip);
      }
    }

    this.#syncPressed();
  }

  #syncPressed() {
    for (const chip of this.$$(".filters .chip")) {
      chip.setAttribute("aria-pressed", String((chip.dataset.value ?? "") === this.filter));
    }
  }

  #buildItems() {
    const grid = this.$(".card-grid");
    if (!grid) return;
    grid.replaceChildren();
    const fragment = document.createDocumentFragment();
    for (const item of this.items) {
      fragment.append(this.createItem(item));
    }
    grid.append(fragment);
  }

  #applyFilter() {
    const items = this.$$(".card-grid > li");
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
