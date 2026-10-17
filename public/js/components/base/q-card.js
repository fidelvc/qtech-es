import { BaseElement } from "../../lib/element.js";
import { loadStyles } from "../../lib/css.js";

/**
 * Shared base for cards (`q-service-card` and `q-product-card`).
 * The shared visual "shell" lives in `q-card.css`.
 */
export const cardStyles = await loadStyles(new URL("./q-card.css", import.meta.url));

export class QCard extends BaseElement {
  static sharedStyles = cardStyles;
}
