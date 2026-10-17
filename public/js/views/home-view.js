import { BaseElement } from "../lib/element.js";
import { define } from "../lib/define.js";
import { loadStyles } from "../lib/css.js";
import { create } from "../lib/fill.js";
import { site } from "../data/site.js";
import "./../components/q-hero.js";
import "./../components/q-service-list.js";
import "./../components/q-product-grid.js";
import "./../components/q-steps.js";
import "./../components/q-feature-grid.js";
import "./../components/q-pricing.js";
import "./../components/q-faq.js";
import "./../components/q-cta.js";

const template = document.createElement("template");
template.innerHTML = `
  <q-hero>
    <p slot="eyebrow">Servicio técnico multimarca</p>
    <span slot="title">Aparatología estética que vuelve a funcionar</span>
    <p slot="intro" data-hero-intro></p>
    <a slot="action" href="#/servicios">Ver servicios</a>
    <a slot="action" href="#/contacto" class="secondary">Pedir presupuesto</a>
  </q-hero>

  <section class="section">
    <div class="section-head">
      <h2>Servicios destacados</h2>
      <a href="#/servicios">Ver todos los servicios →</a>
    </div>
    <q-service-list no-filters></q-service-list>
  </section>

  <section class="section">
    <h2>Cómo trabajo</h2>
    <q-steps></q-steps>
  </section>

  <section class="section">
    <div class="section-head">
      <h2>Repuestos destacados</h2>
      <a href="#/productos">Ver catálogo completo →</a>
    </div>
    <q-product-grid no-filters></q-product-grid>
  </section>

  <section class="section">
    <h2>Garantías</h2>
    <q-feature-grid data-guarantees></q-feature-grid>
  </section>

  <section class="section">
    <h2>Logística</h2>
    <q-feature-grid data-logistics></q-feature-grid>
  </section>

  <section class="section">
    <h2>Tarifas de mano de obra</h2>
    <q-pricing></q-pricing>
  </section>

  <section class="section">
    <h2>Preguntas frecuentes</h2>
    <q-faq></q-faq>
  </section>

  <q-cta></q-cta>`;

const styles = await loadStyles(new URL("./home-view.css", import.meta.url));

class HomeView extends BaseElement {
  static template = template;
  static styles = styles;

  connectedCallback() {
    super.connectedCallback();

    this.$("[data-hero-intro]").textContent = site.summary;

    const list = this.$("q-service-list");
    list.services = site.services.filter((service) => service.featured);

    const grid = this.$("q-product-grid");
    grid.products = site.products.slice(0, 3);

    this.$("q-steps").items = site.process;
    this.$("[data-guarantees]").items = site.guarantees;
    this.$("[data-logistics]").items = site.logistics;
    this.$("q-pricing").items = site.pricing;

    const faq = this.$("q-faq");
    for (const item of site.faqs) {
      const entry = document.createElement("details");
      entry.append(create("summary", item.question), create("p", item.answer));
      faq.append(entry);
    }

    this.$("q-cta").append(
      create("span", site.cta.title, { slot: "title" }),
      create("p", site.cta.text, { slot: "text" }),
      create("a", site.cta.button, {
        slot: "action",
        href: `mailto:${site.contact.email}`,
      }),
    );
  }
}

define("home-view", HomeView);
