import { BaseElement } from "../lib/element.js";
import { define } from "../lib/define.js";
import { loadStyles } from "../lib/css.js";

const template = document.createElement("template");
template.innerHTML = `<slot></slot>`;

const styles = await loadStyles(new URL("./q-faq.css", import.meta.url));

class Faq extends BaseElement {
  static template = template;
  static styles = styles;
}

define("q-faq", Faq);
