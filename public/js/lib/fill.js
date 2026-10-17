/**
 * Fills a <template> clone from a { selector: value } map.
 * Uses textContent, never innerHTML, so data cannot inject markup.
 * <input> elements receive `value`; everything else receives text.
 */
export function fill(fragment, data) {
  for (const [selector, value] of Object.entries(data)) {
    for (const element of fragment.querySelectorAll(selector)) {
      if (element instanceof HTMLInputElement) element.value = value;
      else element.textContent = value;
    }
  }
  return fragment;
}

/** Creates an element with text, without going through innerHTML. */
export function create(tag, text, props = {}) {
  const element = document.createElement(tag);
  if (text != null) element.textContent = text;
  for (const [key, value] of Object.entries(props)) {
    if (key === "slot") element.slot = value;
    else if (value === true) element.setAttribute(key, "");
    else if (value != null && value !== false) element.setAttribute(key, value);
  }
  return element;
}
