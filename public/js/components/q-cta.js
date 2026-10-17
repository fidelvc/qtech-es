import { BaseElement } from "../lib/element.js";
import { define } from "../lib/define.js";
import { loadStyles } from "../lib/css.js";

const template = document.createElement("template");
template.innerHTML = `
  <section class="cta">
    <h2><slot name="title"></slot></h2>
    <p class="text"><slot name="text"></slot></p>
    <div class="cluster"><slot name="action"></slot></div>
  </section>`;

const primitives = await loadStyles(new URL("../../css/primitives.css", import.meta.url));
const styles = await loadStyles(new URL("./q-cta.css", import.meta.url));

class Cta extends BaseElement {
  static template = template;
  static styles = [primitives, styles];
}

define("q-cta", Cta);
