import { BaseElement } from "../lib/element.js";
import { define } from "../lib/define.js";
import { loadStyles } from "../lib/css.js";
import { site } from "../data/site.js";
import "./../components/q-page-head.js";
import "./../components/q-service-list.js";

const template = document.createElement("template");
template.innerHTML = `
  <q-page-head>
    <span slot="eyebrow">Qué hacemos</span>
    <span slot="title">Servicios</span>
    <p slot="intro">
      Revisión y diagnóstico primero; después, el mantenimiento que el equipo
      necesite: preventivo, correctivo, paliativo o adaptativo.
    </p>
  </q-page-head>

  <q-service-list></q-service-list>`;

const styles = await loadStyles(new URL("./services-view.css", import.meta.url));

class ServicesView extends BaseElement {
  static template = template;
  static styles = styles;

  connectedCallback() {
    super.connectedCallback();

    const list = this.$("q-service-list");
    list.services = site.services;
    list.filters = site.families;
  }
}

define("services-view", ServicesView);
