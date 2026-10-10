import { Elemento } from "../lib/elemento.js";
import { define } from "../lib/define.js";
import { site } from "../data/site.js";
import "./../components/q-hero.js";
import "./../components/q-service-card.js";
import "./../components/q-product-card.js";
import "./../components/q-faq.js";
import "./../components/q-cta.js";
import { crear } from "../lib/rellenar.js";

const template = document.createElement("template");
template.innerHTML = `
  <q-hero>
    <p slot="eyebrow">Servicio técnico multi-marca</p>
    <span slot="titulo">Aparatología estética que vuelve a funcionar</span>
    <p slot="intro">
      Mantenimiento y reparación de IPL, láser de diodo y EMSculpt para
      clínicas y centros de estética.
    </p>
    <a slot="accion" href="#/servicios">Ver servicios</a>
    <a slot="accion" href="#/productos" class="secundario">Repuestos</a>
  </q-hero>

  <section class="bloque">
    <h2>Servicios destacados</h2>
    <div class="grid-3" part="grid"></div>
    <p><a href="#/servicios">Ver los seis servicios →</a></p>
  </section>

  <section class="bloque">
    <h2>Repuestos más demandados</h2>
    <div class="grid-3"></div>
    <p><a href="#/productos">Ver catálogo completo →</a></p>
  </section>

  <section class="bloque">
    <h2>Preguntas frecuentes</h2>
    <q-faq>
      <details>
        <summary>¿Cada cuánto conviene hacer el mantenimiento?</summary>
        <p>
          Recomendamos revisión anual en equipos de uso intensivo y semestral en
          plataformas de IPL compartidas entre varias salas.
        </p>
      </details>
      <details>
        <summary>¿Trabajáis con marcas de terceros?</summary>
        <p>
          Sí, con plataforma de estética médica y centros de estética. Si
          necesitas una pieza concreta, consúltanos con la referencia.
        </p>
      </details>
      <details>
        <summary>¿Los repuestos llevan garantía?</summary>
        <p>
          Todos los módulos y cartuchos se prueba en banco antes de salir del
          taller e incluyen garantía de un año.
        </p>
      </details>
      <details>
        <summary>¿Cómo estimáis el tiempo de la reparación?</summary>
        <p>
          El intervalo depende de las horas de uso y del ambiente. Podemos
          calcularlo si nos indicas tu número de sesiones semanales.
        </p>
      </details>
    </q-faq>
  </section>

  <q-cta>
    <span slot="titulo">¿Necesitas una valoración?</span>
    <p slot="texto">
      Cuéntanos equipo, marca y avería. Respondemos en menos de 24 horas laborables.
    </p>
    <a slot="accion" href="mailto:info@qtech.es">Escribir al taller</a>
  </q-cta>`;

const styles = new CSSStyleSheet();
styles.replaceSync(`
  :host { display: block; }

  h2 {
    font-size: var(--font-size-step-2);
    line-height: 1.2;
    text-wrap: balance;
  }

  .bloque {
    display: grid;
    gap: var(--space-4);
    margin-block: var(--space-6);
  }

  .grid-3 {
    display: grid;
    gap: var(--space-4);
    grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
  }

  .bloque > p { color: var(--color-text-muted); }

  .bloque > p a { font-weight: 600; }
`);

const euros = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

class HomeView extends Elemento {
  static template = template;
  static styles = styles;

  connectedCallback() {
    super.connectedCallback();

    // Servicios destacados: reutiliza la misma tarjeta que la página de servicios.
    const rejillaServicios = this.$('[part="grid"]');

    for (const servicio of site.servicios.filter((s) => s.destacado)) {
      const card = document.createElement("q-service-card");
      card.destacado = true;

      card.append(
        crear("span", servicio.titulo, { slot: "titulo" }),
        crear("span", servicio.descripcion, { slot: "descripcion" }),
      );

      // Cada <li> va como hijo directo de la tarjeta: el slot solo proyecta
      // nodos del light DOM que sean hijos directos del host.
      if (servicio.marcas.length) {
        for (const marca of servicio.marcas) {
          card.append(crear("li", marca, { slot: "marcas" }));
        }
      }

      card.append(
        crear("a", "Solicitar", { slot: "accion", href: "#/contacto" }),
      );

      rejillaServicios.append(card);
    }

    // Repuestos destacados: reutiliza la tarjeta de producto.
    const rejillaProductos = this.$$(".grid-3")[1];

    for (const producto of site.productos.slice(0, 3)) {
      const card = document.createElement("q-product-card");
      card.ref = producto.ref;
      card.categoria = producto.categoria;

      card.append(
        crear("span", producto.nombre, { slot: "nombre" }),
        crear("span", producto.ref, { slot: "ref" }),
        crear("span", producto.descripcion, { slot: "descripcion" }),
        crear("span", euros.format(producto.precio), { slot: "precio" }),
      );

      const boton = crear("button", "Ver ficha", { type: "button" });
      boton.slot = "accion";
      card.append(boton);

      rejillaProductos.append(card);
    }
  }
}

define("home-view", HomeView);
