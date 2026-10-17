/* Route paths stay in Spanish (user-facing URLs); element tags are code. */
const routes = new Map([
  ["/", "home-view"],
  ["/servicios", "services-view"],
  ["/productos", "products-view"],
  ["/contacto", "contact-view"],
]);

const titles = {
  "/": "Servicio técnico multimarca de aparatología estética",
  "/servicios": "Servicios",
  "/productos": "Productos",
  "/contacto": "Contacto",
};

function normalize() {
  const raw = location.hash.replace(/^#\/?/, "");
  const clean = raw.replace(/^\/+|\/+$/g, "");
  return clean === "" ? "/" : `/${clean}`;
}

const supportsTransitions = () =>
  typeof document.startViewTransition === "function" &&
  !matchMedia("(prefers-reduced-motion: reduce)").matches;

function firstH1(node) {
  const root = node?.shadowRoot;
  if (!root) return null;
  const direct = root.querySelector("h1");
  if (direct) return direct;
  for (const child of root.querySelectorAll("*")) {
    const found = firstH1(child);
    if (found) return found;
  }
  return null;
}

export class Router {
  #routes = routes;
  #titles = titles;
  #outlet = null;
  #listeners = new Set();
  #token = 0;

  get current() {
    return normalize();
  }

  subscribe(fn) {
    this.#listeners.add(fn);
    return () => this.#listeners.delete(fn);
  }

  navigate(destination) {
    const go = () => {
      location.hash = destination;
    };
    if (supportsTransitions()) document.startViewTransition(go);
    else go();
  }

  async start(outlet) {
    this.#outlet = outlet;

    addEventListener("hashchange", () => {
      this.#render();
    });

    addEventListener("click", (event) => {
      const source = event.composedPath()[0];
      const link = source?.closest?.('a[href^="#/"]');
      if (!link || event.metaKey || event.ctrlKey || event.shiftKey) return;
      if (link.getAttribute("href") === normalize()) return;
      event.preventDefault();
      this.navigate(link.getAttribute("href"));
    });

    await this.#render();
  }

  async #render() {
    const myToken = ++this.#token;
    const route = normalize();
    const tag = this.#routes.get(route);

    if (!this.#outlet) return;

    this.#outlet.setAttribute("aria-busy", "true");
    this.#outlet.replaceChildren(this.#loading());

    if (!tag) {
      await Promise.resolve();
      if (myToken !== this.#token) return;
      this.#outlet.replaceChildren(this.#notFound());
    } else {
      await customElements.whenDefined(tag);
      if (myToken !== this.#token) return;
      this.#outlet.replaceChildren(document.createElement(tag));
      document.title = `${this.#titles[route] ?? "Qtech"} · Qtech`;

      queueMicrotask(() => {
        if (myToken !== this.#token) return;
        firstH1(this.#outlet.firstElementChild)?.focus();
        window.scrollTo({ top: 0, behavior: "instant" });
      });
    }

    if (myToken !== this.#token) return;
    this.#outlet.removeAttribute("aria-busy");

    for (const fn of this.#listeners) fn({ route, tag });
  }

  #loading() {
    const paragraph = document.createElement("p");
    paragraph.className = "loading";
    paragraph.setAttribute("role", "status");
    paragraph.setAttribute("aria-live", "polite");
    paragraph.textContent = "Cargando...";
    return paragraph;
  }

  #notFound() {
    const section = document.createElement("section");
    section.className = "not-found";

    const heading = document.createElement("h1");
    heading.textContent = "Página no encontrada";

    const text = document.createElement("p");
    text.textContent = "La ruta que buscas no existe.";

    const link = document.createElement("a");
    link.href = "#/";
    link.textContent = "Volver al inicio";

    section.append(heading, text, link);
    return section;
  }
}

export const router = new Router();
