import React, { useState, useEffect, useRef, useCallback, memo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useSpring, animated } from "@react-spring/web";
import HeroBackground from "./HeroBackground";
import GlassButton from "./GlassButton";
import AIChatBubble from "./AIChatBubble";
import SiteNav, { NAV_SCROLL_ROOT } from "./Nav.jsx";
import SeoHead from "./SeoHead.jsx";
import { SEO, HOME_JSON_LD_GRAPH } from "./seoConstants.js";
import CaseStudyLayout from "./CaseStudyLayout.jsx";
import { C, FONT, viewport, sectionVariants, staggerContainer, staggerItem } from "./theme.js";

const springConfig = { mass: 1, tension: 170, friction: 26 };
const MAGNETIC_RADIUS = 100;
const MAX_PULL = 10;
const heroTitleVariants = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
};
// ─── CAMDEN BLACKBURN — PORTFOLIO ───────────────────────────────────────────
// Editorial + Architectural aesthetic. Warm concrete, sharp type, intentional space.

const SITE_DATA = {
  /** Legal / schema name */
  fullName: "Camden J Blackburn",
  name: "Camden Blackburn",
  tagline: "Building Scalable Systems through AI-Native Collaboration.",
  heroMono: "SYSTEM DESIGN · ENTREPRENEURSHIP · AI-NATIVE BUILD",
  email: "Blackburncamden@gmail.com",
  phone: "(206) 321-6087",
  location: "Phoenix, AZ",
  school: "Arizona State University — B.S. Graphic Information Technology",
  graduation: "Summer 2026",

  intro: `I operate as a product founder and system architect: framing problems, sequencing bets, and shipping MVPs with teams and agents side-by-side. My workflow is AI-native — Gemini, Vertex AI, Cursor, and disciplined prompts are part of the stack, not a slide deck afterthought.

A concrete proof point: Google's Gemini design leadership reached out after learning how I build in production with their tools. The working sessions that followed shaped how I give structured product and UX feedback upstream — directly informing priorities on a product used at global scale. That collaboration is the standard I hold for every engagement: research-backed, specific, and tied to ship cycles.

Alongside RealCopy (AI for realtors) and DealerDeck LLC (automotive SaaS), I lead systems-level programs — including the ASU Polytechnic design language — and technical innovation such as BirdsEye (drone orthomosaic mapping and interactive construction maps). I'm completing my GIT degree at ASU and partner with teams that care about accessibility, performance, and narrative as much as velocity.`,

  aiPhilosophy: {
    title: "How I Use AI",
    paragraphs: [
      "I don't use AI to skip the work. I use it to do work that wouldn't exist otherwise. Before AI-assisted development, I had product ideas and design skills but no way to build them. Now I can take a concept from napkin sketch to working beta in weeks — not because AI does it for me, but because it amplifies what I already bring: taste, judgment, and an obsessive focus on the user experience.",
      "My workflow treats AI as a collaborator at every stage: Gemini for research and content architecture, Claude for strategic thinking and complex problem-solving, Cursor for prompt-engineered development, and Midjourney for rapid visual exploration. The skill isn't in using any one tool — it's in knowing which tool to reach for, what to ask it, and when to override its suggestions with your own judgment.",
      "Structured feedback to Google's Gemini design leaders on real-world product use reinforced a lesson I lead with: builders who live in the workflow often see constraints and opportunities that don't surface in lab conditions. I carry that lens into every system I architect.",
    ],
  },

  /** Practice pillars — narrative IA for founder / architect positioning */
  practicePillars: [
    {
      title: "Entrepreneurship",
      description:
        "DealerDeck LLC (automotive SaaS) and RealCopy (AI for realtors). Problem-to-MVP journeys, feasibility gates, and iteration loops grounded in customer evidence — not slideware.",
    },
    {
      title: "Systems Architecture",
      description:
        "ASU Polytechnic design system — 6×6 isometric grid construction, Mother Shape narrative, and PM-owned orchestration across brand, digital, and environmental touchpoints.",
    },
    {
      title: "Technical Innovation",
      description:
        "BirdsEye — drone orthomosaic pipelines, 3D models, and interactive construction maps that turn aerial capture into operational clarity for stakeholders.",
    },
    {
      title: "Creative Excellence",
      description:
        "IPA-shortlisted photography and automotive lightpainting — editorial craft, composition, and lighting discipline that inform how I shape product and brand systems.",
    },
  ],

  designWork: [
    { title: "Brand Identity Systems", description: "Logo design, visual identity, brand guidelines for small businesses and personal projects." },
    { title: "Photography", description: "Shortlisted at the International Photography Awards. Architectural, automotive, and travel photography." },
    { title: "Social Media Design", description: "Campaign graphics, story templates, and content systems for real estate and lifestyle brands." },
    { title: "Generative AI Art", description: "Prompt-engineered visual concepts using Midjourney and DALL-E for brand exploration and rapid prototyping." },
    { title: "Graphic Design", description: "Print and digital design including posters, marketing materials, and editorial layouts." },
    { title: "Photo Composition", description: "Composite imagery blending photography with digital manipulation for creative and commercial applications." },
  ],

  skills: [
    { category: "Product", items: ["Product Strategy", "Founder-Led MVP", "Systems Thinking", "UX Design", "User Research", "Rapid Prototyping", "Beta Testing"] },
    { category: "AI Tools", items: ["Gemini / Vertex AI", "Claude", "Cursor AI", "Midjourney", "Prompt Engineering"] },
    { category: "Development", items: ["React Native / Expo", "Supabase", "Railway", "Node.js", "REST APIs"] },
    { category: "Design", items: ["Figma", "Adobe Creative Suite", "Photography", "Brand Identity", "Typography"] },
  ],

  professionalWork: [
    {
      client: "RealCopy",
      role: "Founder",
      context: "PropTech / AI",
      description:
        "AI-powered marketing and market intelligence for real estate agents — property-aware copy, live comps, and social content in one mobile-first flow (TestFlight).",
      tags: ["AI", "PropTech", "React Native"],
      status: "Beta",
      caseStudyId: "realcopy",
    },
    {
      client: "DealerDeck LLC",
      role: "Founder",
      context: "Automotive SaaS",
      description:
        "Problem framing through MVP: dealer workflows, data handoffs, and roadmap sequencing for an automotive SaaS surface — feasibility, pilots, and AI-native build practices.",
      tags: ["Entrepreneurship", "SaaS", "Automotive"],
      status: "In Progress",
      caseStudyId: "dealerdeck",
    },
    {
      client: "BirdsEye",
      role: "Technical Lead",
      context: "Geospatial / Construction Tech",
      description:
        "Drone orthomosaic capture, 3D reconstruction, and interactive construction maps — aerial data as stakeholder-ready operational views.",
      tags: ["Drones", "3D", "Mapping"],
      status: "Case study",
      caseStudyId: "birdseye",
    },
    {
      client: "ASU Polytechnic Design System",
      role: "Project Manager & Systems Architect",
      context: "ASU Partnership",
      description:
        "Campus-wide design language on a 6×6 isometric grid with Mother Shape narrative — signage, digital, and environmental graphics under PM delivery.",
      tags: ["Design System", "Grid Logic", "PM"],
      status: "In Progress",
      caseStudyId: "polytechnic",
    },
    {
      client: "TEDx Faurot Park",
      role: "Brand Designer",
      context: "ASU Design Agency Course",
      description: "Visual brand identity: logo, event collateral, and guidelines within an agency team — creative direction, client presentations, iterative rounds.",
      tags: ["Branding", "Logo Design", "Event Identity"],
      status: "Completed",
      caseStudyId: "tedx",
    },
    {
      client: "Southwest Label & Print",
      role: "Lead Designer",
      context: "Client Project",
      description: "Full brand redesign: logo, typography, UX research, and website — research through delivery for an established print company.",
      tags: ["Brand Redesign", "UX Research", "Web Design", "Logo"],
      status: "In Progress",
      caseStudyId: "southwest",
    },
  ],

  /** Full case study payloads — same schema for CaseStudyLayout / inline panels */
  caseStudyById: {
    realcopy: {
      name: "RealCopy",
      status: "Beta — TestFlight",
      description:
        "RealCopy started as a copywriting tool and evolved into a full marketing and data platform for real estate agents. It generates listing descriptions, social media content, and marketing copy — but it also pulls live market data to give agents property snapshots with comparable sales, pricing analysis, and neighborhood context. One app replaces a copywriter, a data analyst, and a social media manager.",
      process: [
        { phase: "Problem", detail: "Real estate agents waste 3-5 hours per listing juggling marketing content and market research across multiple tools. Most end up with generic copy and outdated comps." },
        { phase: "Research", detail: "Interviewed agents, analyzed competitors like Jasper and Copy.ai. Found that no tool combined AI content generation with real property data — comps, sale prices, neighborhood stats." },
        { phase: "Design", detail: "Designed for agents working between showings — every flow is under 3 taps. Property snapshots surface comps, recently sold prices, and comparable listings alongside the generated content." },
        { phase: "Build", detail: "Expo/React Native frontend, Railway backend, Supabase for data. Integrated Gemini and Vertex AI for content generation, Rentcast for property valuations and comps, Google Places for neighborhood data, and web queries for market context." },
        { phase: "Ship", detail: "Deployed to TestFlight via EAS Build. Currently onboarding beta testers and iterating on content quality, data accuracy, and the market comps feature based on real agent feedback." },
      ],
      processDetails: [
        { title: "The Pain Point", detail: "Agents juggle 10-15 active listings, each needing unique descriptions, social posts, market analysis, and comps. They use separate tools for writing, data, and social — or just copy-paste from old listings.", stat: "3-5 hrs", statLabel: "per listing on marketing + research", statPrefix: "3-", statValue: 5, statSuffix: " hrs" },
        { title: "Competitive Gap", detail: "Existing AI writing tools generate generic copy. MLS platforms show data but don't write content. No product combined both — property-aware AI content plus live market intelligence in one interface.", stat: "0", statLabel: "competitors combining AI content + market data", statValue: 0 },
        { title: "Speed-First UX", detail: "Agents work from their cars between showings. Property snapshots show comps, recent sales, and pricing analysis in a single scrollable view. Content generation is 3 taps: select listing, choose type, generate.", stat: "< 3", statLabel: "taps to generate or pull data", statPrefix: "< ", statValue: 3 },
        { title: "Full-Stack AI Platform", detail: "Seven APIs working together. Gemini and Vertex AI handle content generation. Rentcast provides comp data and property valuations. Google Places adds neighborhood context. The prompt engineering layer makes each API's data available to the AI when generating content.", stat: "7", statLabel: "APIs integrated", statValue: 7 },
        { title: "Beta & Iteration", detail: "Live on TestFlight. Iterating weekly based on agent feedback. Current focus: improving comp data accuracy, adding bulk content generation for agents with 10+ listings, and refining the property snapshot feature.", stat: "Live", statLabel: "on TestFlight" },
      ],
      stack: ["Expo / React Native", "Supabase", "Railway", "Gemini API", "Vertex AI", "Google Places API", "Rentcast API", "Cursor AI"],
    },
    dealerdeck: {
      name: "DealerDeck LLC",
      status: "In Progress — MVP",
      description:
        "Implmented and created SaaS solutions while working as Valet at BMW North Scottsdale. Developed a deep understanding of front end problems and used AI tools and methods to build solutions with foresight, integration into existing systems (CRM). and scalability in mind.",
      stack: ["Product strategy", "React / web", "APIs", "Cursor AI", "Gemini", "Customer pilots"],
      process: [
        { phase: "Problem", detail: "Sales representatives spend hours typing into CRM software, a tool designed for managers and rarely effectively utilized by the representative. Customer information is often incomplete, incorrect, or absent alltogether." },
        { phase: "Research", detail: "Spoke in depth with the sales team, managers, and the different facets and departments of the dealership. This gave me a bottom up understanding of the entire dealership ecosystem." },
        { phase: "Design", detail: "Sales centric UI and workflow design, voice first app interaction enabling hands free mobile usage, encouraging data logging with zero friction. AI generated summaries and coaching notes, live accurate inventory recommendations and search tools, plug and play into any CRM system, curated feedback, followup reminders, and more. " },
        { phase: "Build", detail: "Built using Claude code, cursor agentic AI, Gemini API, built in react native for android and ios, launched on apple testflight, constantly iterated based on realtime feedback, waiting for CRM swap to determine integration technique with the GM." },
        { phase: "MVP", detail: "Pilot cohort onboarding, success metrics on time-to-publish and rep adoption; roadmap for compliance and multi-rooftop scale." },
      ],
      processDetails: [
        { title: "CRM Compliance", detail: "Dealers rely on accurate and updated data based on sales to customer interactions to close deals and foster customer relationships.", stat: "70%", statLabel: "of sales missuse CRM software", statValue: 70, statSuffix: "%", statEntranceScale: true },
        { title: "Disconnected", detail: "CRM software is not built with the sales rep in mind, requiring tedious manually entry of info and copy paste from email threads to keep track of customer information - providing little to no value to the sales rep.", stat: "6", statLabel: "per week salesman waste on CRM", statValue: 6, statSuffix: " hours" },
        { title: "Frictionless", detail: "Designed to be used on the fly, use voice to log and AI takes care of the rest.", stat: "10", statLabel: "To log new data", statValue: 10, statSuffix: " seconds" },
        { title: "AI guardrails", detail: "Editable content at every stop, deep AI understanding of dealership and brand lingo, and contextually aware AI to help the sales rep at every step.", stat: "99%", statLabel: "CRM adoption", statValue: 99, statSuffix: "%", statEntranceScale: true },
        { title: "North star", detail: "Designing a better future for not only sales, but customer satisfaction, dealership metrics, and CRM compliance.", stat: "< 15", statLabel: "minutes sales should spend on CRM", statPrefix: "< ", statValue: 15 },
      ],
    },
    birdseye: {
      name: "BirdsEye",
      status: "Case study",
      description:
        "Drone orthomosaic and 3D reconstruction for construction and site operations: repeatable flight plans, GCP-backed accuracy, and browser-based maps for supers and owners — not just pretty tiles, but decision surfaces.",
      stack: ["Photogrammetry", "Pix4D / ODM", "GIS", "Three.js / web GL", "Python tooling"],
      process: [
        { phase: "Problem", detail: "Site teams relied on disjointed photo dumps and static PDFs; progress disputes slowed pay apps and safety walkthroughs." },
        { phase: "Research", detail: "Compared capture frequencies, accuracy tolerances for earthwork, and how supers consume map data on tablets in the field." },
        { phase: "Design", detail: "Layered orthomosaics with measurement, cut/fill overlays, and time-slider compare; WCAG-aware contrast for outdoor glare." },
        { phase: "Build", detail: "Pipeline from RAW to tiles; 3D mesh for stakeholder flythroughs; export hooks for CAD/GIS handoff." },
        { phase: "Deliver", detail: "Playbooks for flight ops, QA checklists, and client handoff packages — repeatable per site phase." },
      ],
      processDetails: [
        { title: "Accuracy", detail: "GCP layout and camera model checks before sign-off on quantity disputes.", stat: "~5 cm", statLabel: "typical site accuracy band" },
        { title: "Cadence", detail: "Weekly or milestone flights tied to schedule of values.", stat: "1×", statLabel: "min flights per active phase", statValue: 1 },
        { title: "Stakeholder map", detail: "Owner, GC, subs, and safety leads each get filtered layers — same base ortho, different questions.", stat: "4", statLabel: "role-based views", statValue: 4 },
        { title: "3D value", detail: "Mesh and contour exports for clash avoidance and as-built documentation.", stat: "3D", statLabel: "deliverable modes" },
        { title: "Field UX", detail: "Offline-tolerant viewers where LTE is thin; large tap targets for gloved use.", stat: "60m", statLabel: "typical field review session" },
      ],
    },
    polytechnic: {
      name: "ASU Polytechnic Design System",
      status: "In Progress",
      description:
        "Campus-scale visual system: 6×6 isometric construction grid, Mother Shape as the unifying mark logic, and PM-led rollout across environmental, digital, and print. Balances institutional restraint with polytechnic craft identity.",
      stack: ["Grid systems", "Figma libraries", "Environmental graphics", "PM / Agile", "Brand narrative"],
      process: [
        { phase: "Problem", detail: "Fragmented vendor art and one-off campaigns weakened wayfinding and digital cohesion across Polytechnic sites." },
        { phase: "Research", detail: "Audited touchpoints: signage, web templates, event graphics; synthesized constraints from facilities and communications." },
        { phase: "Design", detail: "Defined Mother Shape rules, isometric module usage, typography tiers, and color accessibility checks for outdoor contrast." },
        { phase: "Build", detail: "Component library, specimen docs, and templates for student makerspace outputs and official comms." },
        { phase: "Ship", detail: "Phased adoption with training decks, office hours for college partners, and versioned asset drops." },
      ],
      processDetails: [
        { title: "Grid logic", detail: "6×6 isometric module scales from poster to building placemaking without arbitrary stretching.", stat: "6×6", statLabel: "isometric base module" },
        { title: "Mother Shape", detail: "Single rhetorical anchor — all sub-brands resolve to the core silhouette language.", stat: "1", statLabel: "unifying form system", statValue: 1 },
        { title: "PM scope", detail: "Cross-team sequencing: facilities, web, recruitment events, and student portfolio shows.", stat: "12+", statLabel: "stakeholder groups engaged", statValue: 12 },
        { title: "Accessibility", detail: "Type scale and contrast tested for exterior signage and low-light kiosks.", stat: "AA", statLabel: "contrast target (body text)" },
        { title: "Adoption", detail: "Template downloads and office hours reduced one-off off-brand files.", stat: "↓", statLabel: "off-brand incidents (qualitative)" },
      ],
    },
    tedx: {
      name: "TEDx Faurot Park",
      status: "Completed",
      description:
        "Brand system for a TEDx signature event: mark, collateral, social templates, and guidelines usable by a volunteer team — tight turnaround, high legibility, and stage-ready presence.",
      stack: ["Brand identity", "Print & digital", "Event graphics", "Guidelines"],
      process: [
        { phase: "Problem", detail: "Needed a flexible identity that reads at arm’s length on stage and on phone screens for promotion." },
        { phase: "Research", detail: "Mood boards aligned to speaker diversity and venue architecture; competitor scan of other TEDx marks." },
        { phase: "Design", detail: "Wordmark, symbol lockups, color system with accessible pairs, and motion-safe static assets." },
        { phase: "Build", detail: "Delivered print packs, slide master, and social kits; spec’d vendor color for signage." },
        { phase: "Deliver", detail: "Handoff session with organizers; file naming and folder structure for volunteer editors." },
      ],
      processDetails: [
        { title: "Legibility", detail: "Tested mark at 24px and on projection mockups before approval.", stat: "24px", statLabel: "min digital mark size", statValue: 24 },
        { title: "Volunteer-ready", detail: "Non-designers could swap speaker photos without breaking grid.", stat: "100%", statLabel: "templates with safe zones", statValue: 100 },
        { title: "Deliverables", detail: "Programs, wayfinding, stage lower-thirds, and social sets.", stat: "20+", statLabel: "asset families", statValue: 20 },
        { title: "Timeline", detail: "Agency course cadence with client reviews every sprint.", stat: "4", statLabel: "review cycles", statValue: 4 },
        { title: "Outcome", detail: "Cohesive event presence; foundation for future year refreshes.", stat: "Live", statLabel: "event deployment" },
      ],
    },
    southwest: {
      name: "Southwest Label & Print",
      status: "In Progress",
      description:
        "Full brand redesign for a legacy print shop: new mark, typography system, UX research on quote and reorder flows, and a website that reflects craft while converting B2B leads.",
      stack: ["Brand", "UX research", "Web design", "Print production"],
      process: [
        { phase: "Problem", detail: "Outdated identity and confusing web journey hid technical capabilities; enterprise buyers bounced before understanding services." },
        { phase: "Research", detail: "Customer interviews, shop floor observation, and analytics on quote form abandonment." },
        { phase: "Design", detail: "Logo system, color/type, component library for web; print swatch and proofing language aligned to production reality." },
        { phase: "Build", detail: "Responsive site build in collaboration with dev; content model for capabilities and case snippets." },
        { phase: "Ship", detail: "Rollout checklist: fleet graphics, stationery, and sales one-pagers — phased to production downtime." },
      ],
      processDetails: [
        { title: "Research depth", detail: "Mixed methods: qualitative interviews plus funnel metrics.", stat: "12", statLabel: "stakeholder touchpoints", statValue: 12 },
        { title: "Web goals", detail: "Clear service taxonomy and faster quote intent.", stat: "−40%", statLabel: "target form abandonment drop" },
        { title: "Brand system", detail: "Logo, palette, type, voice — documented for external vendors.", stat: "1", statLabel: "single source PDF + Figma", statValue: 1 },
        { title: "Print truth", detail: "Design respects die lines, ink limits, and shop jargon customers actually use.", stat: "✓", statLabel: "production-aware specs" },
        { title: "Status", detail: "Website and fleet phases staggered around press maintenance windows.", stat: "Phased", statLabel: "rollout" },
      ],
    },
  },
};

// ─── COMPONENTS ─────────────────────────────────────────────────────────────

const Reveal = ({ children, delay = 0, direction = "up", glowText = false, gridCell = false }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const directions = {
    up: { y: 40, x: 0 },
    down: { y: -40, x: 0 },
    left: { y: 0, x: -40 },
    right: { y: 0, x: 40 },
    none: { y: 0, x: 0 },
  };

  const content = glowText && React.isValidElement(children)
    ? React.cloneElement(children, {
        style: {
          ...children.props?.style,
          ...(isInView ? { animation: `coralGlow 1.2s ease ${delay + 0.1}s both` } : {}),
        },
      })
    : children;

  return (
    <motion.div
      ref={ref}
      style={{
        overflow: "visible",
        overflowX: "visible",
        overflowY: "visible",
        ...(gridCell
          ? {
              height: "100%",
              minHeight: 0,
              display: "flex",
              flexDirection: "column",
              alignSelf: "stretch",
            }
          : {}),
      }}
      initial={{ opacity: 0, ...directions[direction] }}
      animate={isInView ? { opacity: 1, y: 0, x: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {content}
    </motion.div>
  );
};

const SectionLabel = ({ children }) => (
  <div style={{
    fontFamily: FONT.mono, fontSize: 10, fontWeight: 500, letterSpacing: 3,
    textTransform: "uppercase", color: C.accent, marginBottom: 20,
    display: "flex", alignItems: "center", gap: 12,
  }}>
    <div style={{ width: 20, height: 1, background: C.accent }} />
    {children}
  </div>
);

const Divider = ({ spacing = 60 }) => (
  <div style={{ height: 1, background: C.rule, margin: `${spacing}px 0` }} />
);

const StackTag = ({ children }) => (
  <span style={{
    fontFamily: FONT.mono, fontSize: 11, fontWeight: 500,
    color: C.inkSoft, background: C.bgAlt, padding: "5px 12px",
    borderRadius: 4, border: `1px solid ${C.rule}`,
    whiteSpace: "nowrap",
  }}>
    {children}
  </span>
);

const ProcessStep = ({ phase, detail, index, total }) => (
  <div style={{
    display: "flex", gap: 24, position: "relative",
    paddingBottom: index < total - 1 ? 32 : 0,
  }}>
    {/* Timeline */}
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 20 }}>
      <div style={{
        width: 10, height: 10, borderRadius: "50%", background: C.accent,
        border: `2px solid ${C.bg}`, boxShadow: `0 0 0 2px ${C.accent}`,
        position: "relative", zIndex: 1,
      }} />
      {index < total - 1 && (
        <div style={{ width: 1, flex: 1, background: C.accentLight, marginTop: 4 }} />
      )}
    </div>
    {/* Content */}
    <div style={{ flex: 1, paddingTop: 0 }}>
      <div style={{
        fontFamily: FONT.mono, fontSize: 10, fontWeight: 600,
        letterSpacing: 2, textTransform: "uppercase", color: C.accent,
        marginBottom: 6,
      }}>
        {String(index + 1).padStart(2, "0")} — {phase}
      </div>
      <p style={{
        fontFamily: FONT.body, fontSize: 15, lineHeight: 1.7,
        color: C.inkSoft, margin: 0,
      }}>
        {detail}
      </p>
    </div>
  </div>
);

const DesignCard = ({ title, description, index }) => (
  <motion.div
    style={{
      padding: "28px 24px", background: C.surface,
      border: `1px solid ${C.rule}`, borderRadius: 2,
      cursor: "default",
      boxSizing: "border-box",
      height: "100%",
      minHeight: 0,
      display: "flex",
      flexDirection: "column",
    }}
    whileHover={{
      scale: 1.02,
      boxShadow: "0 8px 24px rgba(224, 91, 91, 0.06)",
      borderColor: C.accent,
      transition: { duration: 0.3, ease: "easeOut" },
    }}
    transition={{ duration: 0.3, ease: "easeOut" }}
  >
    <div style={{
      fontFamily: FONT.mono, fontSize: 10, color: C.inkFaint,
      letterSpacing: 2, marginBottom: 12,
    }}>
      {String(index + 1).padStart(2, "0")}
    </div>
    <h3 style={{
      fontFamily: FONT.display, fontSize: 22, fontWeight: 400,
      color: C.ink, margin: "0 0 8px", fontStyle: "italic",
    }}>
      {title}
    </h3>
    <p style={{
      fontFamily: FONT.body, fontSize: 13, lineHeight: 1.6,
      color: C.inkMuted, margin: 0,
      flex: 1,
    }}>
      {description}
    </p>
  </motion.div>
);

const SkillCluster = ({ category, items }) => (
  <div>
    <div style={{
      fontFamily: FONT.mono, fontSize: 10, fontWeight: 600,
      letterSpacing: 2, textTransform: "uppercase", color: C.accent,
      marginBottom: 12, paddingBottom: 8,
      borderBottom: `1px solid ${C.accentLight}`,
    }}>
      {category}
    </div>
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {items.map(item => (
        <span key={item} style={{
          fontFamily: FONT.body, fontSize: 14, color: C.inkSoft,
          lineHeight: 1.5,
        }}>
          {item}
        </span>
      ))}
    </div>
  </div>
);

const SkillMarquee = ({ items, speed = 30, direction = "left", label, fullWidth = false }) => {
  const [isPaused, setIsPaused] = useState(false);
  const allItems = [...items, ...items, ...items];

  const labelEl = label ? (
    <div style={{
      fontFamily: FONT.mono, fontSize: 10, letterSpacing: 2,
      textTransform: "uppercase", color: "rgba(74, 70, 64, 0.35)",
      marginBottom: 10,
    }}>
      {label}
    </div>
  ) : null;

  const trackInner = (
    <div
      style={{
        overflow: "hidden",
        width: "100%",
        padding: "12px 0",
        maskImage: "linear-gradient(to right, transparent 0%, black 4%, black 96%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 4%, black 96%, transparent 100%)",
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <motion.div
        style={{ display: "flex", gap: 12, width: "max-content" }}
        animate={{
          x: direction === "left" ? [0, "-33.33%"] : ["-33.33%", 0],
        }}
        transition={{
          duration: isPaused ? 999999 : speed,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {allItems.map((item, i) => (
          <span
            key={i}
            style={{
              fontFamily: FONT.mono,
              fontSize: 13,
              fontWeight: 500,
              color: "rgba(74, 70, 64, 0.6)",
              background: "rgba(0, 0, 0, 0.03)",
              border: "1px solid rgba(0, 0, 0, 0.06)",
              padding: "8px 18px",
              borderRadius: 8,
              whiteSpace: "nowrap",
              transition: "all 0.3s",
            }}
            onMouseEnter={e => {
              e.target.style.color = "#E05B5B";
              e.target.style.borderColor = "rgba(224, 91, 91, 0.3)";
              e.target.style.background = "rgba(224, 91, 91, 0.05)";
            }}
            onMouseLeave={e => {
              e.target.style.color = "rgba(74, 70, 64, 0.6)";
              e.target.style.borderColor = "rgba(0, 0, 0, 0.06)";
              e.target.style.background = "rgba(0, 0, 0, 0.03)";
            }}
          >
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );

  if (fullWidth) {
    return (
      <div style={{ marginBottom: 24 }}>
        {label ? (
          <div
            className="section-padding"
            style={{ maxWidth: 1200, margin: "0 auto", paddingLeft: 40, paddingRight: 40 }}
          >
            {labelEl}
          </div>
        ) : null}
        <div
          style={{
            width: "100vw",
            marginLeft: "calc(50% - 50vw)",
            overflow: "hidden",
          }}
        >
          {trackInner}
        </div>
      </div>
    );
  }

  return (
    <div style={{ marginBottom: 24 }}>
      {labelEl}
      {trackInner}
    </div>
  );
};

// Subtle noise SVG for tessellation / glass grain
const GLASS_NOISE =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

// ─── MAGNETIC GLASS BUTTON (Vision Pro style: lens + warp + tessellation) ───
const MagneticGlassButton = memo(function MagneticGlassButton({ href, children }) {
  const wrapperRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mouseLocal, setMouseLocal] = useState({ x: 50, y: 20 });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const [magneticSpring, magneticApi] = useSpring(() => ({
    x: 0,
    y: 0,
    config: springConfig,
  }));

  useEffect(() => {
    const handleMove = (e) => {
      const el = wrapperRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < MAGNETIC_RADIUS && distance > 0) {
        const strength = (1 - distance / MAGNETIC_RADIUS) * MAX_PULL;
        const pullX = (dx / distance) * strength;
        const pullY = (dy / distance) * strength;
        magneticApi.start({ x: pullX, y: pullY });
      } else {
        magneticApi.start({ x: 0, y: 0 });
      }
    };
    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMove);
  }, [magneticApi]);

  const updateMouseLocal = useCallback((x, y, rect) => {
    if (!rect) return;
    setMouseLocal({ x, y });
    const w = rect.width;
    const h = rect.height;
    const nx = (x / w - 0.5) * 2;
    const ny = (y / h - 0.5) * 2;
    setTilt({ x: ny * 4, y: -nx * 4 });
  }, []);

  const handleMouseEnter = (e) => {
    setIsHovered(true);
    if (wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect();
      updateMouseLocal(e.clientX - rect.left, e.clientY - rect.top, rect);
    }
  };
  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
    magneticApi.start({ x: 0, y: 0 });
  };
  const handleMouseMove = (e) => {
    if (!wrapperRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    updateMouseLocal(e.clientX - rect.left, e.clientY - rect.top, rect);
  };

  return (
    <span
      ref={wrapperRef}
      style={{ display: "inline-block", position: "relative" }}
    >
      <animated.span
        style={{
          display: "inline-block",
          position: "relative",
          ...magneticSpring,
        }}
      >
        {/* Outer glow / refraction ring */}
        <motion.span
          style={{
            position: "absolute",
            inset: -6,
            pointerEvents: "none",
            borderRadius: 8,
            boxShadow: "0 0 32px rgba(224, 91, 91, 0.2), 0 0 64px rgba(255, 255, 255, 0.08), inset 0 0 24px rgba(255, 255, 255, 0.03)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        />
        <motion.a
          href={href}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onMouseMove={handleMouseMove}
          style={{
            position: "relative",
            display: "inline-block",
            fontFamily: FONT.mono,
            fontSize: 12,
            letterSpacing: 1,
            textTransform: "uppercase",
            color: C.inkOnDark,
            padding: "14px 28px",
            borderRadius: 6,
            textDecoration: "none",
            cursor: "pointer",
            overflow: "hidden",
            border: "1px solid rgba(255, 255, 255, 0.25)",
          }}
          animate={{
            background: isHovered ? "transparent" : C.darkBg,
            boxShadow: isHovered
              ? "inset 0 1px 0 rgba(255,255,255,0.15), inset 0 -1px 0 rgba(0,0,0,0.1)"
              : "none",
            transform: isHovered
              ? `perspective(400px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(1.02)`
              : "perspective(400px) rotateX(0deg) rotateY(0deg) scale(1)",
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {/* 1) Frosted glass base – blur the page behind so we see through */}
          <motion.span
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              background: "rgba(255, 255, 255, 0.06)",
              backdropFilter: "blur(20px) saturate(1.2)",
              WebkitBackdropFilter: "blur(20px) saturate(1.2)",
              borderRadius: 6,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />
          {/* 2) Lens hotspot – bright “magnifying” spot following cursor */}
          <motion.span
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              background: `radial-gradient(circle 80px at ${mouseLocal.x}px ${mouseLocal.y}px, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.15) 35%, transparent 65%)`,
              borderRadius: 6,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          />
          {/* 3) Edge vignette – darker rim like lens edge */}
          <motion.span
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              background: "radial-gradient(ellipse 100% 100% at 50% 50%, transparent 40%, rgba(0, 0, 0, 0.15) 100%)",
              borderRadius: 6,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />
          {/* 4) Tessellation / noise grain */}
          <motion.span
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              background: GLASS_NOISE,
              opacity: 0.08,
              mixBlendMode: "overlay",
              borderRadius: 6,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 0.08 : 0 }}
            transition={{ duration: 0.3 }}
          />
          <span style={{ position: "relative", zIndex: 1 }}>{children}</span>
        </motion.a>
      </animated.span>
    </span>
  );
});

// ─── MAIN ───────────────────────────────────────────────────────────────────
export default function CamdenPortfolio() {
  const location = useLocation();
  const navigate = useNavigate();
  const [heroReady, setHeroReady] = useState(false);
  const [openCaseStudyId, setOpenCaseStudyId] = useState(null);
  const [headshotTilt, setHeadshotTilt] = useState({ x: 0, y: 0 });
  const [headshotHovered, setHeadshotHovered] = useState(false);
  const [headshotMouse, setHeadshotMouse] = useState({ x: 50, y: 50 });
  const aboutRef = useRef(null);
  const headshotRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: aboutRef,
    offset: ["start end", "end start"],
  });
  const aboutLabelY = useTransform(scrollYProgress, [0, 1], [0, 20]);

  useEffect(() => {
    const t = setTimeout(() => setHeroReady(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!location.state || !("scrollToId" in location.state)) return;
    const scrollToId = location.state.scrollToId;
    navigate(location.pathname, { replace: true, state: {} });
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (scrollToId === NAV_SCROLL_ROOT || scrollToId === "about") {
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          document.getElementById(scrollToId)?.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    });
  }, [location.state, location.pathname, navigate]);

  useEffect(() => {
    if (!openCaseStudyId) return;
    const id = `pro-work-panel-${openCaseStudyId}`;
    requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  }, [openCaseStudyId]);

  const headshotMouseMove = useCallback((e) => {
    const el = headshotRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const w = rect.width;
    const h = rect.height;
    setHeadshotMouse({ x: (x / w) * 100, y: (y / h) * 100 });
    const nx = (x / w - 0.5) * 2;
    const ny = (y / h - 0.5) * 2;
    setHeadshotTilt({
      x: Math.max(-8, Math.min(8, ny * 8)),
      y: Math.max(-8, Math.min(8, -nx * 8)),
    });
  }, []);
  const headshotMouseLeave = useCallback(() => {
    setHeadshotHovered(false);
    setHeadshotTilt({ x: 0, y: 0 });
  }, []);

  return (
    <div style={{ background: C.bg, minHeight: "100vh", color: C.ink, width: "100%", maxWidth: "100vw", overflowX: "clip" }}>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-padding-top: 80px; width: 100%; }
        ::selection { background: rgba(150, 150, 150, 0.2); }
        .mobile-nav-toggle { display: none !important; }

        .nav-pill {
          left: 0 !important;
          right: 0 !important;
          width: 100% !important;
          max-width: 100vw !important;
          transform: none !important;
          display: flex !important;
          justify-content: center !important;
          align-items: flex-start !important;
          overflow: visible !important;
          padding: 10px 12px 14px !important;
          box-sizing: border-box !important;
        }
        .nav-glass-wrap {
          width: max-content !important;
          max-width: min(960px, calc(100vw - 24px)) !important;
          flex: 0 1 auto !important;
          min-width: 0 !important;
          overflow: visible !important;
        }
        .nav-glass-wrap > * {
          width: max-content !important;
          max-width: min(960px, calc(100vw - 24px)) !important;
          box-sizing: border-box !important;
          overflow: visible !important;
        }
        .nav-glass-wrap--page {
          width: min(960px, calc(100vw - 24px)) !important;
          max-width: min(960px, calc(100vw - 24px)) !important;
        }
        .nav-glass-wrap--page > * {
          width: 100% !important;
          max-width: min(960px, calc(100vw - 24px)) !important;
        }

        @media (max-width: 768px) {
          .nav-pill { padding: 10px 12px 16px !important; }
          .nav-pill-inner-row { width: max-content !important; min-width: 0 !important; display: flex !important; justify-content: space-between !important; align-items: center !important; }
          .nav-glass-wrap--page .nav-pill-inner-row { width: 100% !important; }
          .nav-pill-divider { display: none !important; }
          .desktop-nav { display: none !important; }
          .mobile-nav-toggle { display: flex !important; }
          .hero-grid { grid-template-columns: 1fr !important; }
          .two-col { grid-template-columns: 1fr !important; }
          .three-col { grid-template-columns: 1fr !important; }
          .skill-grid { grid-template-columns: 1fr 1fr !important; }
          .process-grid { grid-template-columns: 1fr !important; }
          .process-detail-panel { display: none !important; }
          .pro-work-card-grid { grid-template-columns: 1fr !important; }
          .pro-work-expandable .pro-work-card-grid {
            padding: 20px 18px !important;
            gap: 18px !important;
          }
          .hero-grid { grid-template-columns: 1fr !important; }
          .hero-image-col { order: -1 !important; justify-content: center !important; }
          .hero-headshot-inner { max-width: 280px !important; margin-left: auto !important; margin-right: auto !important; }
          .hero-text-col { text-align: center !important; align-items: center !important; }
          .hero-text-col .hero-buttons { justify-content: center !important; }
          .section-padding { padding-left: 24px !important; padding-right: 24px !important; }
          .hero-tagline { font-size: 18px !important; }
          .process-with-chat { grid-template-columns: 1fr !important; }
          .process-chat-bubble-col { position: relative !important; top: auto !important; order: 2 !important; justify-content: flex-start !important; }
          .ai-chat-bubble { max-width: 100% !important; }
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes lineGrow {
          from { width: 0; }
          to { width: 60px; }
        }
        @keyframes coralGlow {
          0% { color: inherit; text-shadow: none; }
          15% { color: #E05B5B; text-shadow: 0 0 24px rgba(224, 91, 91, 0.5); }
          35% { color: #E05B5B; text-shadow: 0 0 16px rgba(224, 91, 91, 0.35); }
          100% { color: inherit; text-shadow: none; }
        }
        @keyframes glassPress {
          0% { transform: scale(0.92); }
          50% { transform: scale(1.12); }
          100% { transform: scale(1); }
        }
      `}</style>

      <SeoHead
        title={SEO.home.title}
        description={SEO.home.description}
        path={SEO.home.path}
        jsonLd={HOME_JSON_LD_GRAPH}
      />
      <SiteNav />

      <main id="main-content">
      {/* ═══ HERO ═══ */}
      <motion.section
        id="about"
        aria-label="Introduction and hero"
        initial="hidden"
        animate={heroReady ? "visible" : "hidden"}
        variants={sectionVariants}
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "100vw",
          minHeight: "100vh",
          overflowX: "hidden",
          padding: 0,
          margin: 0,
          border: "none",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <HeroBackground />
        <div
          className="section-padding hero-grid"
          style={{
            position: "relative",
            zIndex: 1,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            alignItems: "center",
            gap: "60px",
            minHeight: "100vh",
            padding: "80px 40px 60px",
            maxWidth: 1200,
            margin: "0 auto",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              textAlign: "left",
            }}
            className="hero-text-col"
          >
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate={heroReady ? "visible" : "hidden"}
              style={{ overflow: "visible" }}
            >
              <Reveal delay={0.1}>
                <motion.div variants={staggerItem}>
                  <div style={{
                    fontFamily: FONT.mono, fontSize: 11, letterSpacing: 3,
                    textTransform: "uppercase", color: "rgba(80, 60, 50, 0.5)", marginBottom: 16,
                    display: "flex", alignItems: "center", gap: 12,
                  }}>
                    <div style={{
                      width: 0, height: 1, background: "rgba(80, 60, 50, 0.5)",
                      animation: "lineGrow 0.6s ease 0.4s forwards",
                    }} />
                    <span>
                      {SITE_DATA.location} / {SITE_DATA.school.split("—")[0].trim()}
                    </span>
                  </div>
                </motion.div>
              </Reveal>

              <Reveal delay={0.2}>
              <motion.h1
                className="hero-title"
                variants={heroTitleVariants}
                style={{
                  fontFamily: FONT.display, fontSize: 50, fontWeight: 400,
                  lineHeight: 1.05, color: "#1A1814", marginBottom: 12, fontStyle: "italic",
                  letterSpacing: -1,
                }}
              >
                {SITE_DATA.name}
              </motion.h1>
              </Reveal>

              <Reveal delay={0.3}>
              <motion.p
                className="hero-tagline"
                variants={staggerItem}
                style={{
                  fontFamily: FONT.body, fontSize: 22, lineHeight: 1.5,
                  color: "rgba(74, 70, 64, 0.85)", maxWidth: 640, marginBottom: 28, fontWeight: 400,
                }}
              >
                {SITE_DATA.tagline}
              </motion.p>
              </Reveal>

              <Reveal delay={0.4}>
              <div style={{
                fontFamily: FONT.mono,
                fontSize: 11,
                letterSpacing: 3,
                textTransform: "uppercase",
                color: "rgba(80, 60, 50, 0.62)",
                marginBottom: 32,
              }}>
                {SITE_DATA.heroMono}
              </div>
              </Reveal>

              <Reveal delay={0.5}>
              <motion.div variants={staggerItem} className="hero-buttons" style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center", justifyContent: "flex-start", overflow: "visible" }}>
                <GlassButton index={0} href="mailto:Blackburncamden@gmail.com">
                  Get in touch
                </GlassButton>
                <GlassButton index={1} animationDelay={0.15} onClick={() => document.getElementById("dealerdeck")?.scrollIntoView({ behavior: "smooth" })}>
                  View case studies →
                </GlassButton>
                <GlassButton index={2} href="/camden-blackburn-resume.pdf" download>
                  Download Resume ↓
                </GlassButton>
              </motion.div>
              </Reveal>
            </motion.div>
          </div>

          <Reveal delay={0.3} direction="right">
            <div
              className="hero-image-col"
              style={{
                position: "relative",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div
                ref={headshotRef}
                className="hero-headshot-inner"
                onMouseEnter={() => setHeadshotHovered(true)}
                onMouseLeave={headshotMouseLeave}
                onMouseMove={headshotMouseMove}
                style={{
                  width: "85%",
                  maxWidth: 420,
                  aspectRatio: "1/1",
                  borderRadius: headshotHovered ? "50%" : 20,
                  overflow: "hidden",
                  position: "relative",
                  border: headshotHovered ? "1px solid rgba(224, 91, 91, 0.2)" : "1px solid rgba(0, 0, 0, 0.06)",
                  boxShadow: headshotHovered
                    ? "0 20px 60px rgba(0, 0, 0, 0.15), 0 8px 24px rgba(0, 0, 0, 0.1)"
                    : "0 8px 32px rgba(0, 0, 0, 0.08)",
                  transform: headshotHovered
                    ? `perspective(800px) rotateX(${headshotTilt.x}deg) rotateY(${headshotTilt.y}deg) scale(1.03)`
                    : "perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)",
                  transition: "transform 0.3s cubic-bezier(0.03, 0.98, 0.52, 0.99), border-color 0.3s ease, box-shadow 0.3s ease, border-radius 0.35s ease",
                }}
              >
                <img
                  src="/headshot.png"
                  alt="Camden Blackburn"
                  loading="eager"
                  fetchPriority="high"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                    transform: headshotHovered ? "scale(1.05)" : "scale(1)",
                    filter: headshotHovered ? "grayscale(20%) contrast(1) brightness(1)" : "grayscale(100%) contrast(1.05) brightness(1.02)",
                    transition: "filter 0.6s ease, transform 0.35s ease",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(224, 91, 91, 0.12)",
                    mixBlendMode: "color",
                    opacity: headshotHovered ? 0.15 : 0,
                    pointerEvents: "none",
                    borderRadius: headshotHovered ? "50%" : 20,
                    transition: "opacity 0.6s ease, border-radius 0.35s ease",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: headshotHovered ? "50%" : 20,
                    background: `radial-gradient(ellipse 60% 60% at ${headshotMouse.x}% ${headshotMouse.y}%, rgba(255,255,255,0.12) 0%, transparent 60%)`,
                    pointerEvents: "none",
                    opacity: headshotHovered ? 1 : 0,
                    transition: "opacity 0.3s ease, border-radius 0.35s ease",
                  }}
                />
              </div>
            </div>
          </Reveal>
        </div>
      </motion.section>

      {/* ═══ ABOUT (intro on light background) ═══ */}
      <motion.section
        ref={aboutRef}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        variants={sectionVariants}
        aria-label="About"
        style={{
          maxWidth: 1200, margin: "0 auto", padding: "100px 40px",
        }}
        className="section-padding"
      >
        <Divider spacing={80} />
        <motion.div
          className="two-col"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          style={{
            display: "grid", gridTemplateColumns: "200px 1fr", gap: 40,
          }}
        >
          <Reveal direction="left">
            <motion.div variants={staggerItem} style={{ y: aboutLabelY }}>
              <SectionLabel>About</SectionLabel>
            </motion.div>
          </Reveal>
          <motion.div variants={staggerItem}>
            {SITE_DATA.intro.split("\n\n").map((p, i) => (
              <Reveal key={i} delay={0.1 * i} glowText>
                <p style={{
                  fontFamily: FONT.body, fontSize: 16, lineHeight: 1.8,
                  color: C.inkSoft, marginBottom: 24, maxWidth: 680,
                }}>
                  {p}
                </p>
              </Reveal>
            ))}
          </motion.div>
        </motion.div>
      </motion.section>

      {/* ═══ PRACTICE PILLARS ═══ */}
      <motion.section
        id="pillars"
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        variants={sectionVariants}
        aria-label="Practice areas"
        style={{
          maxWidth: 1200, margin: "0 auto", padding: "0 40px 100px",
        }}
        className="section-padding"
      >
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          <Reveal>
            <motion.div variants={staggerItem}>
              <SectionLabel>Practice</SectionLabel>
              <h2 style={{
                fontFamily: FONT.display, fontSize: 42, fontWeight: 400,
                fontStyle: "italic", lineHeight: 1.15, marginBottom: 12, color: C.ink,
              }}>
                Founder, systems, and craft
              </h2>
              <p style={{
                fontFamily: FONT.body, fontSize: 15, lineHeight: 1.6,
                color: C.inkMuted, marginBottom: 40, maxWidth: 560,
              }}>
                How work is organized — from zero-to-one products to campus-scale design languages and field capture.
              </p>
            </motion.div>
          </Reveal>
          <motion.div
            variants={staggerItem}
            className="three-col design-card-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 16,
              rowGap: 16,
              columnGap: 16,
              alignItems: "stretch",
            }}
          >
            {SITE_DATA.practicePillars.map((pillar, i) => (
              <Reveal key={pillar.title} delay={0.06 * i} gridCell>
                <DesignCard title={pillar.title} description={pillar.description} index={i} />
              </Reveal>
            ))}
          </motion.div>
        </motion.div>
      </motion.section>

      {/* ═══ FEATURED CASE STUDY — DealerDeck ═══ */}
      <motion.section
        id="dealerdeck"
        aria-label="DealerDeck case study"
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={viewport}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{ margin: 0 }}
      >
        <CaseStudyLayout
          study={SITE_DATA.caseStudyById.dealerdeck}
          badgeLabel="Featured Project"
          embedded
        />
      </motion.section>

      {/* ═══ PROFESSIONAL WORK ═══ */}
      <motion.section
        id="experience"
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        variants={sectionVariants}
        style={{
          maxWidth: 1200, margin: "0 auto", padding: "80px 40px",
        }}
        className="section-padding"
      >
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          <Reveal direction="left">
            <motion.div variants={staggerItem}>
              <SectionLabel>Professional Work</SectionLabel>
            </motion.div>
          </Reveal>
          <Reveal>
            <motion.h2
              variants={staggerItem}
              style={{
                fontFamily: FONT.display, fontSize: 42, fontWeight: 400,
                fontStyle: "italic", lineHeight: 1.15, marginBottom: 40,
              }}
            >
              Projects and Case Studies
            </motion.h2>
          </Reveal>
          {SITE_DATA.professionalWork.map((project, i) => {
            const caseStudy = project.caseStudyId ? SITE_DATA.caseStudyById[project.caseStudyId] : null;
            const isOpen = Boolean(caseStudy && openCaseStudyId === project.caseStudyId);
            const toggleCaseStudy = caseStudy
              ? () => setOpenCaseStudyId((prev) => (prev === project.caseStudyId ? null : project.caseStudyId))
              : undefined;

            return (
            <Reveal key={project.client} delay={0.1 * i}>
              <div
                id={project.caseStudyId ? `pro-work-${project.caseStudyId}` : undefined}
                className="pro-work-expandable"
                style={{ marginBottom: "clamp(16px, 3vw, 24px)" }}
              >
                <motion.div
                  variants={staggerItem}
                  className="pro-work-card-grid"
                  role={caseStudy ? "button" : undefined}
                  tabIndex={caseStudy ? 0 : undefined}
                  aria-expanded={caseStudy ? isOpen : undefined}
                  aria-controls={caseStudy ? `pro-work-panel-${project.caseStudyId}` : undefined}
                  aria-label={
                    caseStudy
                      ? `${isOpen ? "Collapse" : "Expand"} case study: ${project.client}`
                      : undefined
                  }
                  onClick={toggleCaseStudy}
                  onKeyDown={
                    toggleCaseStudy
                      ? (e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            toggleCaseStudy();
                          }
                        }
                      : undefined
                  }
                  style={{
                    display: "grid",
                    gridTemplateColumns: "65% 35%",
                    gap: 24,
                    alignItems: "center",
                    width: "100%",
                    background: "rgba(0, 0, 0, 0.02)",
                    border: "1px solid rgba(0, 0, 0, 0.05)",
                    borderRadius: isOpen ? "16px 16px 0 0" : 16,
                    padding: "clamp(20px, 4vw, 32px)",
                    marginBottom: 0,
                    transition: "border-color 0.3s ease, box-shadow 0.3s ease, border-radius 0.25s ease",
                    cursor: caseStudy ? "pointer" : "default",
                    ...(isOpen
                      ? {
                          borderBottom: "none",
                          borderColor: "rgba(224, 91, 91, 0.22)",
                          boxShadow: "0 4px 20px rgba(224, 91, 91, 0.06)",
                        }
                      : {}),
                  }}
                  onMouseEnter={e => {
                    if (isOpen) return;
                    e.currentTarget.style.borderColor = "rgba(224, 91, 91, 0.2)";
                    e.currentTarget.style.boxShadow = "0 4px 20px rgba(224, 91, 91, 0.06)";
                  }}
                  onMouseLeave={e => {
                    if (isOpen) return;
                    e.currentTarget.style.borderColor = "rgba(0, 0, 0, 0.05)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div>
                    <div style={{
                      fontFamily: FONT.display, fontSize: 24, fontStyle: "italic",
                      color: C.ink,
                    }}>
                      {project.client}
                    </div>
                    <div style={{
                      fontFamily: FONT.mono, fontSize: 11, letterSpacing: 2,
                      textTransform: "uppercase", color: C.inkMuted, marginTop: 4,
                    }}>
                      <span style={{ color: C.accent }}>{project.role}</span>
                      {" — "}
                      {project.context}
                    </div>
                    <p style={{
                      fontFamily: FONT.body, fontSize: 14, lineHeight: 1.7,
                      color: C.inkMuted, marginTop: 12, marginBottom: 0,
                    }}>
                      {project.description}
                    </p>
                  </div>
                  <div style={{
                    display: "flex", flexDirection: "column", alignItems: "flex-end",
                    justifyContent: "center", gap: 12,
                  }}>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "flex-end" }}>
                      {project.tags.map(tag => (
                        <span
                          key={tag}
                          style={{
                            fontFamily: FONT.mono, fontSize: 10,
                            background: "rgba(0, 0, 0, 0.03)",
                            border: "1px solid rgba(0, 0, 0, 0.06)",
                            borderRadius: 6,
                            padding: "4px 10px",
                            color: C.inkMuted,
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span
                      style={{
                        fontFamily: FONT.mono, fontSize: 10, letterSpacing: 1.5,
                        textTransform: "uppercase",
                        borderRadius: 6, padding: "4px 12px",
                        ...(project.status === "Completed"
                          ? { color: "#4A8C5C", background: "rgba(74, 140, 92, 0.08)", border: "1px solid rgba(74, 140, 92, 0.15)" }
                          : { color: "#E05B5B", background: "rgba(224, 91, 91, 0.08)", border: "1px solid rgba(224, 91, 91, 0.15)" }
                        ),
                      }}
                    >
                      {project.status}
                    </span>
                  </div>
                </motion.div>

                <AnimatePresence initial={false}>
                  {isOpen && caseStudy ? (
                    <motion.div
                      key={project.caseStudyId}
                      id={`pro-work-panel-${project.caseStudyId}`}
                      role="region"
                      aria-labelledby={`case-study-heading-${project.caseStudyId}`}
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                      style={{
                        border: "1px solid rgba(224, 91, 91, 0.2)",
                        borderTop: "none",
                        borderRadius: "0 0 16px 16px",
                        overflow: "hidden",
                        background: "#141416",
                      }}
                    >
                      <CaseStudyLayout
                        study={caseStudy}
                        badgeLabel="Case Study"
                        headingId={`case-study-heading-${project.caseStudyId}`}
                        inline
                        onClose={() => setOpenCaseStudyId(null)}
                      />
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            </Reveal>
            );
          })}
        </motion.div>
      </motion.section>

      {/* ═══ AI PROCESS ═══ */}
      <motion.section
        id="process"
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        variants={sectionVariants}
        style={{
          width: "100%",
          maxWidth: "100%",
          padding: 0,
          overflowX: "hidden",
        }}
      >
        <div
          style={{ maxWidth: 1200, margin: "0 auto", padding: "100px 40px 0" }}
          className="section-padding"
        >
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="process-with-chat"
          style={{
            display: "grid",
            gridTemplateColumns: "55% 45%",
            gap: 40,
            alignItems: "start",
          }}
        >
          <div
            className="two-col"
            style={{
              display: "grid",
              gridTemplateColumns: "200px 1fr",
              gap: 40,
            }}
          >
            <Reveal direction="left">
              <motion.div variants={staggerItem}>
                <SectionLabel>{SITE_DATA.aiPhilosophy.title}</SectionLabel>
              </motion.div>
            </Reveal>
            <motion.div variants={staggerItem}>
              {SITE_DATA.aiPhilosophy.paragraphs.map((p, i) => (
                <Reveal key={i} delay={0.1 * i} glowText>
                  <p style={{
                    fontFamily: FONT.body, fontSize: 16, lineHeight: 1.8,
                    color: C.inkSoft, marginBottom: 24, maxWidth: 680,
                  }}>
                    {p}
                  </p>
                </Reveal>
              ))}
            </motion.div>
          </div>
          <div
            className="process-chat-bubble-col"
            style={{
              position: "sticky",
              top: 120,
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              minHeight: 320,
            }}
          >
            <Reveal direction="right" delay={0.2}>
              <AIChatBubble />
            </Reveal>
          </div>
        </motion.div>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          style={{ width: "100%", paddingBottom: 100 }}
        >
          <motion.div variants={staggerItem}>
            <div
              className="section-padding"
              style={{ maxWidth: 1200, margin: "0 auto", padding: "0 40px" }}
            >
              <Divider spacing={80} />
              <Reveal direction="left">
                <div style={{ textAlign: "left" }}>
                  <SectionLabel>Capabilities</SectionLabel>
                </div>
              </Reveal>
            </div>
          </motion.div>
          <motion.div variants={staggerItem} style={{ width: "100%" }}>
            <SkillMarquee
              items={[
                ...SITE_DATA.skills.find(s => s.category === "Product")?.items ?? [],
                ...SITE_DATA.skills.find(s => s.category === "AI Tools")?.items ?? [],
              ]}
              speed={30}
              direction="left"
              label="Strategy & AI"
              fullWidth
            />
            <SkillMarquee
              items={[
                ...SITE_DATA.skills.find(s => s.category === "Development")?.items ?? [],
                ...SITE_DATA.skills.find(s => s.category === "Design")?.items ?? [],
              ]}
              speed={38}
              direction="right"
              label="Build & Design"
              fullWidth
            />
          </motion.div>
        </motion.div>
      </motion.section>

      {/* ═══ DESIGN WORK ═══ */}
      <motion.section
        id="work"
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        variants={sectionVariants}
        style={{
          background: C.bgAlt, padding: "100px 0",
        }}
      >
        <motion.div
          style={{ maxWidth: 1200, margin: "0 auto", padding: "0 40px" }}
          className="section-padding"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          <Reveal>
            <motion.div variants={staggerItem}>
              <SectionLabel>Design Work</SectionLabel>
            </motion.div>
            <motion.h2
              variants={staggerItem}
              style={{
                fontFamily: FONT.display, fontSize: 42, fontWeight: 400,
                fontStyle: "italic", lineHeight: 1.15, marginBottom: 12,
                maxWidth: 500,
              }}
            >
              The design foundation
            </motion.h2>
            <motion.p
              variants={staggerItem}
              style={{
                fontFamily: FONT.body, fontSize: 15, lineHeight: 1.6,
                color: C.inkMuted, marginBottom: 48, maxWidth: 500,
              }}
            >
              Selected work from my Graphic Information Technology program at ASU, freelance projects, and personal explorations.
            </motion.p>
          </Reveal>

          <motion.div
            className="three-col design-card-grid"
            variants={staggerItem}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 16,
              rowGap: 16,
              columnGap: 16,
              alignItems: "stretch",
            }}
          >
            {SITE_DATA.designWork.map((w, i) => (
              <Reveal key={i} delay={(i % 3) * 0.1 + Math.floor(i / 3) * 0.15} gridCell>
                <DesignCard title={w.title} description={w.description} index={i} />
              </Reveal>
            ))}
          </motion.div>

          <motion.div
            variants={staggerItem}
            style={{
              marginTop: 40,
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 14,
            }}
          >
            <Link to="/work"
              style={{
                fontFamily: FONT.mono, fontSize: 12, letterSpacing: 1,
                textTransform: "uppercase", color: C.ink,
                padding: "14px 28px", borderRadius: 2, textDecoration: "none",
                border: `1px solid ${C.ruleStrong}`, transition: "all 0.3s",
                display: "inline-block",
              }}
              onMouseEnter={e => { e.target.style.borderColor = C.accent; e.target.style.color = C.accent; }}
              onMouseLeave={e => { e.target.style.borderColor = C.ruleStrong; e.target.style.color = C.ink; }}
            >
              View full portfolio →
            </Link>

            <Link to="/lightpainting"
              style={{
                fontFamily: FONT.mono, fontSize: 12, letterSpacing: 1,
                textTransform: "uppercase",
                color: C.inkMuted,
                padding: "14px 28px",
                borderRadius: 2,
                textDecoration: "none",
                border: `1px solid ${C.ruleStrong}`,
                transition: "all 0.3s",
                display: "inline-block",
              }}
              onMouseEnter={e => { e.target.style.borderColor = C.accent; e.target.style.color = C.accent; }}
              onMouseLeave={e => { e.target.style.borderColor = C.ruleStrong; e.target.style.color = C.inkMuted; }}
            >
              View Lightpainting Gallery →
            </Link>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* ═══ CONTACT ═══ */}
      <motion.section
        id="contact"
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        variants={sectionVariants}
        style={{
          maxWidth: 1200, margin: "0 auto", padding: "100px 40px 120px",
        }}
        className="section-padding"
      >
        <motion.div
          className="two-col"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          style={{
            display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "start",
          }}
        >
          <Reveal direction="left">
            <motion.div variants={staggerItem}>
              <SectionLabel>Get in touch</SectionLabel>
              <h2 style={{
                fontFamily: FONT.display, fontSize: 42, fontWeight: 400,
                fontStyle: "italic", lineHeight: 1.15, marginBottom: 20,
                display: "flex", flexWrap: "wrap", gap: "0.25em",
              }}>
                {"Let's build something.".split(" ").map((word, i) => (
                  <Reveal key={i} delay={0.08 * i}>
                    <span style={{ display: "inline-block" }}>{word}</span>
                  </Reveal>
                ))}
              </h2>
              <Reveal glowText>
                <p style={{
                  fontFamily: FONT.body, fontSize: 16, lineHeight: 1.7,
                  color: C.inkSoft, maxWidth: 440,
                }}>
                  I'm looking for founder-track product roles, system architecture leadership, and AI-native teams where research, accessibility, and ship velocity share a roadmap. Open to full-time opportunities starting now {SITE_DATA.graduation}.
                </p>
              </Reveal>
            </motion.div>
          </Reveal>

          <Reveal direction="right" delay={0.15}>
          <motion.div variants={staggerItem} style={{ paddingTop: 48 }}>
            {[
              { label: "Email", value: SITE_DATA.email, href: `mailto:${SITE_DATA.email}` },
              { label: "Phone", value: SITE_DATA.phone, href: `tel:${SITE_DATA.phone.replace(/[^0-9]/g, "")}` },
              { label: "Location", value: SITE_DATA.location },
              { label: "Education", value: SITE_DATA.school },
            ].map((item, i) => (
              <div key={i} style={{
                padding: "16px 0",
                borderBottom: `1px solid ${C.rule}`,
                display: "flex", justifyContent: "space-between", alignItems: "baseline",
                gap: 20,
              }}>
                <span style={{
                  fontFamily: FONT.mono, fontSize: 10, letterSpacing: 2,
                  textTransform: "uppercase", color: C.inkFaint,
                  minWidth: 80,
                }}>
                  {item.label}
                </span>
                {item.href ? (
                  <a href={item.href} style={{
                    fontFamily: FONT.body, fontSize: 15, color: C.ink,
                    textDecoration: "none", textAlign: "right",
                    transition: "color 0.2s",
                  }}
                    onMouseEnter={e => e.target.style.color = C.accent}
                    onMouseLeave={e => e.target.style.color = C.ink}
                  >
                    {item.value}
                  </a>
                ) : (
                  <span style={{
                    fontFamily: FONT.body, fontSize: 15, color: C.ink,
                    textAlign: "right",
                  }}>
                    {item.value}
                  </span>
                )}
              </div>
            ))}
            <a
              href="/camden-blackburn-resume.pdf"
              download
              style={{
                display: "inline-block",
                marginTop: 24,
                fontFamily: FONT.mono,
                fontSize: 13,
                color: "#E05B5B",
                textDecoration: "none",
                textUnderlineOffset: 3,
                transition: "text-decoration 0.2s",
              }}
              onMouseEnter={e => { e.target.style.textDecoration = "underline"; }}
              onMouseLeave={e => { e.target.style.textDecoration = "none"; }}
            >
              Download Resume (PDF)
            </a>
          </motion.div>
          </Reveal>
        </motion.div>
      </motion.section>

      </main>

      {/* ═══ FOOTER ═══ */}
      <motion.footer
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewport}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{
        borderTop: `1px solid ${C.rule}`, padding: "32px 40px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        maxWidth: 1200, margin: "0 auto",
      }} className="section-padding">
        <span style={{
          fontFamily: FONT.mono, fontSize: 10, letterSpacing: 1.5,
          color: C.inkFaint, textTransform: "uppercase",
        }}>
          © 2026 Camden Blackburn
        </span>
        <span style={{
          fontFamily: FONT.display, fontSize: 16, fontStyle: "italic",
          color: C.inkFaint,
        }}>
          Built with AI, designed with intent.
        </span>
      </motion.footer>
    </div>
  );
}
