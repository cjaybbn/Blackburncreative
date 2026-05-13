/** Canonical site URL for meta tags, JSON-LD, sitemap */
export const SITE_ORIGIN = "https://blackburncreativestudio.com";

export const SEO = {
  home: {
    title: "Camden J Blackburn | Product Manager & AI Builder",
    description:
      "Senior GIT student at ASU and founder of RealCopy and DealerDeck. Focused on bridging the gap between human-centered UX and full-stack execution through AI-powered tools and automotive design.",
    path: "/",
  },
  work: {
    title: "Selected Work & Case Studies | Camden J Blackburn",
    description:
      "Case studies for apps, campus branding, TEDx and print clients, with Behance embeds where the full decks live.",
    path: "/work",
  },
  lightpainting: {
    title: "Automotive Lightpainting Gallery | Camden J Blackburn",
    description:
      "Long-exposure car meet photography—tripod, light bar, editing—gallery of lightpainting studies.",
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
      jobTitle: "Product Manager & AI Builder",
      description:
        "Founder of RealCopy and DealerDeck LLC; Senior at ASU Polytechnic focusing on Graphic Information Technology and UX. FAA Certified Drone Pilot and automotive enthusiast.",
      email: "mailto:Blackburncamden@gmail.com",
      knowsAbout: [
        "Product Strategy",
        "UX Design",
        "React Native",
        "AI Prompt Engineering",
        "Drone Orthomosaic Mapping",
        "Brand Identity",
      ],
    },
    {
      "@type": "SoftwareApplication",
      name: "RealCopy",
      applicationCategory: "BusinessApplication",
      operatingSystem: "iOS",
      description:
        "iPhone app for realtors: mobile-first flow with Rentcast, Google Places, and Gemini—core tasks in under three taps (TestFlight beta).",
      author: { "@id": `${SITE_ORIGIN}/#person` },
    },
    {
      "@type": "SoftwareApplication",
      name: "DealerDeck",
      applicationCategory: "BusinessApplication",
      description:
        "Voice-led showroom tool from BMW North Scottsdale: BMW trim/zone tables so AI summaries match dealership language; CRM sync in seconds (DealerDeck LLC).",
      author: { "@id": `${SITE_ORIGIN}/#person` },
    },
    {
      "@type": "ProfessionalService",
      name: "BirdsEye",
      description:
        "Drone orthomosaics and 3D for job sites, packaged as maps stakeholders can actually use in meetings.",
      provider: { "@id": `${SITE_ORIGIN}/#person` },
      areaServed: "US",
    },
    {
      "@type": "CreativeWork",
      "@id": `${SITE_ORIGIN}/#creative-asu-polytechnic-design-system`,
      name: "ASU Polytechnic Design System",
      description:
        "Polytechnic TPS system rooted in TEM’s need for non-generic ASU branding: hex isometric grid, Mother Shape family, templates, solo career advisory board presentation.",
      url: "https://www.behance.net/gallery/249030461/TPS-Design-System-Proposal-Design-Agency",
      image: `${SITE_ORIGIN}/work/BTS/TPS_MeSpeaking_BTS.jpg`,
      creator: { "@id": `${SITE_ORIGIN}/#person` },
    },
    {
      "@type": "CreativeWork",
      "@id": `${SITE_ORIGIN}/#creative-asu-design-agency-class`,
      name: "ASU design agency class — team collaboration",
      description:
        "Cohort photo from ASU’s application-only GIT agency studio, including TEDx Faurot Park and Southwest Label client work.",
      image: `${SITE_ORIGIN}/work/BTS/TPS_GROUP_BTS.jpg`,
      creator: { "@id": `${SITE_ORIGIN}/#person` },
    },
  ],
};
