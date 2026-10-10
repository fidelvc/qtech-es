/**
 * Rellena un clon de <template> a partir de un mapa { selector: valor }.
 * Usa textContent, nunca innerHTML, así que los datos no pueden inyectar marcado.
 * Los <input> reciben `value`; el resto, texto.
 */
export function rellenar(fragmento, datos) {
  for (const [selector, valor] of Object.entries(datos)) {
    for (const el of fragmento.querySelectorAll(selector)) {
      if (el instanceof HTMLInputElement) el.value = valor;
      else el.textContent = valor;
    }
  }
  return fragmento;
}

/** Crea un elemento con texto, sin pasar por innerHTML. */
export function crear(tag, texto, props = {}) {
  const el = document.createElement(tag);
  if (texto != null) el.textContent = texto;
  for (const [k, v] of Object.entries(props)) {
    if (k === "slot") el.slot = v;
    else if (v === true) el.setAttribute(k, "");
    else if (v != null && v !== false) el.setAttribute(k, v);
  }
  return el;
}
