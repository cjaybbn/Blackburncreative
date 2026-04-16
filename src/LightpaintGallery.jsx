import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useScroll, useTransform } from "framer-motion";
import SiteNav from "./Nav.jsx";
import SeoHead from "./SeoHead.jsx";
import { SEO } from "./seoConstants.js";

// Ensure eslint counts `motion` as used (it is referenced in JSX).
void motion;

// ─── FONTS & COLORS (match App.jsx tokens) ────────────────────────────────
const FONT = {
  display: "'DM Serif Display', Georgia, serif",
  body: "'DM Sans', -apple-system, sans-serif",
  mono: "'JetBrains Mono', monospace",
};

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

// ─── LIGHTPAINT PHOTOS ───────────────────────────────────────────────────
// Place images in `public/work/lightpaint` and reference them as `/work/lightpaint/<filename>`.
const LIGHTPAINT_PHOTOS = [
  {
    id: 1,
    image: "/work/lightpaint/photo1.png",
    title: "Blue Trace",
    description: "Long exposure lightpainting on automotive subjects—one continuous handheld exposure.",
    glowColor: "rgba(0, 150, 255, 0.4)",
    aspectRatio: "3/2",
  },
  {
    id: 2,
    image: "/work/lightpaint/photo2.png",
    title: "Red Line",
    description: "Controlled red glow that threads through the silhouette for a clean, cinematic tail-light feel.",
    glowColor: "rgba(255, 60, 30, 0.4)",
    aspectRatio: "16/9",
  },
  {
    id: 3,
    image: "/work/lightpaint/photo3.png",
    title: "Warm Orange Sweep",
    description: "Handheld orange strokes that bloom into reflections across body panels.",
    glowColor: "rgba(255, 150, 0, 0.4)",
    aspectRatio: "4/3",
  },
  {
    id: 4,
    image: "/work/lightpaint/photo4.JPG",
    title: "Cyan Engine Notes",
    description: "Cool cyan trails shaped around curves to emphasize form over noise.",
    glowColor: "rgba(0, 220, 255, 0.4)",
    aspectRatio: "3/4",
  },
  {
    id: 5,
    image: "/work/lightpaint/photo5.jpg",
    title: "Violet Motion",
    description: "Violet light ribbons that feel like motion captured in a single breath.",
    glowColor: "rgba(165, 90, 255, 0.4)",
    aspectRatio: "21/9",
  },
  {
    id: 6,
    image: "/work/lightpaint/photo6.PNG",
    title: "Green Pulse",
    description: "A subtle green pulse that brightens the dark space without overpowering the car.",
    glowColor: "rgba(0, 220, 120, 0.4)",
    aspectRatio: "1/1",
  },
  {
    id: 7,
    image: "/work/lightpaint/photo7.jpg",
    title: "Electric Blue Fade",
    description: "A deeper blue glow with softer falloff, tuned for ambient bloom in the shadows.",
    glowColor: "rgba(0, 120, 255, 0.4)",
    aspectRatio: "16/9",
  },
];

const DARK_PAGE_BG = "#050507";

const Reveal = ({ children, delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 22 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
};

const Lightbox = ({ item, glowColor, onClose }) => {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  useEffect(() => {
    // Prevent background scroll while the lightbox is open.
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  if (!item) return null;

  const resolvedGlowColor = glowColor ?? item.glowColor;

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(0, 0, 0, 0.95)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 980,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
        }}
      >
        {/* Close button */}
        <div
          role="button"
          tabIndex={0}
          aria-label="Close lightbox"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          onKeyDown={(e) => e.key === "Enter" && onClose()}
          style={{
            position: "fixed",
            top: 18,
            right: 18,
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.06)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2,
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="rgba(255,255,255,0.8)"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </div>

        <div
          style={{
            position: "relative",
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          {/* Photo-specific ambient glow */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              width: "80%",
              height: "80%",
              top: "10%",
              left: "10%",
              background: `radial-gradient(ellipse at center, ${resolvedGlowColor} 0%, transparent 70%)`,
              filter: "blur(60px)",
              opacity: 0.35,
              zIndex: -1,
              pointerEvents: "none",
            }}
          />

          {imageError ? (
            <LightpaintPlaceholderImage title={item.title} aspectRatio={item.aspectRatio} />
          ) : (
            <motion.img
              src={item.image}
              alt={item.title}
              onError={() => setImageError(true)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              style={{
                maxWidth: "90vw",
                maxHeight: "85vh",
                objectFit: "contain",
                borderRadius: 4,
                display: "block",
              }}
            />
          )}
        </div>

        {/* Title + description */}
        <div style={{ textAlign: "center", maxWidth: 720, paddingBottom: 22 }}>
          <h2
            style={{
              fontFamily: FONT.display,
              fontSize: 24,
              fontWeight: 400,
              fontStyle: "italic",
              color: "rgba(255,255,255,0.85)",
              marginBottom: 10,
            }}
          >
            {item.title}
          </h2>
          <p
            style={{
              fontFamily: FONT.body,
              fontSize: 13,
              lineHeight: 1.7,
              color: "rgba(255,255,255,0.35)",
              margin: 0,
            }}
          >
            {item.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const LightpaintPlaceholderImage = ({ title, aspectRatio }) => (
  <div
    style={{
      width: "100%",
      aspectRatio,
      background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 50%, rgba(255,255,255,0.06) 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "rgba(255,255,255,0.65)",
      fontFamily: FONT.mono,
      fontSize: 12,
      padding: 18,
      textAlign: "center",
    }}
  >
    {title}
  </div>
);

const LightpaintCard = ({ item, index, onOpen, canHover }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <Reveal delay={0.05 * index}>
      <motion.div
        className="lightpaint-item"
        layout
        onClick={() => onOpen(item)}
        tabIndex={0}
        role="button"
        aria-label={`Open lightbox: ${item.title}`}
        onKeyDown={(e) => e.key === "Enter" && onOpen(item)}
        style={{
          borderRadius: 8,
          overflow: "hidden",
          position: "relative",
          cursor: "pointer",
          breakInside: "avoid",
          marginBottom: 28,
        }}
      >
        <div
          className="lightpaint-glow"
          style={{
            position: "absolute",
            inset: -20,
            borderRadius: 16,
            background: `radial-gradient(ellipse at center, ${item.glowColor} 0%, transparent 60%)`,
            filter: "blur(40px)",
            opacity: imageError ? 0 : undefined,
            transition: "opacity 0.5s ease",
            zIndex: 0,
            pointerEvents: "none",
          }}
        />
        {imageError ? (
          <div style={{ position: "relative", zIndex: 1 }}>
            <LightpaintPlaceholderImage title={item.title} aspectRatio={item.aspectRatio} />
          </div>
        ) : (
          <img
            className="lightpaint-img"
            src={item.image}
            alt={item.title}
            onError={() => setImageError(true)}
            style={{
              width: "100%",
              aspectRatio: item.aspectRatio,
              objectFit: "cover",
              display: "block",
              position: "relative",
              zIndex: 1,
            }}
          />
        )}

        {/* tiny preload hint for touch devices */}
        {!canHover && (
          <span
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              background: "linear-gradient(to top, rgba(0,0,0,0.35), transparent 55%)",
              opacity: 0,
            }}
          />
        )}
      </motion.div>
    </Reveal>
  );
};

export default function LightpaintGallery() {
  const [selected, setSelected] = useState(null);
  const [canHover, setCanHover] = useState(true);
  const heroRef = useRef(null);
  const [enableParallax, setEnableParallax] = useState(false);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start end", "end start"],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

  useEffect(() => {
    const mq = window.matchMedia?.("(min-width: 769px)");
    if (!mq) return;
    const update = () => setEnableParallax(mq.matches);
    update();
    if (typeof mq.addEventListener === "function") {
      mq.addEventListener("change", update);
      return () => mq.removeEventListener("change", update);
    }
    // Safari fallback
    if (typeof mq.addListener === "function") {
      mq.addListener(update);
      return () => mq.removeListener(update);
    }
  }, []);

  useEffect(() => {
    const mq = window.matchMedia?.("(hover: hover) and (pointer: fine)");
    if (!mq) return;

    const update = () => setCanHover(mq.matches);
    update();

    // Safari fallback
    if (typeof mq.addEventListener === "function") {
      mq.addEventListener("change", update);
      return () => mq.removeEventListener("change", update);
    }

    if (typeof mq.addListener === "function") {
      mq.addListener(update);
      return () => mq.removeListener(update);
    }
  }, []);

  const gridMaxWidth = 1100;
  const lightpaintPhotos = useMemo(() => LIGHTPAINT_PHOTOS, []);

  return (
    <div
      style={{
        background: DARK_PAGE_BG,
        minHeight: "100vh",
        color: "rgba(255,255,255,0.9)",
        width: "100%",
        overflowX: "clip",
      }}
    >
      <SeoHead
        title={SEO.lightpainting.title}
        description={SEO.lightpainting.description}
        path={SEO.lightpainting.path}
      />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700&family=JetBrains+Mono:wght@400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        ::selection { background: rgba(255,255,255,0.12); }

        /* ─── Cinematic header reveal ─────────────────────────────────── */
        @keyframes lightReveal {
          0% { opacity: 0; filter: brightness(0) contrast(1.5); }
          15% { opacity: 0.3; filter: brightness(0.2) contrast(2); }
          40% { opacity: 0.7; filter: brightness(0.5) contrast(1.5); }
          70% { opacity: 0.9; filter: brightness(0.85) contrast(1.15); }
          100% { opacity: 1; filter: brightness(1) contrast(1); }
        }

        @keyframes redPulse {
          0% { opacity: 0; transform: scale(0.8); }
          20% { opacity: 0.8; transform: scale(1.1); }
          50% { opacity: 0.5; transform: scale(1); }
          100% { opacity: 0.15; transform: scale(1); }
        }

        @keyframes titleFadeIn {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 768px) {
          .lightpaint-hero { height: 50vh !important; }
        }

        .lightpaint-img {
          filter: brightness(0.7) saturate(0.6);
          transition: filter 0.5s ease, transform 0.5s ease;
          transform: scale(1);
        }

        .lightpaint-glow {
          opacity: 0;
          transition: opacity 0.5s ease;
        }

        .lightpaint-item:hover .lightpaint-img {
          filter: brightness(1.1) saturate(1.4) contrast(1.05);
          transform: scale(1.03);
        }

        .lightpaint-item:hover .lightpaint-glow {
          opacity: 0.3;
        }

        .lightpaint-item:active .lightpaint-img {
          filter: brightness(1.1) saturate(1.4) contrast(1.05);
          transform: scale(1.03);
        }

        .lightpaint-item:active .lightpaint-glow {
          opacity: 0.3;
        }

        @media (max-width: 768px) {
          .lightpaint-masonry { columns: 1 !important; }
          .lightpaint-item { margin-bottom: 28px; }
        }

        @media (hover: none) {
          .lightpaint-item .lightpaint-img {
            filter: brightness(1.1) saturate(1.4) contrast(1.05);
            transform: scale(1.03);
          }
          .lightpaint-item .lightpaint-glow {
            opacity: 0.3;
          }
        }
      `}</style>

      {/* Ambient whisper glow at top */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          top: -200,
          left: "50%",
          transform: "translateX(-50%)",
          width: 600,
          height: 400,
          background: "radial-gradient(ellipse, rgba(255,255,255,0.02) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <SiteNav />

      <main style={{ position: "relative", zIndex: 1, margin: 0, padding: 0 }}>
        {/* Cinematic hero header — image flush to viewport top (no inset gap) */}
        <section
          ref={heroRef}
          className="lightpaint-hero"
          style={{
            position: "relative",
            width: "100%",
            height: "70vh",
            background: "#050507",
            overflow: "hidden",
            margin: 0,
            padding: 0,
          }}
        >
          <motion.img
            src="/work/lightpaint/header.jpg"
            alt="Lightpainting gear"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: enableParallax ? "112%" : "100%",
              minHeight: "100%",
              objectFit: "cover",
              objectPosition: "center center",
              animation: "lightReveal 3s cubic-bezier(0.22, 1, 0.36, 1) forwards",
              y: enableParallax ? parallaxY : 0,
              zIndex: 0,
            }}
          />

          {/* Red glow pulse (light wand powering on) */}
          <div
            style={{
              position: "absolute",
              top: "20%",
              left: "25%",
              width: "40%",
              height: "30%",
              background: "radial-gradient(ellipse at center, rgba(255, 40, 20, 0.25) 0%, transparent 70%)",
              filter: "blur(40px)",
              animation: "redPulse 3s ease-out forwards",
              pointerEvents: "none",
              zIndex: 1,
            }}
          />

          {/* Bottom gradient — sits below title in stacking order so type stays pure white */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "40%",
              background: "linear-gradient(to bottom, transparent 0%, #050507 100%)",
              pointerEvents: "none",
              zIndex: 2,
            }}
          />

          {/* Title overlay — above gradient */}
          <div
            style={{
              position: "absolute",
              bottom: "15%",
              left: 0,
              right: 0,
              textAlign: "center",
              animation: "titleFadeIn 1.5s ease-out 1.8s both",
              padding: "0 20px",
              zIndex: 3,
            }}
          >
            <div
              style={{
                fontFamily: FONT.mono,
                fontSize: 10,
                letterSpacing: 4,
                textTransform: "uppercase",
                color: "#ffffff",
                marginBottom: 12,
                opacity: 0.85,
              }}
            >
              LIGHTPAINTING
            </div>
            <h1
              style={{
                fontFamily: FONT.display,
                fontSize: 48,
                fontWeight: 400,
                fontStyle: "italic",
                color: "#ffffff",
                margin: 0,
                textShadow: "0 1px 24px rgba(0,0,0,0.35)",
              }}
            >
              Automotive Light Studies
            </h1>
          </div>
        </section>

        {/* Gallery grid */}
        <div
          style={{
            maxWidth: gridMaxWidth,
            margin: "0 auto",
            padding: "0 20px 90px",
          }}
        >
          <div
            className="lightpaint-masonry"
            style={{
              columns: 2,
              columnGap: 28,
            }}
          >
            {lightpaintPhotos.map((item, index) => (
              <LightpaintCard key={item.id} item={item} index={index} onOpen={setSelected} canHover={canHover} />
            ))}
          </div>
        </div>
      </main>

      <AnimatePresence>
        {selected && (
          <Lightbox
            key={selected.id}
            item={selected}
            glowColor={selected.glowColor}
            onClose={() => setSelected(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

