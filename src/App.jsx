import { useState, useEffect, useRef, useCallback } from "react";

// ─── CAMDEN BLACKBURN — PORTFOLIO ───────────────────────────────────────────
// Editorial + Architectural aesthetic. Warm concrete, sharp type, intentional space.

const SITE_DATA = {
  name: "Camden Blackburn",
  title: "AI Product Builder",
  tagline: "I design and build products from zero to one using AI as my core development tool.",
  email: "Blackburncamden@gmail.com",
  phone: "(206) 321-6087",
  location: "Phoenix, AZ",
  school: "Arizona State University — B.S. Graphic Information Technology",
  graduation: "Fall 2026",

  intro: `I'm a product builder, designer, and relentless experimenter at the intersection of AI and human-centered design. I've been using AI tools since their earliest public releases — not as a novelty, but as a fundamental part of how I think, create, and ship.

I built RealCopy, an AI-powered marketing platform for real estate agents, from concept to TestFlight beta with no traditional development background. I used prompt engineering, Gemini, Vertex AI, Supabase, and Cursor to bring it to life. When Google's lead designer for Gemini heard about my process, he reached out to meet with me — my perspective as a power user building real products with AI was valuable to his team.

I'm finishing my degree at ASU and looking for roles where I can do what I do best: identify problems, design solutions, and use AI to build them.`,

  realcopy: {
    name: "RealCopy",
    status: "Beta — TestFlight",
    tagline: "AI-powered copywriting and marketing for real estate agents",
    description: `Real estate agents spend hours writing listing descriptions, social media posts, and marketing copy. Most of it ends up generic. RealCopy solves this by combining property data, market context, and AI to generate professional marketing content in seconds.`,
    process: [
      { phase: "Problem", detail: "Identified that real estate agents waste 3-5 hours per listing on marketing content that rarely reflects the property's actual appeal." },
      { phase: "Research", detail: "Interviewed agents, analyzed competitors like Jasper and Copy.ai, found that none integrated real estate-specific data sources like MLS and property records." },
      { phase: "Design", detail: "Designed the UX in Figma with a focus on speed — agents need content between showings, not during a focused work session. Every flow is under 3 taps." },
      { phase: "Build", detail: "Used Cursor for AI-assisted development with Expo/React Native. Backend on Railway running Node.js. Supabase for auth and data. Integrated Gemini API, Vertex AI, Google Places, and Rentcast for property data enrichment." },
      { phase: "Ship", detail: "Deployed to TestFlight via EAS Build. Currently onboarding beta testers and iterating based on real user feedback." },
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
};

// ─── PALETTE ────────────────────────────────────────────────────────────────
const C = {
  bg: "#F4F1EC",         // warm parchment
  bgAlt: "#EBE7E0",      // slightly darker
  surface: "#FFFFFF",
  surfaceDim: "#F9F7F4",
  ink: "#1A1814",         // near-black warm
  inkSoft: "#4A4640",
  inkMuted: "#8A857D",
  inkFaint: "#B8B3AB",
  accent: "#C25E30",      // burnt sienna
  accentDim: "rgba(194, 94, 48, 0.08)",
  accentLight: "rgba(194, 94, 48, 0.15)",
  rule: "rgba(26, 24, 20, 0.1)",
  ruleStrong: "rgba(26, 24, 20, 0.2)",
};

// ─── FONTS (loaded via Google Fonts link) ───────────────────────────────────
const FONT = {
  display: "'Instrument Serif', Georgia, serif",
  body: "'DM Sans', -apple-system, sans-serif",
  mono: "'JetBrains Mono', monospace",
};

// ─── COMPONENTS ─────────────────────────────────────────────────────────────

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
  <div style={{
    padding: "28px 24px", background: C.surface,
    border: `1px solid ${C.rule}`, borderRadius: 2,
    transition: "all 0.3s ease",
    cursor: "default",
  }}
    onMouseEnter={e => {
      e.currentTarget.style.borderColor = C.accent;
      e.currentTarget.style.boxShadow = `0 4px 20px rgba(194, 94, 48, 0.06)`;
    }}
    onMouseLeave={e => {
      e.currentTarget.style.borderColor = C.rule;
      e.currentTarget.style.boxShadow = "none";
    }}
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
  </div>
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

// ─── NAV ────────────────────────────────────────────────────────────────────
const Nav = ({ activeSection }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const scrollTo = (id) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const links = [
    { id: "about", label: "About" },
    { id: "realcopy", label: "RealCopy" },
    { id: "process", label: "Process" },
    { id: "work", label: "Design Work" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        background: scrolled ? "rgba(244, 241, 236, 0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? `1px solid ${C.rule}` : "1px solid transparent",
        transition: "all 0.4s ease",
      }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto", padding: "0 40px",
          height: 64, display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{
              fontFamily: FONT.display, fontSize: 20, color: C.ink, fontStyle: "italic",
            }}>
              CB
            </span>
          </div>

          {/* Desktop nav */}
          <div style={{ display: "flex", gap: 32, alignItems: "center" }}
            className="desktop-nav">
            {links.map(l => (
              <span key={l.id} onClick={() => scrollTo(l.id)} style={{
                fontFamily: FONT.mono, fontSize: 11, letterSpacing: 1.5,
                textTransform: "uppercase", cursor: "pointer",
                color: activeSection === l.id ? C.accent : C.inkMuted,
                transition: "color 0.2s",
                borderBottom: activeSection === l.id ? `1px solid ${C.accent}` : "1px solid transparent",
                paddingBottom: 2,
              }}
                onMouseEnter={e => e.target.style.color = C.accent}
                onMouseLeave={e => { if (activeSection !== l.id) e.target.style.color = C.inkMuted; }}
              >
                {l.label}
              </span>
            ))}
          </div>

          {/* Mobile hamburger */}
          <div className="mobile-nav-toggle" onClick={() => setMenuOpen(!menuOpen)}
            style={{ cursor: "pointer", padding: 8, display: "none" }}>
            <div style={{ width: 20, height: 2, background: C.ink, marginBottom: 5, transition: "all 0.3s",
              transform: menuOpen ? "rotate(45deg) translate(2.5px, 2.5px)" : "none" }} />
            <div style={{ width: 20, height: 2, background: C.ink, transition: "all 0.3s",
              opacity: menuOpen ? 0 : 1 }} />
            <div style={{ width: 20, height: 2, background: C.ink, marginTop: 5, transition: "all 0.3s",
              transform: menuOpen ? "rotate(-45deg) translate(2.5px, -2.5px)" : "none" }} />
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          position: "fixed", top: 64, left: 0, right: 0, bottom: 0, zIndex: 999,
          background: "rgba(244, 241, 236, 0.97)", backdropFilter: "blur(20px)",
          display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", gap: 32,
        }}>
          {links.map(l => (
            <span key={l.id} onClick={() => scrollTo(l.id)} style={{
              fontFamily: FONT.display, fontSize: 32, fontStyle: "italic",
              color: C.ink, cursor: "pointer",
            }}>
              {l.label}
            </span>
          ))}
        </div>
      )}
    </>
  );
};

// ─── MAIN ───────────────────────────────────────────────────────────────────
export default function CamdenPortfolio() {
  const [activeSection, setActiveSection] = useState("about");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => setLoaded(true), 100);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );

    setTimeout(() => {
      ["about", "realcopy", "process", "work", "contact"].forEach(id => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      });
    }, 200);

    return () => observer.disconnect();
  }, []);

  return (
    <div style={{ background: C.bg, minHeight: "100vh", color: C.ink }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700&family=JetBrains+Mono:wght@400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; scroll-padding-top: 80px; }
        ::selection { background: rgba(194, 94, 48, 0.2); }

        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-nav-toggle { display: block !important; }
          .hero-grid { grid-template-columns: 1fr !important; }
          .two-col { grid-template-columns: 1fr !important; }
          .three-col { grid-template-columns: 1fr !important; }
          .skill-grid { grid-template-columns: 1fr 1fr !important; }
          .section-padding { padding-left: 24px !important; padding-right: 24px !important; }
          .hero-title { font-size: 48px !important; }
          .hero-tagline { font-size: 18px !important; }
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
      `}</style>

      <Nav activeSection={activeSection} />

      {/* ═══ HERO ═══ */}
      <section id="about" style={{
        maxWidth: 1200, margin: "0 auto", padding: "160px 40px 80px",
        opacity: loaded ? 1 : 0, transition: "opacity 0.8s ease",
      }} className="section-padding">

        <div style={{
          animation: loaded ? "fadeUp 0.8s ease forwards" : "none",
        }}>
          <div style={{
            fontFamily: FONT.mono, fontSize: 11, letterSpacing: 3,
            textTransform: "uppercase", color: C.inkFaint, marginBottom: 24,
            display: "flex", alignItems: "center", gap: 12,
          }}>
            <div style={{
              width: 0, height: 1, background: C.inkFaint,
              animation: loaded ? "lineGrow 0.6s ease 0.4s forwards" : "none",
            }} />
            <span style={{
              opacity: 0, animation: loaded ? "fadeIn 0.5s ease 0.6s forwards" : "none",
            }}>
              {SITE_DATA.location} / {SITE_DATA.school.split("—")[0].trim()}
            </span>
          </div>

          <h1 className="hero-title" style={{
            fontFamily: FONT.display, fontSize: 72, fontWeight: 400,
            lineHeight: 1.05, color: C.ink, marginBottom: 20, fontStyle: "italic",
            maxWidth: 800, letterSpacing: -1,
          }}>
            {SITE_DATA.name}
          </h1>

          <p className="hero-tagline" style={{
            fontFamily: FONT.body, fontSize: 22, lineHeight: 1.5,
            color: C.inkSoft, maxWidth: 640, marginBottom: 40, fontWeight: 300,
          }}>
            {SITE_DATA.tagline}
          </p>

          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
            <a href={`mailto:${SITE_DATA.email}`} style={{
              fontFamily: FONT.mono, fontSize: 12, letterSpacing: 1,
              textTransform: "uppercase", color: C.surface,
              background: C.ink, padding: "14px 28px", borderRadius: 2,
              textDecoration: "none", transition: "all 0.3s",
              border: `1px solid ${C.ink}`,
            }}
              onMouseEnter={e => {
                e.target.style.background = C.accent;
                e.target.style.borderColor = C.accent;
              }}
              onMouseLeave={e => {
                e.target.style.background = C.ink;
                e.target.style.borderColor = C.ink;
              }}
            >
              Get in touch
            </a>
            <span onClick={() => document.getElementById("realcopy")?.scrollIntoView({ behavior: "smooth" })}
              style={{
                fontFamily: FONT.mono, fontSize: 12, letterSpacing: 1,
                textTransform: "uppercase", color: C.ink,
                padding: "14px 28px", borderRadius: 2, cursor: "pointer",
                border: `1px solid ${C.ruleStrong}`, transition: "all 0.3s",
              }}
              onMouseEnter={e => e.target.style.borderColor = C.accent}
              onMouseLeave={e => e.target.style.borderColor = C.ruleStrong}
            >
              View case study →
            </span>
          </div>
        </div>

        <Divider spacing={80} />

        {/* Intro text */}
        <div className="two-col" style={{
          display: "grid", gridTemplateColumns: "200px 1fr", gap: 40,
        }}>
          <SectionLabel>About</SectionLabel>
          <div>
            {SITE_DATA.intro.split("\n\n").map((p, i) => (
              <p key={i} style={{
                fontFamily: FONT.body, fontSize: 16, lineHeight: 1.8,
                color: C.inkSoft, marginBottom: 20, maxWidth: 680,
              }}>
                {p}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ REALCOPY CASE STUDY ═══ */}
      <section id="realcopy" style={{
        background: C.ink, color: C.bg, padding: "100px 0",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 40px" }} className="section-padding">
          <div style={{
            fontFamily: FONT.mono, fontSize: 10, fontWeight: 500, letterSpacing: 3,
            textTransform: "uppercase", color: C.accent, marginBottom: 20,
            display: "flex", alignItems: "center", gap: 12,
          }}>
            <div style={{ width: 20, height: 1, background: C.accent }} />
            Featured Project
          </div>

          <div className="two-col" style={{
            display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, marginBottom: 60,
          }}>
            <div>
              <h2 style={{
                fontFamily: FONT.display, fontSize: 52, fontWeight: 400,
                fontStyle: "italic", lineHeight: 1.1, marginBottom: 12,
              }}>
                {SITE_DATA.realcopy.name}
              </h2>
              <div style={{
                fontFamily: FONT.mono, fontSize: 11, letterSpacing: 1,
                color: C.accent, marginBottom: 24,
                display: "flex", alignItems: "center", gap: 8,
              }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.accent }} />
                {SITE_DATA.realcopy.status}
              </div>
              <p style={{
                fontFamily: FONT.body, fontSize: 16, lineHeight: 1.8,
                color: "rgba(244, 241, 236, 0.7)", maxWidth: 500,
              }}>
                {SITE_DATA.realcopy.description}
              </p>
            </div>

            <div>
              <div style={{
                fontFamily: FONT.mono, fontSize: 10, letterSpacing: 2,
                textTransform: "uppercase", color: "rgba(244, 241, 236, 0.4)",
                marginBottom: 16,
              }}>
                Tech Stack
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {SITE_DATA.realcopy.stack.map(s => (
                  <span key={s} style={{
                    fontFamily: FONT.mono, fontSize: 11, fontWeight: 500,
                    color: "rgba(244, 241, 236, 0.8)",
                    background: "rgba(244, 241, 236, 0.06)",
                    border: "1px solid rgba(244, 241, 236, 0.1)",
                    padding: "6px 14px", borderRadius: 2,
                  }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Process timeline */}
          <div style={{
            fontFamily: FONT.mono, fontSize: 10, letterSpacing: 2,
            textTransform: "uppercase", color: "rgba(244, 241, 236, 0.4)",
            marginBottom: 32,
          }}>
            Development Process
          </div>
          <div style={{ maxWidth: 600 }}>
            {SITE_DATA.realcopy.process.map((step, i) => (
              <div key={i} style={{
                display: "flex", gap: 24, position: "relative",
                paddingBottom: i < SITE_DATA.realcopy.process.length - 1 ? 32 : 0,
              }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 20 }}>
                  <div style={{
                    width: 10, height: 10, borderRadius: "50%",
                    background: C.accent, border: `2px solid ${C.ink}`,
                    boxShadow: `0 0 0 2px ${C.accent}`, zIndex: 1,
                  }} />
                  {i < SITE_DATA.realcopy.process.length - 1 && (
                    <div style={{ width: 1, flex: 1, background: "rgba(194, 94, 48, 0.2)", marginTop: 4 }} />
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
                  <p style={{
                    fontFamily: FONT.body, fontSize: 14, lineHeight: 1.7,
                    color: "rgba(244, 241, 236, 0.6)", margin: 0,
                  }}>
                    {step.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ AI PROCESS ═══ */}
      <section id="process" style={{
        maxWidth: 1200, margin: "0 auto", padding: "100px 40px",
      }} className="section-padding">
        <div className="two-col" style={{
          display: "grid", gridTemplateColumns: "200px 1fr", gap: 40,
        }}>
          <SectionLabel>{SITE_DATA.aiPhilosophy.title}</SectionLabel>
          <div>
            {SITE_DATA.aiPhilosophy.paragraphs.map((p, i) => (
              <p key={i} style={{
                fontFamily: FONT.body, fontSize: 16, lineHeight: 1.8,
                color: C.inkSoft, marginBottom: 24, maxWidth: 680,
              }}>
                {p}
              </p>
            ))}
          </div>
        </div>

        <Divider spacing={80} />

        {/* Skills */}
        <div className="two-col" style={{
          display: "grid", gridTemplateColumns: "200px 1fr", gap: 40,
        }}>
          <SectionLabel>Capabilities</SectionLabel>
          <div className="skill-grid" style={{
            display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 40,
          }}>
            {SITE_DATA.skills.map(s => (
              <SkillCluster key={s.category} category={s.category} items={s.items} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══ DESIGN WORK ═══ */}
      <section id="work" style={{
        background: C.bgAlt, padding: "100px 0",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 40px" }} className="section-padding">
          <SectionLabel>Design Work</SectionLabel>
          <h2 style={{
            fontFamily: FONT.display, fontSize: 42, fontWeight: 400,
            fontStyle: "italic", lineHeight: 1.15, marginBottom: 12,
            maxWidth: 500,
          }}>
            The design foundation
          </h2>
          <p style={{
            fontFamily: FONT.body, fontSize: 15, lineHeight: 1.6,
            color: C.inkMuted, marginBottom: 48, maxWidth: 500,
          }}>
            Selected work from my Graphic Information Technology program at ASU, freelance projects, and personal explorations.
          </p>

          <div className="three-col" style={{
            display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16,
          }}>
            {SITE_DATA.designWork.map((w, i) => (
              <DesignCard key={i} title={w.title} description={w.description} index={i} />
            ))}
          </div>

          <div style={{
            marginTop: 40, textAlign: "center",
          }}>
            <a href="https://www.blackburncreativestudio.com/professional-pieces"
              target="_blank" rel="noopener noreferrer"
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
            </a>
          </div>
        </div>
      </section>

      {/* ═══ CONTACT ═══ */}
      <section id="contact" style={{
        maxWidth: 1200, margin: "0 auto", padding: "100px 40px 120px",
      }} className="section-padding">
        <div className="two-col" style={{
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "start",
        }}>
          <div>
            <SectionLabel>Get in touch</SectionLabel>
            <h2 style={{
              fontFamily: FONT.display, fontSize: 42, fontWeight: 400,
              fontStyle: "italic", lineHeight: 1.15, marginBottom: 20,
            }}>
              Let's build something.
            </h2>
            <p style={{
              fontFamily: FONT.body, fontSize: 16, lineHeight: 1.7,
              color: C.inkSoft, maxWidth: 440,
            }}>
              I'm looking for roles in AI product design, AI UX, or product management at companies building with and for AI. Open to full-time opportunities starting {SITE_DATA.graduation}.
            </p>
          </div>

          <div style={{ paddingTop: 48 }}>
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
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer style={{
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
      </footer>
    </div>
  );
}
