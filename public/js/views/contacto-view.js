import { Elemento } from "../lib/elemento.js";
import { define } from "../lib/define.js";
import { crear, rellenar } from "../lib/rellenar.js";
import { site } from "../data/site.js";
import "./../components/q-page-head.js";

const template = document.createElement("template");
template.innerHTML = `
  <q-page-head>
    <span slot="eyebrow">Hablemos</span>
    <span slot="titulo">Contacto</span>
    <p slot="intro">
      Cuéntanos qué equipo tienes y qué le pasa. Si prefieres escribir, responde
      al correo y te contestamos en cuanto podamos.
    </p>
  </q-page-head>

  <section class="contacto">
    <dl>
      <dt>Correo</dt>
      <dd data-correo></dd>

      <dt>Teléfono</dt>
      <dd data-telefono></dd>

      <dt>Horario</dt>
      <dd data-horario></dd>

      <dt>Dirección</dt>
      <dd data-direccion></dd>
    </dl>
  </section>`;

const styles = new CSSStyleSheet();
styles.replaceSync(`
  :host { display: block; }

  .contacto {
    margin-block: var(--space-2xl);
  }

  dl {
    display: grid;
    gap: var(--space-xs) var(--space-l);
    grid-template-columns: max-content 1fr;
    margin: 0;
  }

  dt {
    color: var(--color-text-muted);
    font-weight: 700;
  }

  dd {
    margin: 0;
  }

  a {
    color: var(--color-accent);
  }

  @media (width < 30rem) {
    dl { grid-template-columns: 1fr; }
    dd { margin-block-end: var(--space-s); }
  }
`);

class ContactoView extends Elemento {
  static template = template;
  static styles = styles;

  connectedCallback() {
    super.connectedCallback();
    const { contacto } = site;

    this.$("[data-correo]").append(
      crear("a", contacto.email, { href: `mailto:${contacto.email}` }),
    );
    this.$("[data-telefono]").append(
      crear("a", contacto.telefono, {
        href: `tel:${contacto.telefono.replace(/\s/g, "")}`,
      }),
    );

    rellenar(this.$(".contacto"), {
      "[data-horario]": contacto.horario,
      "[data-direccion]": contacto.direccion,
    });
  }
}

define("contacto-view", ContactoView);
