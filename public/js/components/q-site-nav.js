import { BaseElement } from "../lib/element.js";
import { define } from "../lib/define.js";
import { loadStyles } from "../lib/css.js";
import { site } from "../data/site.js";
import { router } from "../lib/router.js";

const template = document.createElement("template");
template.innerHTML = `<nav aria-label="Principal"><ul class="list"></ul></nav>`;

const styles = await loadStyles(new URL("./q-site-nav.css", import.meta.url));

class SiteNav extends BaseElement {
  static template = template;
  static styles = styles;

  #unsubscribe = null;

  connectedCallback() {
    super.connectedCallback();
    this.#unsubscribe = router.subscribe(() => this.render());
  }

  disconnectedCallback() {
    this.#unsubscribe?.();
  }

  render() {
    const list = this.$(".list");
    if (!list) return;
    list.replaceChildren();

    for (const { path, label } of site.nav) {
      const li = document.createElement("li");
      const link = document.createElement("a");
      link.href = `#${path}`;
      link.textContent = label;
      if (router.current === path) link.setAttribute("aria-current", "page");
      li.append(link);
      list.append(li);
    }
  }
}

define("q-site-nav", SiteNav);
