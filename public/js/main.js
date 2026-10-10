import { site } from "./data/site.js";
import { router } from "./lib/router.js";

import "./components/q-app-view.js";
import "./views/home-view.js";
import "./views/servicios-view.js";
import "./views/productos-view.js";
import "./views/contacto-view.js";

const outlet = document.querySelector("q-app-view");

// Events que llegan desde las vistas. Ninguna vista conoce el router:
// solo emite y espera a que alguien con contexto decida qué hacer.
document.addEventListener("app:ficha", (evento) => {
  console.info("[app] ficha solicitada:", evento.detail);
});

router.subscribe(({ ruta, tag }) => {
  console.debug(`[router] ${ruta} -> ${tag ?? "no encontrado"}`);
});

// `start()` pinta la vista inicial y fija el <title> de la ruta actual,
// así que debe ir después de registrar cualquier suscriptor.
router.start(outlet);

if (!location.hash) {
  document.title = `${site.claim} · ${site.nombre}`;
}
