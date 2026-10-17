import { BaseElement } from "../lib/element.js";
import { define } from "../lib/define.js";
import { loadStyles } from "../lib/css.js";

const template = document.createElement("template");
template.innerHTML = `
  <section class="hero">
    <p class="eyebrow"><slot name="eyebrow"></slot></p>
    <h1 tabindex="-1"><slot name="title"></slot></h1>
    <p class="intro"><slot name="intro"></slot></p>
    <div class="cluster"><slot name="action"></slot></div>
  </section>`;

const styles = await loadStyles(new URL("./q-hero.css", import.meta.url));

class Hero extends BaseElement {
  static template = template;
  static styles = styles;
}

define("q-hero", Hero);
