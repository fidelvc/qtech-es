import { BaseElement } from "../lib/element.js";
import { define } from "../lib/define.js";
import { loadStyles } from "../lib/css.js";
import { site } from "../data/site.js";
import { router } from "../lib/router.js";

const template = document.createElement("template");
template.innerHTML = `
  <nav aria-label="Principal">
    <button class="toggle" type="button" aria-label="Menú" aria-expanded="false" aria-controls="site-menu">
      <span class="bars" aria-hidden="true"><span></span><span></span><span></span></span>
    </button>
    <ul id="site-menu" class="list" part="menu"></ul>
  </nav>`;

const styles = await loadStyles(new URL("./q-site-nav.css", import.meta.url));

/**
 * Main navigation. On mobile it collapses behind a hamburger button and the
 * menu expands in the normal flow (no overlay, so no `position`/`z-index`).
 */
class SiteNav extends BaseElement {
  static template = template;
  static styles = styles;

  #unsubscribe = null;
  #wired = false;
  #open = false;

  connectedCallback() {
    super.connectedCallback();

    if (!this.#wired) {
      this.#wired = true;

      this.$(".toggle")?.addEventListener("click", () => this.#setOpen(!this.#open));

      this.addEventListener("keydown", (event) => {
        if (event.key !== "Escape" || !this.#open) return;
        this.#setOpen(false);
        this.$(".toggle")?.focus();
      });
    }

    this.#unsubscribe?.();
    this.#unsubscribe = router.subscribe(() => {
      this.#setOpen(false);
      this.render();
    });
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

  #setOpen(open) {
    this.#open = open;
    this.$("nav")?.toggleAttribute("data-open", open);
    this.$(".toggle")?.setAttribute("aria-expanded", String(open));
  }
}

define("q-site-nav", SiteNav);
