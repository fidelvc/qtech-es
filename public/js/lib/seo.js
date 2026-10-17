/**
 * Injects structured data (JSON-LD) for search engines.
 * Called from main.js once the site data is loaded.
 */
export function injectJsonLd(data) {
  const { contact } = data;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: data.name,
    description: data.summary ?? data.tagline,
    email: contact.email,
    telephone: contact.phoneRaw,
    address: {
      "@type": "PostalAddress",
      streetAddress: contact.address.street,
      postalCode: contact.address.postalCode,
      addressLocality: contact.address.city,
      addressRegion: contact.address.region,
      addressCountry: contact.address.country,
    },
    areaServed: contact.zone,
    openingHours: contact.hours,
    url: typeof location !== "undefined" ? location.origin + location.pathname : undefined,
  };

  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(jsonLd);
  document.head.append(script);
}
