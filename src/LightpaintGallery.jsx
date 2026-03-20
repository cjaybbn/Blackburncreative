import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import SiteNav from "./Nav.jsx";

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
    image: "/work/lightpaint/photo5.TIF",
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

const Lightbox = ({ item, glowColor, onClose, canHover }) => {
  const [imageError, setImageError] = useState(false);
  const [tilt, setTilt] = useState({ x: 0.5, y: 0.5, hovered: false });

  const imageRef = useRef(null);
  const tiltPendingRef = useRef(null);
  const rafIdRef = useRef(null);
  const isHoverCapableRef = useRef(canHover);

  useEffect(() => {
    isHoverCapableRef.current = canHover;
  }, [canHover]);

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

  const handleImageMouseMove = useCallback((e) => {
    if (!isHoverCapableRef.current) return;
    if (rafIdRef.current != null) return;
    const el = imageRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));

    tiltPendingRef.current = { x, y, hovered: true };
    rafIdRef.current = requestAnimationFrame(() => {
      rafIdRef.current = null;
      if (tiltPendingRef.current) setTilt(tiltPendingRef.current);
    });
  }, []);

  const handleImageMouseLeave = useCallback(() => {
    if (rafIdRef.current != null) cancelAnimationFrame(rafIdRef.current);
    rafIdRef.current = null;
    tiltPendingRef.current = null;
    setTilt({ x: 0.5, y: 0.5, hovered: false });
  }, []);

  const tiltX = (tilt.y - 0.5) * -10;
  const tiltY = (tilt.x - 0.5) * 10;

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
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 22,
        overflowY: "auto",
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
          gap: 18,
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
            background: "rgba(255,255,255,0.08)",
            border: `1px solid ${C.ruleStrong}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            zIndex: 2,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="2" strokeLinecap="round">
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
          {/* Ambient glow (stronger, always visible) */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: -92,
              borderRadius: 20,
              background: `radial-gradient(ellipse at center, ${resolvedGlowColor} 0%, transparent 70%)`,
              filter: "blur(90px)",
              opacity: 0.2,
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              position: "relative",
              borderRadius: 4,
              overflow: "visible",
              width: "100%",
              maxWidth: 860,
            }}
          >
            <div style={{ perspective: "1200px", position: "relative" }}>
              <div
                ref={imageRef}
                onMouseMove={handleImageMouseMove}
                onMouseLeave={handleImageMouseLeave}
                style={{
                  position: "relative",
                  borderRadius: 4,
                  overflow: "hidden",
                  cursor: canHover ? "default" : "pointer",
                }}
              >
                {imageError ? (
                  <div
                    style={{
                      width: "100%",
                      aspectRatio: item.aspectRatio,
                      background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 50%, rgba(255,255,255,0.06) 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "rgba(255,255,255,0.6)",
                      fontFamily: FONT.mono,
                      fontSize: 12,
                      padding: 24,
                    }}
                  >
                    Missing image: {item.title}
                  </div>
                ) : (
                  <motion.img
                    src={item.image}
                    alt={item.title}
                    onError={() => setImageError(true)}
                    initial={{ opacity: 0, scale: 0.985 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.35, delay: 0.05 }}
                    style={{
                      width: "100%",
                      maxHeight: "76vh",
                      objectFit: "contain",
                      display: "block",
                      borderRadius: 4,
                      position: "relative",
                      zIndex: 1,
                      transformStyle: "preserve-3d",
                      transform:
                        canHover && tilt.hovered
                          ? `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.02)`
                          : "perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)",
                      transition: canHover ? "transform 0.1s ease-out" : "none",
                    }}
                  />
                )}

                {/* Sheen on tilt */}
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    inset: 0,
                  borderRadius: 4,
                    pointerEvents: "none",
                    zIndex: 2,
                    background:
                      canHover && tilt.hovered
                        ? `radial-gradient(ellipse at ${Math.round(tilt.x * 100)}% ${Math.round(
                            tilt.y * 100
                          )}%, rgba(255,255,255,0.12) 0%, transparent 55%), linear-gradient(${120 + tiltY * 4 + tiltX * 4}deg, transparent 34%, rgba(255,255,255,0.05) 50%, transparent 72%)`
                        : "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 55%)",
                    transition: "background 0.2s ease-out",
                  }}
                />

              </div>
            </div>
          </div>
        </div>

        <div style={{ textAlign: "center", maxWidth: 720, paddingBottom: 22 }}>
          <div
            style={{
              fontFamily: FONT.mono,
              fontSize: 10,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.25)",
              marginBottom: 10,
            }}
          >
            LIGHTPAINTING
          </div>
          <h2
            style={{
              fontFamily: FONT.display,
              fontSize: 34,
              fontWeight: 400,
              fontStyle: "italic",
              color: "rgba(255,255,255,0.85)",
              marginBottom: 10,
              lineHeight: 1.15,
            }}
          >
            {item.title}
          </h2>
          <p
            style={{
              fontFamily: FONT.body,
              fontSize: 14,
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
            background: item.glowColor,
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

  const headerMaxWidth = 600;
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
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700&family=JetBrains+Mono:wght@400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        ::selection { background: rgba(255,255,255,0.12); }

        @keyframes cornerTap {
          0% { transform: scale(1) translate(0px, 0px); }
          4% { transform: scale(1.15) translate(-2px, -2px); }
          8% { transform: scale(1) translate(0px, 0px); }
          12% { transform: scale(1.15) translate(-2px, -2px); }
          16% { transform: scale(1) translate(0px, 0px); }
          20% { transform: scale(1.12) translate(-1.5px, -1.5px); }
          24% { transform: scale(1) translate(0px, 0px); }
          100% { transform: scale(1) translate(0px, 0px); }
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

      <SiteNav mode="page" pageLabel="Lightpainting" darkBackground={true} />

      <main style={{ position: "relative", zIndex: 1 }}>
        {/* Header */}
        <section style={{ maxWidth: gridMaxWidth, margin: "0 auto", padding: "120px 20px 60px" }}>
          <div
            style={{
              maxWidth: headerMaxWidth,
              margin: "0 auto",
              textAlign: "center",
            }}
          >
            <div style={{ fontFamily: FONT.mono, fontSize: 10, letterSpacing: 4, color: "rgba(255,255,255,0.25)", textTransform: "uppercase" }}>
              LIGHTPAINTING
            </div>
            <h1 style={{ fontFamily: FONT.display, fontSize: 42, fontWeight: 400, fontStyle: "italic", color: "rgba(255,255,255,0.85)", marginTop: 14, marginBottom: 12 }}>
              Automotive Light Studies
            </h1>
            <p
              style={{
                fontFamily: FONT.body,
                fontSize: 14,
                lineHeight: 1.7,
                color: "rgba(255,255,255,0.35)",
                margin: 0,
              }}
            >
              Long exposure lightpainting on automotive subjects. Each image is a single continuous exposure with handheld light sources.
            </p>
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
            canHover={canHover}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

