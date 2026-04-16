import { useEffect } from "react";
import { SITE_ORIGIN } from "./seoConstants.js";

/**
 * Client-side title, meta description, canonical, and JSON-LD.
 * Keeps index.html minimal; updates on route change.
 */
export default function SeoHead({ title, description, path = "/", jsonLd = null }) {
  const jsonLdString = jsonLd == null ? null : typeof jsonLd === "string" ? jsonLd : JSON.stringify(jsonLd);

  useEffect(() => {
    document.title = title;

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute("content", description);

    const canonicalHref = `${SITE_ORIGIN}${path === "/" ? "" : path}`;
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", canonicalHref);

    const prev = document.querySelectorAll("script[data-app-jsonld]");
    prev.forEach((n) => n.remove());

    if (jsonLdString) {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.setAttribute("data-app-jsonld", "1");
      script.textContent = jsonLdString;
      document.head.appendChild(script);
    }

    return () => {
      document.querySelectorAll("script[data-app-jsonld]").forEach((n) => n.remove());
    };
  }, [title, description, path, jsonLdString]);

  return null;
}
