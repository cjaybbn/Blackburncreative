import React, { useState, useEffect, useRef, useCallback, memo } from "react";
import { Link } from "react-router-dom";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useSpring, animated } from "@react-spring/web";
import logoImg from "./logo.png";
import HeroBackground from "./HeroBackground";
import GlassButton from "./GlassButton";
import AIChatBubble from "./AIChatBubble";

const springConfig = { mass: 1, tension: 170, friction: 26 };
const MAGNETIC_RADIUS = 100;
const MAX_PULL = 10;

// Scroll-triggered animation config (amount: 0.1 = trigger when 10% visible)
const viewport = { once: true, amount: 0.1 };
const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { delayChildren: 0.15, staggerChildren: 0.1 },
  },
};
const staggerItem = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};
const heroTitleVariants = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
};
const heroTaglineVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, delay: 0.3 } },
};

// ─── CAMDEN BLACKBURN — PORTFOLIO ───────────────────────────────────────────
// Editorial + Architectural aesthetic. Warm concrete, sharp type, intentional space.

const SITE_DATA = {
  name: "Camden Blackburn",
  title: "AI Product Builder",
  tagline: "Building products through relentless iteration and cutting-edge AI collaboration.",
  email: "Blackburncamden@gmail.com",
  phone: "(206) 321-6087",
  location: "Phoenix, AZ",
  school: "Arizona State University — B.S. Graphic Information Technology",
  graduation: "Summer 2026",

  intro: `I'm a product builder, designer, and relentless experimenter at the intersection of AI and human-centered design. I've been using AI tools since their earliest public releases — not as a novelty, but as a fundamental part of how I think, create, and ship.

I built RealCopy, an AI-powered marketing platform for real estate agents, from concept to TestFlight beta with no traditional development background. I used prompt engineering, Gemini, Vertex AI, Supabase, and Cursor to bring it to life. When Google's lead designer for Gemini heard about my process, he reached out to meet with me — my perspective as a power user building real products with AI was valuable to his team.

I'm finishing my degree at ASU and looking for roles where I can do what I do best: identify problems, design solutions, and use AI to build them.`,

  realcopy: {
    name: "RealCopy",
    status: "Beta — TestFlight",
    tagline: "AI-powered marketing and market intelligence for real estate agents",
    description: "RealCopy started as a copywriting tool and evolved into a full marketing and data platform for real estate agents. It generates listing descriptions, social media content, and marketing copy — but it also pulls live market data to give agents property snapshots with comparable sales, pricing analysis, and neighborhood context. One app replaces a copywriter, a data analyst, and a social media manager.",
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

  aiPhilosophy: {
    title: "How I Use AI",
    paragraphs: [
      "I don't use AI to skip the work. I use it to do work that wouldn't exist otherwise. Before AI-assisted development, I had product ideas and design skills but no way to build them. Now I can take a concept from napkin sketch to working beta in weeks — not because AI does it for me, but because it amplifies what I already bring: taste, judgment, and an obsessive focus on the user experience.",
      "My workflow treats AI as a collaborator at every stage: Gemini for research and content architecture, Claude for strategic thinking and complex problem-solving, Cursor for prompt-engineered development, and Midjourney for rapid visual exploration. The skill isn't in using any one tool — it's in knowing which tool to reach for, what to ask it, and when to override its suggestions with your own judgment.",
      "When Google's Gemini design team reached out to discuss my workflow, it confirmed something I'd suspected: the people building AI tools often have less insight into how those tools get used in real creative and product work than the people actually using them. That gap is where I operate.",
    ],
  },

  designWork: [
    { title: "Brand Identity Systems", description: "Logo design, visual identity, brand guidelines for small businesses and personal projects." },
    { title: "Photography", description: "Shortlisted at the International Photography Awards. Architectural, automotive, and travel photography." },
    { title: "Social Media Design", description: "Campaign graphics, story templates, and content systems for real estate and lifestyle brands." },
    { title: "Generative AI Art", description: "Prompt-engineered visual concepts using Midjourney and DALL-E for brand exploration and rapid prototyping." },
    { title: "Graphic Design", description: "Print and digital design including posters, marketing materials, and editorial layouts." },
    { title: "Photo Composition", description: "Composite imagery blending photography with digital manipulation for creative and commercial applications." },
  ],

  skills: [
    { category: "Product", items: ["Product Strategy", "UX Design", "User Research", "Rapid Prototyping", "Beta Testing"] },
    { category: "AI Tools", items: ["Gemini / Vertex AI", "Claude", "Cursor AI", "Midjourney", "Prompt Engineering"] },
    { category: "Development", items: ["React Native / Expo", "Supabase", "Railway", "Node.js", "REST APIs"] },
    { category: "Design", items: ["Figma", "Adobe Creative Suite", "Photography", "Brand Identity", "Typography"] },
  ],

  professionalWork: [
    {
      client: "TEDx Faurot Park",
      role: "Brand Designer",
      context: "ASU Design Agency Course",
      description: "Developed the visual brand identity for TEDx Faurot Park including logo, event collateral, and brand guidelines. Collaborated within an agency team structure with creative direction, client presentations, and iterative feedback rounds.",
      tags: ["Branding", "Logo Design", "Event Identity"],
      status: "Completed",
    },
    {
      client: "Southwest Label & Print",
      role: "Lead Designer",
      context: "Client Project",
      description: "Full brand redesign for an established printing company. Scope includes new logo, typography system, UX research, and a complete website redesign. Leading the project from research through final delivery.",
      tags: ["Brand Redesign", "UX Research", "Web Design", "Logo"],
      status: "In Progress",
    },
    {
      client: "ASU TEM Degree Program",
      role: "Project Manager & Brand Designer",
      context: "ASU Partnership",
      description: "Managing the brand development for ASU's Technology Entrepreneurship and Management degree program. Delivering logo, typography system, color palette, and marketing collateral. Leading a team as project manager.",
      tags: ["Project Management", "Branding", "Collateral", "Typography"],
      status: "In Progress",
    },
  ],
};

// ─── PALETTE ────────────────────────────────────────────────────────────────
// Light/accent = logo; dark/background = rgba(42,6,17) shades; text = legible (dark on light, white on dark)
const C = {
  bg: "rgba(42, 6, 17, 0.1)",
  bgAlt: "rgba(42, 6, 17, 0.15)",
  surface: "rgba(42, 6, 17, 0.08)",
  surfaceDim: "rgba(42, 6, 17, 0.05)",
  ink: "rgba(42, 6, 17, 0.95)",
  inkSoft: "rgba(42, 6, 17, 0.75)",
  inkMuted: "rgba(42, 6, 17, 0.6)",
  inkFaint: "rgba(42, 6, 17, 0.4)",
  accent: "#E05B5B",
  accentDim: "rgba(224, 91, 91, 0.08)",
  accentLight: "rgba(224, 91, 91, 0.15)",
  rule: "rgba(42, 6, 17, 0.1)",
  ruleStrong: "rgba(150, 150, 150, 0.2)",
  darkBg: "#141416",
  inkOnDark: "rgba(255, 255, 255, 0.95)",
  inkOnDarkMuted: "rgba(255, 255, 255, 0.7)",
  inkOnDarkFaint: "rgba(255, 255, 255, 0.5)",
};

// ─── FONTS (loaded via Google Fonts link) ───────────────────────────────────
const FONT = {
  display: "'DM Serif Display', Georgia, serif",
  body: "'DM Sans', -apple-system, sans-serif",
  mono: "'JetBrains Mono', monospace",
};

// ─── COMPONENTS ─────────────────────────────────────────────────────────────

const AnimatedNumber = ({ value, suffix = "", prefix = "", duration = 1.5 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const numValue = parseInt(value.toString().replace(/[^0-9]/g, ""), 10) || 0;
    const startTime = Date.now();
    const tick = () => {
      const elapsed = (Date.now() - startTime) / (duration * 1000);
      if (elapsed >= 1) {
        setDisplay(numValue);
        return;
      }
      const eased = 1 - Math.pow(1 - elapsed, 3);
      setDisplay(Math.floor(numValue * eased));
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [isInView, value, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {isInView ? display.toLocaleString() : "0"}
      {suffix}
    </span>
  );
};

const Reveal = ({ children, delay = 0, direction = "up", glowText = false }) => {
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

const SkillMarquee = ({ items, speed = 30, direction = "left", label }) => {
  const [isPaused, setIsPaused] = useState(false);
  const allItems = [...items, ...items, ...items];

  return (
    <div style={{ marginBottom: 24 }}>
      {label && (
        <div style={{
          fontFamily: FONT.mono, fontSize: 10, letterSpacing: 2,
          textTransform: "uppercase", color: "rgba(74, 70, 64, 0.35)",
          marginBottom: 10,
        }}>
          {label}
        </div>
      )}
      <div
        style={{
          overflow: "hidden",
          width: "100%",
          padding: "12px 0",
          maskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
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

// ─── NAV (frosted glass pill + dock magnification) ───────────────────────────
const NavLink = ({ label, id, href, isActive, mouseX, navRef, scrollTo }) => {
  const linkRef = useRef(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (mouseX === null || !navRef?.current || !linkRef.current) {
      setScale(1);
      return;
    }
    const navRect = navRef.current.getBoundingClientRect();
    const linkRect = linkRef.current.getBoundingClientRect();
    const linkCenter = linkRect.left + linkRect.width / 2 - navRect.left;
    const distance = Math.abs(mouseX - linkCenter);
    const maxDist = 120;
    const newScale = distance > maxDist ? 1 : 1 + 0.12 * Math.pow(1 - distance / maxDist, 2);
    setScale(newScale);
  }, [mouseX, navRef]);

  const innerStyle = {
    fontFamily: FONT.mono,
    fontSize: 11,
    fontWeight: isActive ? 600 : 400,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: isActive ? "#E05B5B" : scale > 1.05 ? "#E05B5B" : "rgba(26, 24, 20, 0.5)",
    padding: "8px 14px",
    borderRadius: 8,
    cursor: "pointer",
    transition: "color 0.2s ease, background 0.2s ease",
    background: scale > 1.1 ? "rgba(224, 91, 91, 0.06)" : "transparent",
    display: "inline-block",
    whiteSpace: "nowrap",
    textDecoration: "none",
  };

  return (
    <span
      ref={linkRef}
      style={{
        transform: `scale(${scale})`,
        transformOrigin: "center bottom",
        transition: "transform 0.28s ease-out",
        display: "inline-block",
      }}
    >
      {href ? (
        <Link to={href} style={innerStyle}>
          {label}
        </Link>
      ) : (
        <span
          onClick={() => scrollTo(id)}
          style={innerStyle}
          role="button"
          tabIndex={0}
          onKeyDown={e => e.key === "Enter" && scrollTo(id)}
        >
          {label}
          {isActive && (
            <div style={{
              width: 4, height: 4, borderRadius: "50%",
              background: "#E05B5B",
              margin: "4px auto 0",
            }} />
          )}
        </span>
      )}
    </span>
  );
};

const Nav = ({ activeSection }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mouseX, setMouseX] = useState(null);
  const navRef = useRef(null);
  const logoRef = useRef(null);
  const [logoScale, setLogoScale] = useState(1);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const scrollTo = (id) => {
    setMenuOpen(false);
    if (id && id !== "about") document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavMouseMove = useCallback((e) => {
    if (window.innerWidth <= 768) return;
    if (!navRef.current) return;
    const rect = navRef.current.getBoundingClientRect();
    setMouseX(e.clientX - rect.left);
  }, []);
  const handleNavMouseLeave = useCallback(() => setMouseX(null), []);

  useEffect(() => {
    if (mouseX === null || !navRef?.current || !logoRef.current) {
      setLogoScale(1);
      return;
    }
    const navRect = navRef.current.getBoundingClientRect();
    const logoRect = logoRef.current.getBoundingClientRect();
    const logoCenter = logoRect.left + logoRect.width / 2 - navRect.left;
    const distance = Math.abs(mouseX - logoCenter);
    const maxDist = 120;
    setLogoScale(distance > 120 ? 1 : 1 + 0.12 * Math.pow(1 - distance / maxDist, 2));
  }, [mouseX]);

  const links = [
    { id: "about", label: "About" },
    { id: "realcopy", label: "RealCopy" },
    { id: "experience", label: "Experience" },
    { id: "process", label: "Process" },
    { id: "work", label: "Work", href: "/work" },
    { id: "contact", label: "Contact" },
  ];

  const pillStyle = {
    position: "fixed",
    top: 12,
    left: "50%",
    transform: "translateX(-50%)",
    borderRadius: 50,
    overflow: "hidden",
    background: scrolled ? "rgba(255, 255, 255, 0.22)" : "rgba(255, 255, 255, 0.12)",
    backdropFilter: "blur(24px) saturate(1.5)",
    WebkitBackdropFilter: "blur(24px) saturate(1.5)",
    border: scrolled ? "1px solid rgba(255, 255, 255, 0.22)" : "1px solid rgba(255, 255, 255, 0.18)",
    boxShadow: scrolled
      ? "0 4px 24px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.25)"
      : "0 4px 24px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
    padding: "8px 12px",
    zIndex: 1000,
    display: "flex",
    alignItems: "center",
    gap: 4,
    transition: "background 0.4s ease, border 0.4s ease, box-shadow 0.4s ease",
  };

  return (
    <>
      <nav
        ref={navRef}
        onMouseMove={handleNavMouseMove}
        onMouseLeave={handleNavMouseLeave}
        style={pillStyle}
        className="nav-pill"
      >
        {/* Top edge glint */}
        <div style={{
          position: "absolute",
          top: 0,
          left: "15%",
          right: "15%",
          height: 1,
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)",
          borderRadius: "50px 50px 0 0",
          pointerEvents: "none",
        }} />
        {/* Logo (dock magnification) */}
        <div
          ref={logoRef}
          onClick={() => scrollTo(null)}
          style={{
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            transform: `scale(${logoScale})`,
            transformOrigin: "center bottom",
            transition: "transform 0.28s ease-out",
          }}
          role="button"
          tabIndex={0}
          onKeyDown={e => e.key === "Enter" && scrollTo(null)}
        >
          <img src={logoImg} alt="Home" style={{ height: 28, width: "auto", display: "block" }} />
        </div>
        <div className="nav-pill-divider" style={{
          width: 1, height: 16, background: "rgba(0,0,0,0.08)", margin: "0 8px", flexShrink: 0,
        }} />
        {/* Desktop links */}
        <div style={{ display: "flex", gap: 4, alignItems: "center" }} className="desktop-nav">
          {links.map(l => (
            <NavLink
              key={l.id}
              id={l.id}
              label={l.label}
              href={l.href}
              isActive={activeSection === l.id}
              mouseX={mouseX}
              navRef={navRef}
              scrollTo={scrollTo}
            />
          ))}
        </div>
        {/* Mobile hamburger — only visible on mobile via .mobile-nav-toggle */}
        <div
          className="mobile-nav-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            width: 40,
            height: 40,
            cursor: "pointer",
            display: "none",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: 5,
          }}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          <div style={{
            width: 20, height: 2, background: C.ink,
            transition: "transform 0.3s ease",
            transformOrigin: "center",
            transform: menuOpen ? "rotate(45deg) translate(5px, 5px)" : "none",
          }} />
          <div style={{
            width: 20, height: 2, background: C.ink,
            transition: "opacity 0.3s ease",
            opacity: menuOpen ? 0 : 1,
          }} />
          <div style={{
            width: 20, height: 2, background: C.ink,
            transition: "transform 0.3s ease",
            transformOrigin: "center",
            transform: menuOpen ? "rotate(-45deg) translate(5px, -5px)" : "none",
          }} />
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 999,
          background: "rgba(244, 241, 236, 0.98)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
          display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", gap: 32, paddingTop: 80,
        }}>
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
            style={{
              position: "absolute", top: 20, right: 24,
              width: 40, height: 40, padding: 0, border: "none",
              background: "transparent", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#E05B5B",
            }}
          >
            <span style={{ fontSize: 32, lineHeight: 1 }}>×</span>
          </button>
          {links.map(l => (
            l.href ? (
              <Link key={l.id} to={l.href} onClick={() => setMenuOpen(false)} style={{
                fontFamily: FONT.display, fontSize: 28, fontStyle: "italic",
                color: "#E05B5B", cursor: "pointer", textDecoration: "none",
              }}>
                {l.label}
              </Link>
            ) : (
              <span key={l.id} onClick={() => { scrollTo(l.id); setMenuOpen(false); }} style={{
                fontFamily: FONT.display, fontSize: 28, fontStyle: "italic",
                color: "#E05B5B", cursor: "pointer",
              }}>
                {l.label}
              </span>
            )
          ))}
        </div>
      )}
    </>
  );
};

// ─── MAIN ───────────────────────────────────────────────────────────────────
export default function CamdenPortfolio() {
  const [activeSection, setActiveSection] = useState("about");
  const [heroReady, setHeroReady] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
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
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );

    setTimeout(() => {
      ["about", "realcopy", "experience", "process", "work", "contact"].forEach(id => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      });
    }, 200);

    return () => observer.disconnect();
  }, []);

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

  // TEMPORARY: Debug scroll trap — find elements with overflow hidden that could block scroll momentum
  useEffect(() => {
    const all = document.querySelectorAll("*");
    const problems = [];

    all.forEach((el) => {
      const style = window.getComputedStyle(el);
      const overflow = style.overflow;
      const overflowY = style.overflowY;
      const position = style.position;
      const height = style.height;

      if (
        (overflow === "hidden" || overflowY === "hidden") &&
        el.offsetHeight > 200 &&
        el.tagName !== "IMG" &&
        el.tagName !== "CANVAS"
      ) {
        problems.push({
          tag: el.tagName,
          class: el.className?.substring?.(0, 50),
          id: el.id,
          overflow,
          overflowY,
          height: el.offsetHeight,
          position,
        });
      }
    });

    console.log("=== SCROLL TRAP CANDIDATES ===");
    console.table(problems);
  }, []);

  return (
    <div style={{ background: C.bg, minHeight: "100vh", color: C.ink, width: "100%" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700&family=JetBrains+Mono:wght@400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-padding-top: 80px; width: 100%; }
        ::selection { background: rgba(150, 150, 150, 0.2); }
        .mobile-nav-toggle { display: none !important; }

        @media (max-width: 768px) {
          .nav-pill { left: 12px !important; right: 12px !important; transform: none !important; justify-content: space-between !important; }
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
          .hero-grid { grid-template-columns: 1fr !important; }
          .hero-image-col { order: -1 !important; justify-content: center !important; }
          .hero-headshot-inner { max-width: 280px !important; margin-left: auto !important; margin-right: auto !important; }
          .hero-text-col { text-align: center !important; align-items: center !important; }
          .hero-text-col .hero-buttons { justify-content: center !important; }
          .section-padding { padding-left: 24px !important; padding-right: 24px !important; }
          .hero-title { font-size: 48px !important; }
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
      `}</style>

      <Nav activeSection={activeSection} />

      {/* ═══ HERO ═══ */}
      <motion.section
        id="about"
        initial="hidden"
        animate={heroReady ? "visible" : "hidden"}
        variants={sectionVariants}
        style={{
          position: "relative",
          width: "100vw",
          minHeight: "100vh",
          overflow: "hidden",
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
                  fontFamily: FONT.display, fontSize: 80, fontWeight: 400,
                  lineHeight: 1.05, color: "#1A1814", marginBottom: 16, fontStyle: "italic",
                  letterSpacing: -1,
                }}
              >
                {SITE_DATA.name}
              </motion.h1>
              </Reveal>

              <Reveal delay={0.3}>
              <motion.p
                className="hero-tagline"
                variants={heroTaglineVariants}
                style={{
                  fontFamily: FONT.body, fontSize: 22, lineHeight: 1.5,
                  color: "rgba(74, 70, 64, 0.8)", maxWidth: 600, marginBottom: 36, fontWeight: 300,
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
                color: "rgba(80, 60, 50, 0.4)",
                marginBottom: 32,
              }}>
                AI Product Builder & Designer
              </div>
              </Reveal>

              <Reveal delay={0.5}>
              <motion.div variants={staggerItem} className="hero-buttons" style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center", justifyContent: "flex-start" }}>
                <GlassButton index={0} href="mailto:Blackburncamden@gmail.com">
                  Get in touch
                </GlassButton>
                <GlassButton index={1} animationDelay={0.15} onClick={() => document.getElementById("realcopy")?.scrollIntoView({ behavior: "smooth" })}>
                  View case study →
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
                  borderRadius: 20,
                  overflow: "hidden",
                  position: "relative",
                  border: headshotHovered ? "1px solid rgba(224, 91, 91, 0.2)" : "1px solid rgba(0, 0, 0, 0.06)",
                  boxShadow: headshotHovered
                    ? "0 20px 60px rgba(0, 0, 0, 0.15), 0 8px 24px rgba(0, 0, 0, 0.1)"
                    : "0 8px 32px rgba(0, 0, 0, 0.08)",
                  transform: headshotHovered
                    ? `perspective(800px) rotateX(${headshotTilt.x}deg) rotateY(${headshotTilt.y}deg) scale(1.02)`
                    : "perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)",
                  transition: "transform 0.3s cubic-bezier(0.03, 0.98, 0.52, 0.99), border-color 0.3s ease, box-shadow 0.3s ease",
                }}
              >
                <img
                  src="/headshot.png"
                  alt="Camden Blackburn"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                    filter: headshotHovered ? "grayscale(20%) contrast(1) brightness(1)" : "grayscale(100%) contrast(1.05) brightness(1.02)",
                    transition: "filter 0.6s ease",
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
                    borderRadius: 20,
                    transition: "opacity 0.6s ease",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: 20,
                    background: `radial-gradient(ellipse 60% 60% at ${headshotMouse.x}% ${headshotMouse.y}%, rgba(255,255,255,0.12) 0%, transparent 60%)`,
                    pointerEvents: "none",
                    opacity: headshotHovered ? 1 : 0,
                    transition: "opacity 0.3s ease",
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

      {/* ═══ REALCOPY CASE STUDY ═══ */}
      <motion.section
        id="realcopy"
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={viewport}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{
          background: "#141416", color: C.inkOnDark, padding: "100px 0", margin: 0,
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
            <motion.div
              variants={staggerItem}
              style={{
                fontFamily: FONT.mono, fontSize: 10, fontWeight: 500, letterSpacing: 3,
                textTransform: "uppercase", color: C.accent, marginBottom: 20,
                display: "flex", alignItems: "center", gap: 12,
              }}
            >
              <div style={{ width: 20, height: 1, background: C.accent }} />
              Featured Project
            </motion.div>
          </Reveal>

          <motion.div
            className="two-col"
            variants={staggerItem}
            style={{
              display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, marginBottom: 60,
            }}
          >
            <div>
              <Reveal delay={0.1}>
                <h2 style={{
                  fontFamily: FONT.display, fontSize: 52, fontWeight: 400,
                  fontStyle: "italic", lineHeight: 1.1, marginBottom: 12,
                }}>
                  {SITE_DATA.realcopy.name}
                </h2>
              </Reveal>
              <Reveal delay={0.15}>
                <div style={{
                  fontFamily: FONT.mono, fontSize: 11, letterSpacing: 1,
                  color: C.accent, marginBottom: 24,
                  display: "flex", alignItems: "center", gap: 8,
                }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.accent }} />
                  {SITE_DATA.realcopy.status}
                </div>
              </Reveal>
              <Reveal delay={0.2} glowText>
                <p style={{
                  fontFamily: FONT.body, fontSize: 16, lineHeight: 1.8,
                  color: C.inkOnDarkMuted, maxWidth: 500,
                }}>
                  {SITE_DATA.realcopy.description}
                </p>
              </Reveal>
            </div>

            <Reveal delay={0.1} direction="right">
            <div>
              <div style={{
                fontFamily: FONT.mono, fontSize: 10, letterSpacing: 2,
                textTransform: "uppercase", color: C.inkOnDarkFaint,
                marginBottom: 16,
              }}>
                Tech Stack
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {SITE_DATA.realcopy.stack.map(s => (
                  <motion.span
                    key={s}
                    style={{
                      fontFamily: FONT.mono, fontSize: 11, fontWeight: 500,
                      color: C.inkOnDarkMuted,
                      background: "rgba(150, 150, 150, 0.2)",
                      border: "1px solid rgba(150, 150, 150, 0.25)",
                      padding: "6px 14px", borderRadius: 2,
                    }}
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  >
                    {s}
                  </motion.span>
                ))}
              </div>
            </div>
            </Reveal>
          </motion.div>

          {/* Process timeline */}
          <motion.div
            variants={staggerItem}
            style={{
              fontFamily: FONT.mono, fontSize: 10, letterSpacing: 2,
              textTransform: "uppercase", color: C.inkOnDarkFaint,
              marginBottom: 32,
            }}
          >
            Development Process
          </motion.div>
          <motion.div
            variants={staggerItem}
            className="process-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "55% 45%",
              gap: 40,
              alignItems: "start",
            }}
          >
            {/* Left: timeline steps */}
            <div style={{ maxWidth: 600 }}>
              {SITE_DATA.realcopy.process.map((step, i) => (
                <Reveal key={i} delay={0.08 * i}>
                <div
                  onMouseEnter={() => setActiveStep(i)}
                  style={{
                    display: "flex",
                    gap: 24,
                    position: "relative",
                    marginBottom: i < SITE_DATA.realcopy.process.length - 1 ? 8 : 0,
                    padding: "16px 20px",
                    borderRadius: 8,
                    transition: "all 0.3s ease",
                    cursor: "default",
                    borderLeft: activeStep === i ? "2px solid #E05B5B" : "2px solid transparent",
                    background: activeStep === i ? "rgba(224, 91, 91, 0.05)" : "transparent",
                  }}
                >
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 20 }}>
                    <div style={{
                      width: 10, height: 10, borderRadius: "50%",
                      background: C.accent, border: `2px solid ${C.inkOnDark}`,
                      boxShadow: `0 0 0 2px ${C.accent}`, zIndex: 1,
                    }} />
                    {i < SITE_DATA.realcopy.process.length - 1 && (
                      <div style={{ width: 1, flex: 1, background: "rgba(224, 91, 91, 0.2)", marginTop: 4 }} />
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontFamily: FONT.mono, fontSize: 10, fontWeight: 600,
                      letterSpacing: 2, textTransform: "uppercase", color: C.accent,
                      marginBottom: 6,
                    }}>
                      {String(i + 1).padStart(2, "0")} — {step.phase}
                    </div>
                    <Reveal glowText delay={0.08 * i}>
                      <p style={{
                        fontFamily: FONT.body, fontSize: 14, lineHeight: 1.7,
                        color: C.inkOnDarkMuted, margin: 0,
                      }}>
                        {step.detail}
                      </p>
                    </Reveal>
                  </div>
                </div>
                </Reveal>
              ))}
            </div>

            {/* Right: detail panel */}
            <div
              className="process-detail-panel"
              style={{
                position: "sticky",
                top: 100,
                background: "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: 16,
                padding: 36,
                minHeight: 280,
              }}
            >
              {(() => {
                const item = SITE_DATA.realcopy.processDetails[activeStep];
                if (!item) return null;
                return (
                  <motion.div
                    key={activeStep}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                  >
                    <div style={{
                      fontFamily: FONT.display,
                      fontSize: 48,
                      fontWeight: 800,
                      color: "#E05B5B",
                      marginBottom: 4,
                    }}>
                      {typeof item.statValue === "number" ? (
                        <AnimatedNumber
                          value={item.statValue}
                          prefix={item.statPrefix || ""}
                          suffix={item.statSuffix || ""}
                        />
                      ) : (
                        item.stat
                      )}
                    </div>
                    <div style={{
                      fontFamily: FONT.mono,
                      fontSize: 12,
                      textTransform: "uppercase",
                      letterSpacing: 2,
                      color: "rgba(255, 255, 255, 0.4)",
                      marginBottom: 28,
                    }}>
                      {item.statLabel}
                    </div>
                    <div style={{
                      fontSize: 20,
                      fontWeight: 700,
                      color: "rgba(255, 255, 255, 0.9)",
                      marginBottom: 12,
                    }}>
                      {item.title}
                    </div>
                    <p style={{
                      fontSize: 14,
                      lineHeight: 1.7,
                      color: "rgba(255, 255, 255, 0.5)",
                      margin: 0,
                    }}>
                      {item.detail}
                    </p>
                  </motion.div>
                );
              })()}
            </div>
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
              Client & Agency Projects
            </motion.h2>
          </Reveal>
          {SITE_DATA.professionalWork.map((project, i) => (
            <Reveal key={project.client} delay={0.1 * i}>
              <motion.div
                variants={staggerItem}
                className="pro-work-card-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "65% 35%",
                  gap: 24,
                  alignItems: "center",
                  width: "100%",
                  background: "rgba(0, 0, 0, 0.02)",
                  border: "1px solid rgba(0, 0, 0, 0.05)",
                  borderRadius: 16,
                  padding: 32,
                  marginBottom: 16,
                  transition: "border-color 0.3s ease, box-shadow 0.3s ease",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = "rgba(224, 91, 91, 0.2)";
                  e.currentTarget.style.boxShadow = "0 4px 20px rgba(224, 91, 91, 0.06)";
                }}
                onMouseLeave={e => {
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
            </Reveal>
          ))}
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
          maxWidth: 1200, margin: "0 auto", padding: "100px 40px",
        }}
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

        <Divider spacing={80} />

        {/* Skills */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="two-col"
          style={{
            display: "grid", gridTemplateColumns: "200px 1fr", gap: 40,
          }}
        >
          <motion.div variants={staggerItem}>
            <SectionLabel>Capabilities</SectionLabel>
          </motion.div>
          <motion.div variants={staggerItem} style={{ maxWidth: "100%" }}>
            <SkillMarquee
              items={[
                ...SITE_DATA.skills.find(s => s.category === "Product")?.items ?? [],
                ...SITE_DATA.skills.find(s => s.category === "AI Tools")?.items ?? [],
              ]}
              speed={30}
              direction="left"
              label="Strategy & AI"
            />
            <SkillMarquee
              items={[
                ...SITE_DATA.skills.find(s => s.category === "Development")?.items ?? [],
                ...SITE_DATA.skills.find(s => s.category === "Design")?.items ?? [],
              ]}
              speed={38}
              direction="right"
              label="Build & Design"
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
            className="three-col"
            variants={staggerItem}
            style={{
              display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16,
            }}
          >
            {SITE_DATA.designWork.map((w, i) => (
              <Reveal key={i} delay={(i % 3) * 0.1 + Math.floor(i / 3) * 0.15}>
                <DesignCard title={w.title} description={w.description} index={i} />
              </Reveal>
            ))}
          </motion.div>

          <motion.div
            variants={staggerItem}
            style={{
              marginTop: 40, textAlign: "center",
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
                  I'm looking for roles in AI product design, AI UX, or product management at companies building with and for AI. Open to full-time opportunities starting {SITE_DATA.graduation}.
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
