/** Registro idempotente: evita el NotSupportedError al recargar un módulo. */
export function define(name, ctor) {
  if (!customElements.get(name)) {
    customElements.define(name, ctor);
  }
  return ctor;
}
