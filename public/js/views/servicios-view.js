import { Elemento } from "../lib/elemento.js";
import { define } from "../lib/define.js";
import { site } from "../data/site.js";
import "./../components/q-page-head.js";
import "./../components/q-service-list.js";

const template = document.createElement("template");
template.innerHTML = `
  <q-page-head>
    <span slot="eyebrow">Qué hacemos</span>
    <span slot="titulo">Servicios</span>
    <p slot="intro">
      Tres líneas de trabajo sobre la misma base: mantener, reparar y devolver
      al equipo su rendimiento de fábrica.
    </p>
  </q-page-head>

  <q-service-list></q-service-list>`;

const styles = new CSSStyleSheet();
styles.replaceSync(`
  :host { display: block; }
`);

class ServiciosView extends Elemento {
  static template = template;
  static styles = styles;

  connectedCallback() {
    super.connectedCallback();

    // Los hijos de la plantilla ya están personalizados: la clase base los
    // sube en su connectedCallback (ver nota en lib/elemento.js).
    const lista = this.$("q-service-list");
    lista.servicios = site.servicios;

    for (const familia of site.familias) {
      const label = document.createElement("label");
      const input = document.createElement("input");
      input.type = "radio";
      input.name = "familia";
      input.value = familia;
      label.append(input, document.createTextNode(` ${familia}`));
      label.slot = "familias";
      lista.append(label);
    }
  }
}

define("servicios-view", ServiciosView);
