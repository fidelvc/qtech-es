import { site } from "./data/site.js";
import { router } from "./lib/router.js";
import { injectJsonLd } from "./lib/seo.js";

import "./components/q-app-view.js";
import "./components/q-site-nav.js";
import "./views/home-view.js";
import "./views/services-view.js";
import "./views/products-view.js";
import "./views/contact-view.js";

const outlet = document.querySelector("q-app-view");

// Events coming from the views. No view knows about the router: they only
// emit and wait for someone with context to decide what to do.
document.addEventListener("app:item", (event) => {
  console.info("[app] item requested:", event.detail);
});

router.subscribe(({ route, tag }) => {
  console.debug(`[router] ${route} -> ${tag ?? "not found"}`);
});

// Structured data for search engines (generated from site.js).
injectJsonLd(site);

// `start()` paints the initial view and sets the <title> for the current
// route, so it must run after registering any subscriber.
router.start(outlet);

if (!location.hash) {
  document.title = `${site.tagline} · ${site.name}`;
}
