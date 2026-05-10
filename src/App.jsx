import React, { useState, useEffect, useRef, useCallback, memo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
  tagline:
    "Vision-driven Product Manager and AI Builder bridging the gap between human-centered UX and technical execution.",
  heroMono: "PRODUCT · DESIGN · AI SYSTEMS · AUTOMOTIVE",
  email: "Blackburncamden@gmail.com",
  phone: "(206) 321-6087",
  location: "Scottsdale, AZ",
  school: "Arizona State University — B.S. Graphic Information Technology (UX Focus)",
  graduation: "August 2026",
  /** About section nav/label */
  aboutSectionLabel: "The Approach",
  /** Shown under About — school line + graduation */
  aboutGraduationLine:
    "Arizona State University — B.S. Graphic Information Technology (UX Focus) · Graduating August 2026",

  intro: `My work lives at the intersection of what I see in the field and what I can build at a keyboard. I don’t believe in building software in a vacuum. RealCopy started by talking to real estate agents about their fragmented workflows while I was already on-site doing drone mapping and photography. When I hit the limits of no-code tools, I moved to a full Expo and Supabase stack using AI to accelerate the build without sacrificing the "human" feel of the UX.

DealerDeck came directly from my time on the floor at BMW North Scottsdale. I watched sales reps struggle to balance customer face-time with the administrative weight of CRM logging. I’m building a voice-first solution that turns a quick walk-around into structured data, ensuring the CRM stays updated without the rep ever having to leave the showroom floor.

At ASU Polytechnic, I’ve moved from being a student to a project manager. Leading the TPS design system for the TEM program taught me how to manage stakeholders and steer a cross-functional team toward a cohesive vision. It wasn't just about a logo; it was about creating a system that future cohorts could actually use and scale.

When I'm not shipping code, I'm usually behind a lens or under a hood. Whether it's lightpainting a ZL1 at a midnight meet or experimenting with high-performance modifications on an E36 M3, I apply the same "relentless iteration" mindset to automotive photography and engineering as I do to my apps.

AI is my most effective collaborator. I use it to handle the boilerplate and bridge technical gaps, but the direction—the "why" behind the product—is always human-driven. If a tool doesn't solve a tangible problem for a user standing right in front of me, it isn't finished.`,

  aiPhilosophy: {
    title: "How I Use AI",
    paragraphs: [
      "I view AI as a force multiplier. It allows me to act as a PM, designer, and developer simultaneously, accelerating the path from a \"floor-side\" observation to a functional prototype.",
    ],
  },

  /** Contact section lead paragraph */
  contactBody: `I am currently finishing my B.S. in Graphic Information Technology at ASU (graduating August 2026). If you're looking for a Product Manager who isn't afraid to get into the technical weeds or a builder who starts with the user, let’s talk.`,

  skills: [
    {
      category: "Product",
      items: [
        "Product Roadmap Planning",
        "Prompt Engineering",
        "Gemini/Vertex AI",
        "User Research",
        "Agile Development",
      ],
    },
    {
      category: "AI & dev assist",
      items: [],
    },
    {
      category: "Development",
      items: ["React Native", "Expo", "Supabase"],
    },
    {
      category: "Design",
      items: ["Figma", "Adobe Creative Suite", "FAA Drone Mapping"],
    },
  ],

  /** Group headers for Professional Work (order preserved in UI). */
  workCategoryGroups: [
    {
      id: "agency",
      title: "Design Agency",
      description:
        "Work from ASU’s GIT agency studio—you apply, they take a small cohort, and you’re on real client teams with deadlines and faculty critiques, not hypothetical briefs.",
    },
    {
      id: "entrepreneurial",
      title: "Entrepreneurial",
      description:
        "Products I started and still run: talking to users, wiring the stack, fixing what breaks, and re-cutting copy when testers tell me I’m wrong.",
    },
    {
      id: "branding",
      title: "Branding",
      description:
        "Systems for my own apps plus client launches: AZHype (volleyball club through Cre8tive Influence—guidelines, social templates, collateral they still run today), and freelance marks for shops like Alara Aquatics and Accuracy Solutions.",
    },
  ],

  professionalWork: [
    {
      workCategory: "entrepreneurial",
      client: "RealCopy",
      role: "Founder & Lead Product Builder",
      context: "iPhone app · TestFlight",
      description:
        "Spearheaded the 0-to-1 lifecycle of an AI marketing platform for realtors. Managed everything from initial user research to a TestFlight Beta launch, integrating 7+ APIs to turn a single address into a full market intelligence suite.",
      tags: ["React Native", "Supabase", "Beta"],
      status: "Beta",
      caseStudyId: "realcopy",
    },
    {
      workCategory: "entrepreneurial",
      client: "DealerDeck LLC",
      role: "Founder & Technical Lead",
      context: "Dealership sales tools",
      description:
        "A voice-led showroom intelligence tool born from BMW floor experience. It captures live transcripts and vehicle context, allowing reps to sync notes to the CRM in seconds instead of hours.",
      tags: ["Automotive", "CRM", "MVP"],
      status: "In Progress",
      caseStudyId: "dealerdeck",
    },
    {
      workCategory: "entrepreneurial",
      client: "BirdsEye",
      role: "Technical Lead",
      context: "Construction & sites",
      description:
        "Fly the site, stitch an orthomosaic, and hand supers or owners a link they can open on a phone in the dirt—not a zip of random JPEGs.",
      tags: ["Drone", "Pix4D", "Web map"],
      status: "Case study",
      caseStudyId: "birdseye",
    },
    {
      workCategory: "agency",
      client: "ASU Polytechnic Design System",
      role: "Project Manager & Brand Designer",
      context: "ASU Polytechnic campus",
      description:
        "Directed a cross-functional team to build a comprehensive brand system for the TEM program. Managed timelines and stakeholder reviews, ultimately presenting the 3D-inspired isometric grid system solo to the career advisory board.",
      tags: ["Campus signage", "Figma library", "Training"],
      status: "Completed",
      caseStudyId: "polytechnic",
    },
    {
      workCategory: "agency",
      client: "TEDx Faurot Park 2026",
      role: "Lead Designer",
      context: "Event branding · ASU GIT agency",
      description:
        "Agency-studio cadence in FigJam and critiques; I built the repeatable event pattern from the logo’s branch (AI exploration, then hand-finished art), plus programs, slides, and social templates volunteers could edit without breaking the grid.",
      tags: ["Pattern system", "Print", "Event"],
      status: "Completed",
      caseStudyId: "tedx",
    },
    {
      workCategory: "branding",
      client: "AZHype",
      role: "Lead Designer",
      context: "Cre8tive Influence · Volleyball club",
      description:
        "Full identity for a funded volleyball club and training company—sole designer reporting through Cre8tive Influence, live iteration with the owner, guidelines, collateral, and social templates they still run today.",
      tags: ["Identity", "Guidelines", "Launch"],
      status: "Completed",
    },
    {
      workCategory: "branding",
      client: "Alara Aquatics",
      role: "Freelance Designer",
      context: "Family business · Branding",
      description:
        "Logo and brand collateral for my dad’s company—tight scope, fast turnaround, files ready for web and print vendors.",
      tags: ["Logo", "Freelance"],
      status: "Completed",
    },
    {
      workCategory: "branding",
      client: "Accuracy Solutions",
      role: "Freelance Designer",
      context: "Family business · Branding",
      description:
        "Brand refresh and mockups for my uncle’s company—clear mark, simple usage notes, and export-ready assets.",
      tags: ["Logo", "Freelance"],
      status: "Completed",
    },
    {
      workCategory: "agency",
      client: "Southwest Label & Print",
      role: "Lead Designer",
      context: "ASU GIT agency cohort",
      description:
        "Rebrand and B2B web direction after shop-floor interviews—new mark, type, and clearer paths for quote requests so buyers see what the presses actually run.",
      tags: ["Print", "Web", "B2B"],
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
        "An iPhone app built for the \"in-between\" moments of a realtor's day. I architected a mobile-first experience that optimizes complex data retrieval—pulling from Rentcast, Google Places, and Gemini—to ensure core tasks are completed in under three taps.",
      process: [
        {
          phase: "Problem",
          detail:
            "Realtors were losing hours to \"context switching\" between MLS data and AI writing tools. I saw the friction firsthand while shooting property videos.",
        },
        { phase: "Prototype", detail: "First pass in Glide to test flows; hit limits on layout, data modeling, and the API hooks I needed, so I stopped fighting the no-code shell." },
        { phase: "Rebuild", detail: "Rebuilt in Expo with Cursor and Claude: own the UI, wire my own API bridges, and iterate prompts without a template ceiling." },
        { phase: "Design", detail: "One property at a time, big type, obvious copy actions, room to edit before anything ships to a listing." },
        { phase: "Ship", detail: "TestFlight builds; agents send screenshots when a line reads wrong or a comp looks off." },
      ],
      processDetails: [
        {
          title: "Problem",
          detail:
            "Realtors were losing hours to context switching between MLS data and AI writing tools—I saw it while shooting property videos and in interviews.",
          omitMetric: true,
        },
        {
          title: "Prototype",
          detail:
            "First Glide pass proved the flow but broke on layout and API depth—enough signal to commit to a real codebase.",
          omitMetric: true,
        },
        {
          title: "Rebuild",
          detail:
            "Expo + Cursor + Claude so I own UI, bridges, and prompts—no template ceiling when guardrails need to change.",
          omitMetric: true,
        },
        {
          title: "Design",
          detail:
            "One property at a time: big type, obvious copy actions, room to edit before anything ships to a listing.",
          omitMetric: true,
          image: {
            src: "/RealCopy-Logo-design.png",
            alt: "RealCopy logo and identity exploration",
            caption: "Early mark and UI language before the live product and marketing site.",
            maxHeight: "min(300px, 40vh)",
          },
        },
        {
          title: "Ship",
          detail: "Widening beta only after repeated fixes on guardrails and source citations for numbers.",
          omitMetric: true,
          image: {
            src: "/Realcopy-website-screenshot.png",
            alt: "RealCopy marketing site and product preview",
            caption: "Public-facing site and beta flow—one address in, listing-ready copy and context out.",
          },
        },
      ],
      stack: ["Expo / React Native", "Supabase", "Railway", "Gemini API", "Vertex AI", "Google Places API", "Rentcast API", "Cursor AI"],
      links: [{ label: "App preview", href: "https://realcopylanding.vercel.app/" }],
    },
    dealerdeck: {
      name: "DealerDeck LLC",
      status: "In Progress — pilot",
      description:
        "Developed at BMW North Scottsdale to solve the \"I'll do the CRM later\" problem. It uses domain-specific tables for BMW trims and zones to ensure the AI-generated summaries match the specific language of the dealership lot.",
      stack: ["React Native", "Supabase", "Inventory APIs", "Custom BMW reference tables", "Cursor", "Gemini", "Live pilot feedback"],
      links: [{ label: "App preview", href: "https://www.dealerdeckapp.com" }],
      process: [
        {
          phase: "Problem",
          detail:
            "Note-taking and CRM updates slip when the next up is already walking over—voice memos and half-filled fields don’t help finance or follow-up.",
        },
        {
          phase: "Research",
          detail:
            "Worked the lot, watched how inventory is tracked, and asked which CRM fields actually get read vs which are checkbox theater.",
        },
        {
          phase: "Design",
          detail:
            "Voice capture with instant transcript, obvious edit/stop controls, and on-screen proof of what will sync so reps trust it over sticky notes.",
        },
        {
          phase: "Build",
          detail:
            "React Native client, Supabase where it helps, inventory API ingestion, domain tables for model/trim language, AI assist only for formatting—not for auto-texting customers.",
        },
        {
          phase: "Pilot",
          detail:
            "Rolling with real ups: GM and sales manager signed off, reps give weekly friction notes while I harden CRM export rules per store policy.",
        },
      ],
      processDetails: [
        {
          title: "Problem",
          detail:
            "Started while parking cars and hearing “I’ll fix CRM later.” If it fails at the curb in front of a customer, the feature doesn’t ship.",
          omitMetric: true,
        },
        {
          title: "Research",
          detail:
            "Worked the lot and tied answers to the same inventory feeds the website uses—plus dealer-specific naming—so “where’s that X3?” matches the map employees expect.",
          omitMetric: true,
        },
        {
          title: "Design",
          detail:
            "Voice capture with instant transcript, obvious edit/stop controls, and on-screen proof of what will sync so reps trust it over sticky notes.",
          omitMetric: true,
          image: {
            src: "/Dealerdeck-Design.PNG",
            alt: "DealerDeck voice capture and transcript UI",
            caption: "In-app capture: live transcript and structured handoff before anything hits the CRM.",
            maxHeight: "min(300px, 40vh)",
          },
        },
        {
          title: "Build",
          detail:
            "React Native + Supabase + domain tables: structured payloads for the CRM, compliance-aware boundaries on what stays on-device vs server-side.",
          omitMetric: true,
        },
        {
          title: "Pilot",
          detail:
            "Pilot users are active; leadership buy-in is there; next milestone is dependable CRM integrations instead of one-off exports.",
          omitMetric: true,
          image: {
            src: "/DealerDeck-Website-Screenshot.png",
            alt: "DealerDeck product website",
            caption: "Product surface for dealers—same story as the app, built for quick trust and sign-up.",
          },
        },
      ],
    },
    birdseye: {
      name: "BirdsEye",
      status: "Case study",
      description:
        "Construction teams were trading folders of drone stills. BirdsEye is the boring-but-useful version: fly a grid, stitch an orthomosaic, host a zoomable map supers can open next to the trench.",
      stack: ["Pix4D / ODM", "Ground control when needed", "QGIS", "Three.js / WebGL", "Python helpers"],
      process: [
        { phase: "Problem", detail: "Supers were screenshotting Google Earth or emailing JPEGs named “final_FINAL2” and still arguing about square footage." },
        { phase: "Research", detail: "Asked how often they needed fresh passes—grading vs pour vs punch—and what accuracy actually changed a decision." },
        { phase: "Design", detail: "High-contrast map tiles, simple measure/compare, nothing that requires a GIS degree to pan around." },
        { phase: "Build", detail: "Process raw imagery to tiles/mesh; export DXF/geo when the engineer asks for it." },
        { phase: "Deliver", detail: "Hand off a link + a short flight log (date, altitude, control points) so disputes have a paper trail." },
      ],
      processDetails: [
        {
          title: "Problem",
          detail:
            "Supers were screenshotting Google Earth or emailing JPEGs named “final_FINAL2”—if quantity is in dispute, we set ground targets and re-fly instead of guessing from uncorrected tiles.",
          omitMetric: true,
        },
        {
          title: "Research",
          detail:
            "Matched flight cadence to what changes decisions: earthwork wants weekly; closeout might need one last pass.",
          omitMetric: true,
        },
        {
          title: "Design",
          detail:
            "High-contrast tiles and layers so owner, GC, and safety stay on one map instead of three Dropbox folders—nothing that needs a GIS degree to pan around.",
          omitMetric: true,
        },
        {
          title: "Build",
          detail:
            "Process raw imagery to tiles/mesh; meshes and contours only when the job actually uses them in CAD—otherwise it’s noise.",
          omitMetric: true,
        },
        {
          title: "Deliver",
          detail:
            "Hand off a link plus a short flight log; UI tested on phones in Arizona sun—bigger buttons, darker basemap, don’t assume Wi‑Fi.",
          omitMetric: true,
        },
      ],
    },
    polytechnic: {
      name: "ASU Polytechnic Design System (TPS)",
      status: "Completed",
      description:
        "Began when ASU’s Technology, Entrepreneurship, and Management (TEM) program wanted branding that didn’t read as generic ASU. Our professor pushed us past a one-off logo into a real design system so future cohorts couldn’t each invent a new look—we studied MIT-style systematic lab branding, iterated as a team, and landed on a hex-based isometric grid with a 3D-reading cuboid language. That framework scales to the whole Polytechnic while each program keeps a distinct mark inside the family. As project manager I built the grid, shaped the visual language and guidelines, ran timelines and critiques, and was the sole student presenter when we showed the system to employers and ASU faculty on the career advisory board.",
      links: [
        {
          label: "TPS Design System on Behance",
          href: "https://www.behance.net/gallery/249030461/TPS-Design-System-Proposal-Design-Agency",
        },
      ],
      heroAsideMedia: {
        src: "/TPS-logo-example.png",
        alt: "TPS logo lockups and grid construction example",
        caption:
          "Logo construction and 6×6 grid snaps from the system spec—companion to the Mother Shape motion in the timeline.",
        maxWidth: "min(132px, 34vw)",
        maxHeight: "min(92px, 17vh)",
      },
      stack: ["6×6 isometric grid", "Figma components", "Signage specs", "Printed templates", "Faculty training decks"],
      process: [
        { phase: "Problem", detail: "TEM needed its own voice; without rules, every future class risked another mismatched flyer stack across Polytechnic." },
        { phase: "Research", detail: "Audited what communications and facilities already published, compared MIT-style identity systems, and pressure-tested what a grid could enforce." },
        { phase: "Design", detail: "Defined the hex isometric grid, Mother Shape relationships, color for Arizona outdoor media, and allowable remixes for student makers." },
        { phase: "Build", detail: "Packaged Figma libraries, signage specs, InDesign/Canva templates, and training decks for partners." },
        { phase: "Ship", detail: "Presented outcomes to the career advisory board, then handed off versioned zips and office hours so the system survives real use." },
      ],
      processDetails: [
        {
          title: "Problem",
          detail:
            "TEM needed its own voice; without rules, every future class risked another mismatched flyer stack across Polytechnic.",
          omitMetric: true,
          image: {
            src: "/TPS-Problem.png",
            alt: "TPS design system problem framing and context",
            caption: "Problem framing—why Polytechnic needed its own system instead of generic ASU defaults.",
            maxHeight: "min(300px, 40vh)",
          },
        },
        {
          title: "Research",
          detail:
            "Audited published comms, compared MIT-style systems, and ran team critiques in FigJam so priorities and file drops stayed visible.",
          omitMetric: true,
          image: {
            src: "/Figjam-TPS-Screenshot.png",
            alt: "FigJam board for TPS design system planning",
            caption: "Research and alignment—async and live FigJam before locking the grid and marks.",
          },
        },
        {
          title: "Design",
          detail:
            "Defined the 6×6 iso grid, Mother Shape language, and outdoor color—snap-to-grid means on-brand; motion shows how the silhouette flexes across formats.",
          omitMetric: true,
          image: {
            type: "video",
            src: "/TPS-Animation-video.mp4",
            poster: "/TPS-picture.png",
            alt: "Motion study for the TPS Mother Shape and grid system",
            caption: "Mother Shape motion study—paired with grid lockups in the spec (see logo construction stills in the Behance deck).",
          },
        },
        {
          title: "Build",
          detail:
            "Packaged Figma libraries, signage specs, and production vectors—export presets so vendors and student makers don’t guess at trim or color.",
          omitMetric: true,
          image: {
            src: "/TPS-Illustrator-screenshot.png",
            alt: "TPS assets in Adobe Illustrator",
            caption: "Illustrator production files and presets aligned to the shipped template bundle.",
          },
        },
        {
          title: "Ship",
          detail:
            "Presented to the career advisory board and handed off versioned zips plus office hours so the system survives real use.",
          omitMetric: true,
          image: {
            src: "/MeSpeaking.jpg",
            alt: "Camden Blackburn presenting the new ASU Polytechnic campus design system to ASU faculty and career board members",
            caption:
              "Presenting the system to faculty and the career board—explaining how student work and official comms share the same grid.",
            zoom: 1.5,
            zoomOrigin: "center 38%",
          },
        },
      ],
    },
    tedx: {
      name: "TEDx Faurot Park",
      status: "Completed",
      description:
        "2026 TEDx Faurot Park while I was in ASU’s GIT agency cohort. I joined client meetings, worked in shared FigJam boards, and iterated through faculty critiques like any studio engagement. My sharpest contribution is the event pattern system: starting from the branch detail in the approved logo, I used AI to explore vine-like structures, picked the strongest directions, then redrew everything into a repeatable asset volunteers can scale without breaking alignment—alongside programs, slides, and social templates.",
      heroAsideMedia: {
        src: "/TPSgrouppic.jpg",
        alt: "ASU design agency class group photo with Camden Blackburn and project team peers",
        caption: "Agency cohort—the same studio that shipped TEDx and other client work that semester.",
        maxWidth: "min(280px, 100%)",
        maxHeight: "min(200px, 36vh)",
      },
      stack: ["Logo & lockups", "Print programs", "Slide master", "Social templates"],
      process: [
        { phase: "Problem", detail: "Organizers needed one visual language for print, stage, and feed—with volunteers editing files days before showtime." },
        { phase: "Collaboration", detail: "Standing meetings, FigJam brainstorms, and class critiques kept client feedback visible to the whole team." },
        { phase: "Pattern", detail: "Translated the logo branch into a scalable vine motif via AI exploration, manual refinement, and repeat tests at small and large scales." },
        { phase: "Design", detail: "Balanced two-color print defaults, legible social crops, and slide masters that non-designers could trust." },
        { phase: "Deliver", detail: "Packaged bleed-ready PDFs, labeled template layers, and a short handoff so swaps (speakers, sponsors) didn’t break safe zones." },
      ],
      processDetails: [
        {
          title: "Problem",
          detail:
            "Organizers needed one visual language for print, stage, and feed—with volunteers editing files days before showtime.",
          omitMetric: true,
          image: {
            src: "/TedX-Problem.png",
            alt: "TEDx Faurot Park problem and brief context",
            caption: "Brief and constraints—one system for print, stage, and feed before show week.",
            maxHeight: "min(300px, 40vh)",
          },
        },
        {
          title: "Collaboration",
          detail:
            "Standing meetings, FigJam boards, and critiques with the cohort—layer names and folders so organizers always knew which file was current.",
          omitMetric: true,
          image: {
            src: "/Figjam-TedX-Screenshot.png",
            alt: "FigJam board for TEDx Faurot Park branding collaboration",
            caption: "Cohort FigJam—feedback and exploration before locking print and social templates.",
          },
        },
        {
          title: "Pattern",
          detail:
            "AI drafts were references only—the shipping art is hand-tuned so tessellation and contrast hold on fabric and screens.",
          omitMetric: true,
          image: {
            src: "/TedX-Pattern-image.png",
            alt: "TEDx Faurot Park repeatable pattern derived from the logo branch",
            caption: "Final pattern system—tessellates for programs, slides, and wayfinding without breaking the mark.",
          },
        },
        {
          title: "Design",
          detail:
            "Two-color print defaults, legible social crops, and slide masters with safe zones so a volunteer can’t shove sponsor marks into the trim.",
          omitMetric: true,
          image: {
            src: "/TedX-Design.png",
            alt: "TEDx Faurot Park templates, slides, and print design",
            caption: "Templates and masters—safe zones and type locks volunteers could ship under pressure.",
            maxHeight: "min(300px, 40vh)",
          },
        },
        {
          title: "Deliver",
          detail:
            "Bleed-ready PDFs, milestone-grouped bundles (promo, week-of print, day-of social), and a short handoff so swaps don’t break safe zones. One coherent look on stage and online; next year’s team inherits the same structure.",
          omitMetric: true,
          image: {
            type: "video",
            src: "/TedX-delivery.mp4",
            alt: "TEDx Faurot Park delivered print and event materials",
            caption: "Shipped bundles—programs, promos, and day-of pieces ready for volunteers and sponsors.",
            maxHeight: "min(300px, 40vh)",
          },
        },
      ],
    },
    southwest: {
      name: "Southwest Label & Print",
      status: "Completed",
      description:
        "Family print shop with heavy equipment and a dated website. They needed a mark and site that matched the quality of their presses, plus clearer paths for quote requests.",
      stack: ["Identity", "Web redesign", "Shop-floor interviews", "Print specs"],
      process: [
        { phase: "Problem", detail: "Buyers couldn’t tell what the shop actually ran; the quote form bounced people who didn’t already know print jargon." },
        { phase: "Research", detail: "Sat on the floor for a morning, listened to phone quotes, and watched where people abandoned the old form." },
        { phase: "Design", detail: "New logo/lockups, simple color/type rules, web pages organized by capability (labels, wide-format, fleet) instead of insider terms." },
        { phase: "Build", detail: "Worked with their developer on a responsive build; rewrote headlines in plain English." },
        { phase: "Ship", detail: "Phased truck wraps and stationery around press downtime so sales didn’t hand out two different business cards." },
      ],
      processDetails: [
        {
          title: "Problem",
          detail:
            "Buyers couldn’t tell what the shop actually ran; the quote form bounced people who didn’t already know print jargon.",
          omitMetric: true,
        },
        {
          title: "Research",
          detail:
            "Sat on the floor, listened to phone quotes, and found the drop-off was “I don’t know what to upload yet”—so we surfaced a human number higher on the page.",
          omitMetric: true,
        },
        {
          title: "Design",
          detail:
            "New logo/lockups, simple color/type rules, and site structure by capability (labels, wide-format, fleet) instead of insider terms.",
          omitMetric: true,
          image: {
            src: "/Southwestlabel-logo.png",
            alt: "Southwest Label & Print logo redesign",
            caption: "New mark and lockups—built to survive fleet graphics, stationery, and the shop floor.",
          },
        },
        {
          title: "Build",
          detail:
            "Responsive site with service pages in estimator language; Illustrator specs call out real die lines and ink limits so sales doesn’t promise a foil the press can’t run.",
          omitMetric: true,
          image: {
            src: "/Southwest-illustrator-screenshot.png",
            alt: "Southwest Label print artwork in Illustrator",
            caption: "Production files tied to real press capabilities—paired with the web rebuild in plain English.",
          },
        },
        {
          title: "Ship",
          detail:
            "Phased truck wraps and stationery around press downtime so the shop never had trucks in old colors linking to a new URL.",
          omitMetric: true,
        },
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
        if (scrollToId === NAV_SCROLL_ROOT || scrollToId === "home") {
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
        id="hero"
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
                <GlassButton index={1} animationDelay={0.12} onClick={() => document.getElementById("experience")?.scrollIntoView({ behavior: "smooth" })}>
                  Case studies →
                </GlassButton>
                <GlassButton index={2} animationDelay={0.2} href="/work" sameTab>
                  Gallery
                </GlassButton>
                <GlassButton index={3} animationDelay={0.28} href="/Resume.pdf" download sameTab>
                  Resume ↓
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
        id="bio"
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
              <SectionLabel>{SITE_DATA.aboutSectionLabel}</SectionLabel>
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
            <Reveal delay={0.22} glowText>
              <p
                style={{
                  fontFamily: FONT.mono,
                  fontSize: 11,
                  letterSpacing: 1.2,
                  textTransform: "uppercase",
                  color: C.inkMuted,
                  marginBottom: 20,
                  maxWidth: 680,
                  lineHeight: 1.6,
                }}
              >
                {SITE_DATA.aboutGraduationLine}
              </p>
            </Reveal>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* ═══ PROFESSIONAL WORK ═══ */}
      <motion.section
        id="experience"
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        variants={sectionVariants}
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "80px clamp(20px, 5vw, 48px)",
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
                fontStyle: "italic", lineHeight: 1.15, marginBottom: 16,
              }}
            >
              Projects and Case Studies
            </motion.h2>
            <motion.p
              variants={staggerItem}
              style={{
                fontFamily: FONT.body,
                fontSize: 15,
                lineHeight: 1.65,
                color: C.inkMuted,
                maxWidth: 640,
                marginBottom: 40,
              }}
            >
              Grouped by how the work happened—things I’m building myself, client studio semesters at ASU, and big branding rollouts.
            </motion.p>
          </Reveal>
          {SITE_DATA.workCategoryGroups.map((cat) => {
            const projects = SITE_DATA.professionalWork.filter((p) => p.workCategory === cat.id);
            if (projects.length === 0) return null;
            return (
              <div key={cat.id} style={{ marginBottom: "clamp(40px, 6vw, 56px)" }}>
                <Reveal>
                  <h3
                    style={{
                      fontFamily: FONT.display,
                      fontSize: 26,
                      fontWeight: 400,
                      fontStyle: "italic",
                      color: C.ink,
                      marginBottom: 10,
                    }}
                  >
                    {cat.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: FONT.body,
                      fontSize: 14,
                      lineHeight: 1.65,
                      color: C.inkMuted,
                      maxWidth: 720,
                      marginBottom: 28,
                    }}
                  >
                    {cat.description}
                  </p>
                </Reveal>
                {projects.map((project, i) => {
            const caseStudy = project.caseStudyId ? SITE_DATA.caseStudyById[project.caseStudyId] : null;
            const isOpen = Boolean(caseStudy && openCaseStudyId === project.caseStudyId);
            const toggleCaseStudy = caseStudy
              ? () => setOpenCaseStudyId((prev) => (prev === project.caseStudyId ? null : project.caseStudyId))
              : undefined;

            return (
            <Reveal key={`${cat.id}-${project.client}`} delay={0.06 * i}>
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
                    borderRadius: 20,
                    padding: "clamp(22px, 4.5vw, 36px)",
                    marginBottom: 0,
                    transition: "border-color 0.3s ease, box-shadow 0.3s ease",
                    cursor: caseStudy ? "pointer" : "default",
                    ...(isOpen
                      ? {
                          borderColor: "rgba(224, 91, 91, 0.24)",
                          boxShadow: "0 8px 28px rgba(224, 91, 91, 0.08)",
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
                    {Array.isArray(project.bullets) && project.bullets.length > 0 ? (
                      <ul
                        style={{
                          margin: "14px 0 0",
                          paddingLeft: 20,
                          maxWidth: 720,
                        }}
                      >
                        {project.bullets.map((line, bi) => (
                          <li
                            key={bi}
                            style={{
                              fontFamily: FONT.body,
                              fontSize: 13,
                              lineHeight: 1.65,
                              color: C.inkMuted,
                              marginBottom: bi < project.bullets.length - 1 ? 8 : 0,
                            }}
                          >
                            {line}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                    {caseStudy ? (
                      <div
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 8,
                          marginTop: 14,
                          fontFamily: FONT.mono,
                          fontSize: 9,
                          letterSpacing: 1.5,
                          textTransform: "uppercase",
                          color: C.accent,
                          opacity: 0.85,
                        }}
                      >
                        <span
                          aria-hidden
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 16,
                            height: 16,
                            borderRadius: 4,
                            border: "1px solid rgba(224, 91, 91, 0.35)",
                            fontSize: 11,
                            fontWeight: 600,
                            lineHeight: 1,
                          }}
                        >
                          {isOpen ? "−" : "+"}
                        </span>
                        <span>{isOpen ? "Close case study" : "Case study"}</span>
                      </div>
                    ) : null}
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
                      initial={{ opacity: 0, scale: 0.94, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98, y: -6 }}
                      transition={{
                        type: "spring",
                        stiffness: 420,
                        damping: 30,
                        mass: 0.85,
                        opacity: { duration: 0.22 },
                      }}
                      style={{
                        marginTop: "clamp(12px, 2.5vw, 18px)",
                        border: "1px solid rgba(224, 91, 91, 0.22)",
                        borderRadius: 24,
                        overflow: "hidden",
                        background: "#141416",
                        boxShadow:
                          "0 20px 50px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.04) inset, 0 1px 0 rgba(255, 255, 255, 0.06) inset",
                        transformOrigin: "50% 0%",
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
              </div>
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
                ...SITE_DATA.skills.find(s => s.category === "AI & dev assist")?.items ?? [],
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
                  {SITE_DATA.contactBody}
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
              {
                label: "Education",
                value: `${SITE_DATA.school} · ${SITE_DATA.graduation}`,
              },
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
