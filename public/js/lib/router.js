const rutas = new Map([
  ["/", "home-view"],
  ["/servicios", "servicios-view"],
  ["/productos", "productos-view"],
  ["/contacto", "contacto-view"],
]);

const titulos = {
  "/": "Servicio técnico de aparatología estética",
  "/servicios": "Servicios",
  "/productos": "Productos",
  "/contacto": "Contacto",
};

const oyentes = new Set();

function normalizar() {
  const bruto = location.hash.replace(/^#\/?/, "");
  const limpio = bruto.replace(/^\/+|\/+$/g, "");
  return limpio === "" ? "/" : `/${limpio}`;
}

const soportaTransiciones = () =>
  typeof document.startViewTransition === "function" &&
  !matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Busca el primer <h1> aunque viva varios shadow roots más adentro.
 * `ShadowRoot.querySelector` no cruza shadow roots anidados, así que hay que bajar a mano.
 */function primerH1(nodo) {
  const raiz = nodo?.shadowRoot;
  if (!raiz) return null;

  const directo = raiz.querySelector("h1");
  if (directo) return directo;

  for (const hijo of raiz.querySelectorAll("*")) {
    const encontrado = primerH1(hijo);
    if (encontrado) return encontrado;
  }

  return null;
}

export const router = {
  get actual() {
    return normalizar();
  },

  subscribe(fn) {
    oyentes.add(fn);
    return () => oyentes.delete(fn);
  },

  navigate(destino) {
    const ir = () => {
      location.hash = destino;
    };
    if (soportaTransiciones()) document.startViewTransition(ir);
    else ir();
  },

  start(outlet) {
    const pintar = () => {
      const ruta = normalizar();
      const tag = rutas.get(ruta);

      outlet.textContent = "";

      if (!tag) {
        const aviso = document.createElement("p");
        aviso.textContent = "Página no encontrada.";
        outlet.append(aviso);
      } else {
        outlet.append(document.createElement(tag));
        document.title = `${titulos[ruta]} · Qtech`;

        // Mueve el foco al <h1> para que quien navega con teclado o lector
        // de pantalla no se quede en el punto de partida del documento.
        queueMicrotask(() => {
          primerH1(outlet.firstElementChild)?.focus();
          window.scrollTo({ top: 0, behavior: "instant" });
        });
      }

      for (const fn of oyentes) fn({ ruta, tag });
    };

    addEventListener("hashchange", pintar);

    addEventListener("click", (evento) => {
      // Los enlaces llegan por slots y shadow roots, así que `target` puede
      // venir retargeteado: se usa composedPath() para el elemento real.
      const origen = evento.composedPath()[0];
      const enlace = origen?.closest?.('a[href^="#/"]');
      if (!enlace || evento.metaKey || evento.ctrlKey || evento.shiftKey) return;
      if (enlace.getAttribute("href") === normalizar()) return;
      evento.preventDefault();
      this.navigate(enlace.getAttribute("href"));
    });

    pintar();
  },
};
