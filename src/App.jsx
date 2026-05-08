import React, { useState, useEffect, useRef, useCallback, memo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useSpring, animated } from "@react-spring/web";
import HeroBackground from "./HeroBackground";
import PortraitCard from "./PortraitCard.jsx";
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

  intro: `I work as a product founder and system designer: framing problems, shipping MVPs, and building design languages with teams. Active projects include RealCopy (AI-assisted workflows for real estate marketing and listing context), DealerDeck LLC (automotive SaaS), BirdsEye (drone orthomosaic and construction visualization), the ASU Polytechnic campus visual system, and selected client brand engagements.

I use AI tools where they improve research, build speed, and quality — alongside design and engineering judgment. I am completing a B.S. in Graphic Information Technology at Arizona State University.`,

  aiPhilosophy: {
    title: "How I Use AI",
    paragraphs: [
      "I don't use AI to skip the work. I use it to extend what I can ship: research, prototyping, and iteration alongside taste and product judgment.",
      "Tools in the stack include models and assistants for research and drafting, prompt-driven development environments, and image generation for exploration — used deliberately, with clear acceptance criteria.",
      "The skill is knowing when to rely on a tool and when to override it with constraints from users, brand, accessibility, and production reality.",
    ],
  },

  /** Practice pillars — narrative IA for founder / architect positioning */
  practicePillars: [
    {
      title: "Entrepreneurship",
      description:
        "DealerDeck LLC (automotive SaaS) and RealCopy (real estate). Founder-led problem framing, MVP delivery, and iteration with pilot users.",
    },
    {
      title: "Systems Architecture",
      description:
        "ASU Polytechnic design system — isometric grid construction, Mother Shape narrative, and coordination across environmental, digital, and print applications.",
    },
    {
      title: "Technical Innovation",
      description:
        "BirdsEye — drone orthomosaic workflows, 3D reconstruction, and web-based maps for construction and site stakeholders.",
    },
    {
      title: "Creative Excellence",
      description:
        "Photography and automotive lightpainting — composition and lighting discipline that inform product and brand work.",
    },
  ],

  designWork: [
    { title: "Brand Identity Systems", description: "Logo design, visual identity, brand guidelines for small businesses and personal projects." },
    { title: "Photography", description: "Architectural, automotive, and travel photography." },
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
      status: "Completed",
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
      status: "Completed",
      caseStudyId: "southwest",
    },
  ],

  /** Full case study payloads — same schema for CaseStudyLayout / inline panels */
  caseStudyById: {
    realcopy: {
      name: "RealCopy",
      status: "Beta — TestFlight",
      description:
        "RealCopy combines AI-assisted listing and marketing copy with property and market context so agents can draft content and reference comps and neighborhood signals in one mobile-first flow. Distributed via TestFlight; stack and integrations are listed below.",
      process: [
        { phase: "Problem", detail: "Real estate agents often maintain listing copy, social posts, and market context using separate tools and manual steps." },
        { phase: "Research", detail: "Compared tools that emphasize copy generation versus those that emphasize MLS-style data, to define a single-flow experience." },
        { phase: "Design", detail: "Mobile-first flows aimed at use between showings: property context and generated content accessible together." },
        { phase: "Build", detail: "Expo/React Native, Supabase, Railway, and the service integrations listed in the stack." },
        { phase: "Ship", detail: "TestFlight builds and iteration from beta feedback." },
      ],
      processDetails: [
        { title: "Scope", detail: "The product keeps listing narratives, social-ready snippets, and property-aware context in one surface so agents are not bouncing between a writing tool, a maps tab, and a spreadsheet of comps. The goal is a single place to sanity-check tone and facts before anything goes live.", omitMetric: true },
        { title: "Differentiation", detail: "Most assistants stop at generic copy; MLS-style tools stop at raw fields. RealCopy is positioned where those meet: generated language that can still lean on structured property and neighborhood signals, so the output feels specific to the address instead of interchangeable filler.", omitMetric: true },
        { title: "Interaction model", detail: "Flows assume interruptions: short sessions between showings, one hand on the wheel, and no patience for deep menus. Primary jobs are surfaced up front, with fast paths back to the last listing and predictable places for edits before sharing.", omitMetric: true },
        { title: "Integrations", detail: "The stack combines mobile delivery with managed backends and third-party APIs for maps, valuations, and enrichment. Wiring is treated as part of the product: failures, rate limits, and stale data need clear handling in the UI, not silent wrong answers.", omitMetric: true },
        { title: "Delivery", detail: "Ships through TestFlight so real agents can stress content quality, data freshness, and edge cases on their own listings. Feedback tightens prompts, fallbacks, and which fields are safe to emphasize in marketing versus disclosure-heavy contexts.", omitMetric: true },
      ],
      stack: ["Expo / React Native", "Supabase", "Railway", "Gemini API", "Vertex AI", "Google Places API", "Rentcast API", "Cursor AI"],
    },
    dealerdeck: {
      name: "DealerDeck LLC",
      status: "In Progress — MVP",
      description:
        "SaaS exploration shaped by front-line dealership experience (including time as valet at BMW North Scottsdale): sales-centric workflows, CRM handoffs, and AI-assisted capture — with integration and scale dependent on each dealer’s stack and pilots.",
      stack: ["Product strategy", "React / web", "APIs", "Cursor AI", "Gemini", "Customer pilots"],
      process: [
        { phase: "Problem", detail: "Sales staff often face CRM workflows tuned to management reporting rather than fast, accurate logging at the point of conversation." },
        { phase: "Research", detail: "Conversations across sales, management, and dealership operations to map how data moves today." },
        { phase: "Design", detail: "Mobile-first, low-friction logging (including voice where appropriate), summaries, and prompts aligned to dealership vocabulary — exact feature set depends on pilot agreements." },
        { phase: "Build", detail: "React Native builds for iOS/Android, TestFlight distribution, AI-assisted development tools; CRM integration approach follows each dealer’s system of record." },
        { phase: "MVP", detail: "Pilot onboarding and roadmap for compliance and multi-location scale." },
      ],
      processDetails: [
        { title: "Context", detail: "DealerDeck is grounded in observed dealership operations and front-line sales workflows—not abstract “auto industry” slides. Time on the lot and in handoffs made it obvious where CRM friction actually shows up for reps versus what leadership dashboards celebrate.", omitMetric: true },
        { title: "CRM reality", detail: "Most CRMs are sold on compliance and forecasting, but day-to-day value for reps is about fast, accurate touch logging without derailing a conversation. The work prioritizes rep-side usefulness and data quality over manager-only reporting views that never get corrected at the source.", omitMetric: true },
        { title: "Capture UX", detail: "Capture is designed for the lot and the curb: minimal taps, voice where it helps, and immediate confirmation so reps trust what was saved. The objective is to lower the activation energy of good notes so incomplete records are the exception, not the norm.", omitMetric: true },
        { title: "AI use", detail: "Models assist with drafting and summarization, but humans stay in control: edits are always available, prompts respect dealership vocabulary, and outputs are framed as starting points rather than immutable truth. That balance matters when a note might surface in a trade appraisal or a compliance review.", omitMetric: true },
        { title: "Roadmap", detail: "Rollout stays pilot-driven: each dealer brings a different CRM, roster, and risk tolerance. Integration paths, audit expectations, and success criteria are negotiated per rooftop so the roadmap stays tied to measurable adoption instead of a generic feature checklist.", omitMetric: true },
      ],
    },
    birdseye: {
      name: "BirdsEye",
      status: "Case study",
      description:
        "Drone orthomosaic and 3D reconstruction for construction and site operations: flight planning, control-point discipline where used, and browser-based maps for field and office stakeholders.",
      stack: ["Photogrammetry", "Pix4D / ODM", "GIS", "Three.js / web GL", "Python tooling"],
      process: [
        { phase: "Problem", detail: "Site documentation often lives in disconnected photos and static exports instead of a single map surface." },
        { phase: "Research", detail: "Capture frequency, accuracy needs, and how teams review maps on site." },
        { phase: "Design", detail: "Layered orthomosaics, measurement and comparison views, contrast suited to outdoor screens." },
        { phase: "Build", detail: "Pipeline from capture to tiles and meshes; exports for CAD/GIS where required." },
        { phase: "Deliver", detail: "Repeatable flight and QA notes per project, with client-facing packages as agreed." },
      ],
      processDetails: [
        { title: "Accuracy", detail: "Where quantities or disputes matter, control points and camera checks back the orthomosaic before anyone bets a pay app on eyeballing tiles alone. The workflow leaves an explainable trail: what was flown, how it was referenced, and what assumptions still belong in a surveyor’s lane.", omitMetric: true },
        { title: "Cadence", detail: "Flight rhythm follows the job, not a calendar template: earthwork, vertical work, and closeout all need different evidence. Scheduling captures against phase milestones keeps the map aligned with what supers and owners are actually arguing about that week.", omitMetric: true },
        { title: "Stakeholders", detail: "Owners, GCs, subs, and safety leads ask different questions from the same ortho base. Layers, filters, and exports are tuned so each group gets legible answers without maintaining four unrelated photo dumps that drift out of sync.", omitMetric: true },
        { title: "3D outputs", detail: "Meshes, contours, and derived linework support coordination and as-built documentation when the engagement calls for them—not as vanity reels, but as artifacts that plug into how the team already reviews work in CAD or GIS.", omitMetric: true },
        { title: "Field use", detail: "Review happens on phones and tablets in glare and dust, often with uneven connectivity. Interaction targets, contrast, and offline-tolerant viewing patterns are part of the product, not an afterthought mocked up only on a desktop monitor.", omitMetric: true },
      ],
    },
    polytechnic: {
      name: "ASU Polytechnic Design System",
      status: "Completed",
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
        { title: "Grid logic", detail: "The isometric module scales from posters and digital templates to environmental applications without ad-hoc stretching. That discipline keeps student makerspace outputs and official communications feeling like one family instead of a pile of one-off lockups.", omitMetric: true },
        { title: "Mother Shape", detail: "Mother Shape is the rhetorical spine: sub-brands and campaigns resolve back to a shared silhouette language so diversity reads as intentional, not accidental. The system document explains when to lean full mark, wordmark, or pattern—and when restraint is the right flex.", omitMetric: true },
        { title: "Coordination", detail: "Campus work crosses facilities, web, recruitment events, and student showcases. Sequencing deliverables and ownership prevents the classic trap where signage ships before web templates exist, or vice versa, and the public sees two different schools.", omitMetric: true },
        { title: "Accessibility", detail: "Type scale, stroke weights, and contrast are checked for exterior signage in sun, kiosk screens in shade, and long-form reading on the web. Outdoor legibility and digital AA-minded pairings are treated as constraints to design into, not polish at the end.", omitMetric: true },
        { title: "Rollout", detail: "Templates, short training, and office hours give partners a path off of rogue InDesign files. Versioned drops and clear naming reduce “closest enough” exports that slowly erode the system the semester after launch.", omitMetric: true },
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
        { title: "Legibility", detail: "The mark and type are stressed at tiny social avatars, mid-size web headers, and projected stage treatments before anything is locked. That range catches awkward stroke weights and shimmer-prone color pairs early, when fixes are cheap.", omitMetric: true },
        { title: "Templates", detail: "Volunteers rotate; design literacy does not. Layouts bake in safe zones, minimum clear space, and locked layers so speaker swaps or sponsor additions do not accidentally nudge the grid into a different event altogether.", omitMetric: true },
        { title: "Deliverables", detail: "Deliverables span print programs, directional pieces, stage lower-thirds, and social sets so promotion and day-of signage feel like one brand. File bundles are grouped the way organizers actually ship work: by channel, by deadline, and by vendor.", omitMetric: true },
        { title: "Process", detail: "Reviews track the agency course cadence and the organizers’ own milestones—budget checks, speaker confirmations, and venue constraints—so creative rounds stay tied to decisions that unblock production, not abstract taste debates.", omitMetric: true },
        { title: "Outcome", detail: "The outcome is a coherent on-site and promotional presence that reads as TEDx without fighting the venue architecture or the volunteer workflow. The kit also sets up a cleaner refresh next cycle because foundations and naming are already rational.", omitMetric: true },
      ],
    },
    southwest: {
      name: "Southwest Label & Print",
      status: "Completed",
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
        { title: "Research", detail: "Research mixed interviews and shop-floor observation with analytics on quote and reorder flows. The aim was to see where enterprise buyers lost confidence—usually not at the hero image, but at ambiguous capabilities, opaque timelines, or forms that demanded information they did not yet have.", omitMetric: true },
        { title: "Web", detail: "The site restructure foregrounds service taxonomy and a straighter path to “talk to us about this job,” with language that matches how customers describe work in email. Secondary pages carry proof: equipment, materials, and process cues that justify premium positioning without sounding generic.", omitMetric: true },
        { title: "Brand system", detail: "Logo, palette, typography, and voice live in a single reference for internal teams and outside vendors. That reduces one-off interpretations when fleet graphics, trade-show panels, or subcontractor sheets need to stay on brand under deadline pressure.", omitMetric: true },
        { title: "Print", detail: "Print specifications respect die lines, ink limits, and finishing steps the shop actually runs—so sales promises in the PDF match what production will sign off. Jargon on the floor is translated for customers without dumbing down the craft.", omitMetric: true },
        { title: "Rollout", detail: "Launch phases respect press downtime, fleet installation windows, and sales’ need for consistent story during the switch. Staggering stationery, digital, and vehicle updates avoids the half-old identity that undermines trust right when leads are peaking.", omitMetric: true },
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
  const aboutRef = useRef(null);
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
        if (scrollToId === NAV_SCROLL_ROOT || scrollToId === "about" || scrollToId === "home") {
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
              <div style={{ width: "85%", maxWidth: 420 }}>
                <PortraitCard src="/headshot.png" alt="Camden Blackburn" />
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
                  I'm looking for founder-track product roles, system architecture leadership, and teams where research, accessibility, and ship velocity share a roadmap. Open to full-time opportunities starting {SITE_DATA.graduation}.
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
