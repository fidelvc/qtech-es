const cache = new Map();

/**
 * Loads a .css file and turns it into a shared `CSSStyleSheet`.
 *
 * - Memoized: the same URL is only fetched once (even if several modules
 *   import it).
 * - Requires serving the site over HTTP (ES modules already do).
 *
 * Usage:
 *   const styles = await loadStyles(new URL("./q-hero.css", import.meta.url));
 */
export function loadStyles(url) {
  const key = String(url);

  if (!cache.has(key)) {
    cache.set(
      key,
      fetch(key)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Could not load stylesheet: ${key}`);
          }
          return response.text();
        })
        .then((text) => {
          const sheet = new CSSStyleSheet();
          sheet.replaceSync(text);
          return sheet;
        }),
    );
  }

  return cache.get(key);
}
