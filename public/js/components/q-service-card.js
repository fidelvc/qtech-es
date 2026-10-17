import { QCard } from "./base/q-card.js";
import { define } from "../lib/define.js";
import { loadStyles } from "../lib/css.js";

const template = document.createElement("template");
template.innerHTML = `
  <article class="card" part="card">
    <header><h3><slot name="title"></slot></h3></header>
    <p class="desc"><slot name="description"></slot></p>
    <ul class="tags" part="tags"><slot name="tags"></slot></ul>
    <footer><slot name="action"></slot></footer>
  </article>`;

const ownStyles = await loadStyles(new URL("./q-service-card.css", import.meta.url));

class ServiceCard extends QCard {
  static template = template;
  static styles = [QCard.sharedStyles, ownStyles];

  static props = {
    featured: { type: Boolean, reflect: true, default: false },
  };

  connectedCallback() {
    super.connectedCallback();

    this.addEventListener("click", (event) => {
      const source = event.composedPath()[0];
      if (source?.closest?.('a[href^="#/"]')) return;

      this.emit("q-service-card:activate", { title: this.#titleText() });
    });
  }

  #titleText() {
    const slot = this.$('slot[name="title"]');
    return (slot?.assignedNodes({ flatten: true }) ?? [])
      .map((node) => node.textContent ?? "")
      .join("")
      .trim();
  }
}

define("q-service-card", ServiceCard);
