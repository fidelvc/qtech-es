import { Elemento } from "../lib/elemento.js";
import { define } from "../lib/define.js";

const template = document.createElement("template");
template.innerHTML = `<slot></slot>`;

const styles = new CSSStyleSheet();
styles.replaceSync(`
  :host { display: block; }
`);

/**
 * Outlet del router. No sabe de rutas ni de negocio: solo proyecta el
 * light DOM donde la vista activa pinta su contenido.
 *
 * No reenvía eventos `app:*` a mano. Con `bubbles: true` y `composed: true`
 * un evento lanzado dentro del light DOM ya atraviesa el host y sube hasta
 * <body>; reemitirlo aquí además provocaría un bucle, porque el propio
 * listener se volvería a disparar sobre el mismo evento.
 */
class AppView extends Elemento {
  static template = template;
  static styles = styles;
}

define("q-app-view", AppView);
