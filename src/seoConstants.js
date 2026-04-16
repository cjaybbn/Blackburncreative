/** Canonical site URL for meta tags, JSON-LD, sitemap */
export const SITE_ORIGIN = "https://blackburncreativestudio.com";

export const SEO = {
  home: {
    title: "Camden J Blackburn | Product Founder & System Architect | Blackburn Creative Studio",
    description:
      "Product founder and system architect building scalable systems through AI-native collaboration. RealCopy, DealerDeck, design systems, BirdsEye mapping, and IPA-shortlisted photography.",
    path: "/",
  },
  work: {
    title: "Selected Work & Case Studies | System Architect & Founder | Camden J Blackburn",
    description:
      "Photography, brand identity, print design, and interactive case studies — including Behance embeds for TEDx Faurot Park and product branding work.",
    path: "/work",
  },
  lightpainting: {
    title: "Automotive Lightpainting Gallery | Camden J Blackburn",
    description:
      "Long-exposure automotive light studies — cinematic hero imagery and curated gallery.",
    path: "/lightpainting",
  },
};

/** Stable JSON-LD @graph for the home page (Person + products + services). */
export const HOME_JSON_LD_GRAPH = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${SITE_ORIGIN}/#person`,
      name: "Camden J Blackburn",
      url: SITE_ORIGIN + "/",
      jobTitle: "Product Founder & System Architect",
      description:
        "Builds scalable systems through AI-native collaboration; founder of RealCopy and DealerDeck LLC; systems work on ASU Polytechnic design language; BirdsEye orthomosaic mapping.",
      email: "mailto:Blackburncamden@gmail.com",
      knowsAbout: [
        "Systems architecture",
        "AI-native product development",
        "UX research",
        "Design systems",
        "Geospatial mapping",
      ],
    },
    {
      "@type": "SoftwareApplication",
      name: "RealCopy",
      applicationCategory: "BusinessApplication",
      operatingSystem: "iOS",
      description:
        "AI-powered marketing and market intelligence for real estate agents — property-aware copy, comps, and neighborhood context.",
      author: { "@id": `${SITE_ORIGIN}/#person` },
    },
    {
      "@type": "SoftwareApplication",
      name: "DealerDeck",
      applicationCategory: "BusinessApplication",
      description:
        "Automotive SaaS — dealer-facing workflows from problem discovery through MVP (DealerDeck LLC).",
      author: { "@id": `${SITE_ORIGIN}/#person` },
    },
    {
      "@type": "ProfessionalService",
      name: "BirdsEye",
      description:
        "Drone orthomosaic mapping, 3D reconstruction, and interactive construction-site maps.",
      provider: { "@id": `${SITE_ORIGIN}/#person` },
      areaServed: "US",
    },
  ],
};
