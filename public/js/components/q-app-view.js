import { BaseElement } from "../lib/element.js";
import { define } from "../lib/define.js";
import { loadStyles } from "../lib/css.js";

const template = document.createElement("template");
template.innerHTML = `<slot></slot>`;

const styles = await loadStyles(new URL("./q-app-view.css", import.meta.url));

/**
 * Router outlet. It knows nothing about routes or business logic: it only
 * projects the light DOM where the active view paints its content.
 */
class AppView extends BaseElement {
  static template = template;
  static styles = styles;
}

define("q-app-view", AppView);
