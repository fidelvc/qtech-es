import { ListBase } from "./base/q-list.js";
import { define } from "../lib/define.js";
import { create } from "../lib/fill.js";
import "./q-service-card.js";

class ServiceList extends ListBase {
  static noun = "servicio";
  static filterLabel = "Filtrar por tipo de mantenimiento";

  static props = {
    ...ListBase.props,
    services: { default: [] },
  };

  get items() {
    return this.services;
  }

  createItem(service) {
    const card = document.createElement("q-service-card");
    card.featured = Boolean(service.featured);

    card.append(
      create("span", service.title, { slot: "title" }),
      create("span", service.description, { slot: "description" }),
    );

    for (const equipment of service.equipment) {
      card.append(create("li", equipment, { slot: "tags" }));
    }

    card.append(create("a", "Solicitar", { slot: "action", href: "#/contacto" }));

    const li = document.createElement("li");
    li.dataset.category = service.family;
    li.append(card);
    return li;
  }

  connectedCallback() {
    super.connectedCallback();

    this.addEventListener("q-service-card:activate", (event) => {
      this.emit("q-service-list:activate", { title: event.detail.title });
    });
  }
}

define("q-service-list", ServiceList);
