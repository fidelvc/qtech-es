import { BaseElement } from "../lib/element.js";
import { define } from "../lib/define.js";
import { loadStyles } from "../lib/css.js";
import { create, fill } from "../lib/fill.js";
import { site } from "../data/site.js";
import { session } from "../lib/storage.js";
import "./../components/q-page-head.js";

const DRAFT_KEY = "qtech:contact:draft";

const template = document.createElement("template");
template.innerHTML = `
  <q-page-head>
    <span slot="eyebrow">Hablemos</span>
    <span slot="title">Contacto</span>
    <p slot="intro">
      Cuéntanos qué equipo tienes y qué le pasa. Te contesto en menos de 24
      horas laborables.
    </p>
  </q-page-head>

  <section class="contact">
    <dl>
      <dt>Correo</dt>
      <dd data-email></dd>

      <dt>Teléfono</dt>
      <dd data-phone></dd>

      <dt>Horario</dt>
      <dd data-hours></dd>

      <dt>Dirección</dt>
      <dd data-address></dd>

      <dt>Zona</dt>
      <dd data-zone></dd>
    </dl>
  </section>

  <section class="form-section">
    <h2>Escríbenos</h2>
    <form class="contact-form" novalidate>
      <label class="field">
        <span>Nombre</span>
        <input type="text" name="name" required autocomplete="name">
      </label>
      <label class="field">
        <span>Correo</span>
        <input type="email" name="email" required autocomplete="email">
      </label>
      <label class="field">
        <span>Mensaje</span>
        <textarea name="message" rows="5" required></textarea>
      </label>
      <div class="cluster">
        <button type="submit">Enviar</button>
        <button type="button" class="secondary" data-clear>Limpiar</button>
      </div>
      <p class="form-status" role="status" aria-live="polite"></p>
    </form>
  </section>`;

const primitives = await loadStyles(new URL("../../css/primitives.css", import.meta.url));
const formStyles = await loadStyles(new URL("../../css/forms.css", import.meta.url));
const styles = await loadStyles(new URL("./contact-view.css", import.meta.url));

class ContactView extends BaseElement {
  static template = template;
  static styles = [primitives, formStyles, styles];

  connectedCallback() {
    super.connectedCallback();
    const { contact } = site;

    this.$("[data-email]").append(
      create("a", contact.email, { href: `mailto:${contact.email}` }),
    );
    this.$("[data-phone]").append(
      create("a", contact.phone, { href: `tel:${contact.phoneRaw}` }),
    );

    fill(this.$(".contact"), {
      "[data-hours]": contact.hours,
      "[data-address]":
        `${contact.address.street} · ${contact.address.postalCode} ` +
        contact.address.city,
      "[data-zone]": contact.zone,
    });

    const form = this.$(".contact-form");
    const status = this.$(".form-status");
    const fields = ["name", "email", "message"];

    // Restore the draft saved in sessionStorage.
    const draft = session.get(DRAFT_KEY, {});
    for (const field of fields) {
      const element = form.elements[field];
      if (element && draft[field]) element.value = draft[field];
    }

    // Save the draft while typing.
    form.addEventListener("input", () => {
      const data = {};
      for (const field of fields) data[field] = form.elements[field]?.value ?? "";
      session.set(DRAFT_KEY, data);
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!form.checkValidity()) {
        status.textContent = "Revisa los campos marcados.";
        return;
      }
      const data = Object.fromEntries(new FormData(form));
      const subject = encodeURIComponent(`Contacto web: ${data.name}`);
      const body = encodeURIComponent(
        `Nombre: ${data.name}\nCorreo: ${data.email}\n\n${data.message}`,
      );
      window.location.href = `mailto:${contact.email}?subject=${subject}&body=${body}`;
      session.remove(DRAFT_KEY);
      form.reset();
      status.textContent = "Abriendo tu cliente de correo...";
    });

    this.$("[data-clear]")?.addEventListener("click", () => {
      form.reset();
      session.remove(DRAFT_KEY);
      status.textContent = "Formulario limpiado.";
    });
  }
}

define("contact-view", ContactView);
