import { BaseElement } from "../lib/element.js";
import { define } from "../lib/define.js";
import { loadStyles } from "../lib/css.js";

const template = document.createElement("template");
template.innerHTML = `
  <header>
    <p class="eyebrow"><slot name="eyebrow"></slot></p>
    <h1 tabindex="-1"><slot name="title"></slot></h1>
    <p class="intro"><slot name="intro"></slot></p>
  </header>`;

const styles = await loadStyles(new URL("./q-page-head.css", import.meta.url));

class PageHead extends BaseElement {
  static template = template;
  static styles = styles;
}

define("q-page-head", PageHead);
