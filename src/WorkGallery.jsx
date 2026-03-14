import { useState, useRef, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, useInView, AnimatePresence } from "framer-motion";
import logoImg from "./logo.png";

/*
 * WorkGallery — Filtered portfolio gallery page
 * 
 * Categories: Photography, Brand Identity, Print Design
 * Features: filter tabs, masonry layout, lightbox, scroll reveals
 *
 * SETUP:
 * 1. Add this file as src/WorkGallery.jsx
 * 2. Place your images in the public/work/ folder
 * 3. Update the WORK_ITEMS array below with your actual pieces
 * 4. See routing instructions at the bottom of this file
 */

// ─── FONTS & COLORS (match your App.jsx) ─────────────────────────────
const FONT = {
  display: "'Instrument Serif', Georgia, serif",
  body: "'DM Sans', -apple-system, sans-serif",
  mono: "'JetBrains Mono', monospace",
};

const C = {
  bg: "#F4F1EC",
  bgAlt: "#EBE7E0",
  surface: "#FFFFFF",
  ink: "#1A1814",
  inkSoft: "#4A4640",
  inkMuted: "#8A857D",
  inkFaint: "#B8B3AB",
  accent: "#E05B5B",
  accentDim: "rgba(224, 91, 91, 0.08)",
  rule: "rgba(26, 24, 20, 0.1)",
};

// ─── YOUR WORK — UPDATE THESE WITH YOUR ACTUAL PIECES ─────────────────
// Place images in public/work/ and reference as "/work/filename.jpg"
const WORK_ITEMS = [
  // ── PHOTOGRAPHY ──
  {
    id: 1,
    category: "photography",
    title: "Italy — Flickering Faith",
    description: "Shortlisted at the International Photography Awards. Shot during a family trip to Italy, December 2023.",
    image: "/work/photo-1.jpg",   // Replace with your actual file
    aspectRatio: "3/4",           // portrait
    featured: true,
  },
  {
    id: 2,
    category: "photography",
    title: "Architectural Study",
    description: "Exploring geometry and light in Italian architectural spaces.",
    image: "/work/photo-3.jpg",
    aspectRatio: "3/4",          // landscape
  },
  {
    id: 3,
    category: "photography",
    title: "Subject Negatives",
    description: "Applying negative space concepts to subjective candid photography.",
    image: "/work/photo-4.jpg",
    aspectRatio: "1/1",           // square
  },
  {
    id: 4,
    category: "photography",
    title: "Automotive Detail",
    description: "Proffesional stylistic dark photography of new cars with natural lighting.",
    image: "/work/photo-6.jpg",
    aspectRatio: "21/9",
  },
  {
    id: 5,
    category: "photography",
    title: "Architectural Composition",
    description: "Candid captures — finding composition in everyday motion.",
    image: "/work/photo-5.jpg",
    aspectRatio: "3/4",
  },
  {
    id: 6,
    category: "photography",
    title: "Golden Hour",
    description: "Natural light study — the last 20 minutes before sunset. Candid capture of a quiet evening in Tempe AZ.",
    image: "/work/photo-2.jpg",
    aspectRatio: "16/9",
  },

  // ── BRAND IDENTITY ──
  {
    id: 7,
    category: "brand",
    title: "RealCopy — Brand System",
    description: "Full brand identity for RealCopy including logo, color system, typography, and app icon design.",
    image: "/work/Realcopy.png",
    aspectRatio: "1/1",
    featured: true,
  },
  {
    id: 8,
    category: "brand",
    title: "Desert Writes — Logo",
    description: "Original branding for the marketing tool that became RealCopy. Wordmark + icon system.",
    image: "/work/brand-2.jpg",
    aspectRatio: "1/1",
  },
  {
    id: 9,
    category: "brand",
    title: "CB Monogram",
    description: "Personal brand mark. Continuous line form representing creativity as a connected process.",
    image: "/work/cblogo.png",
    aspectRatio: "1/1",
  },
  {
    id: 10,
    category: "brand",
    title: "Client Brand Package",
    description: "Complete visual identity system for a local business — logo, business cards, letterhead, signage.",
    image: "/work/azhype.jpg",
    aspectRatio: "4/3",
  },

  // ── PRINT DESIGN ──
  {
    id: 11,
    category: "print",
    title: "Food Magazine Cover",
    description: "Content driven design for a food magazine cover. Won second place in the 2024 Canon maglog competition.",
    image: "/work/photo-7.png",
    aspectRatio: "3/4",
    featured: true,
  },
  {
    id: 12,
    category: "print",
    title: "Marketing Collateral",
    description: "Wine label design and mockup for local winery in northern Arizona.",
    image: "/work/photo-8.png",
    aspectRatio: "4/3",
  },
  {
    id: 13,
    category: "print",
    title: "Editorial Layout",
    description: "Magazine-style layout exploring long-form content design and typographic systems.",
    image: "/work/print-3.jpg",
    aspectRatio: "3/4",
  },
  {
    id: 14,
    category: "print",
    title: "Packaging Concept",
    description: "Product packaging exploration — balancing shelf presence with brand identity.",
    image: "/work/print-4.jpg",
    aspectRatio: "1/1",
  },
];

const CATEGORIES = [
  { id: "all", label: "All Work" },
  { id: "photography", label: "Photography" },
  { id: "brand", label: "Brand Identity" },
  { id: "print", label: "Print Design" },
];

// ─── REVEAL WRAPPER ───────────────────────────────────────────────────
const Reveal = ({ children, delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
};

// ─── PLACEHOLDER IMAGE (shows before you add real images) ─────────────
const PlaceholderImage = ({ title, aspectRatio }) => (
  <div style={{
    width: "100%",
    aspectRatio,
    background: `linear-gradient(135deg, ${C.bgAlt} 0%, ${C.bg} 50%, ${C.bgAlt} 100%)`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
  }}>
    <div style={{
      textAlign: "center",
      padding: 20,
    }}>
      <div style={{
        fontFamily: FONT.mono,
        fontSize: 10,
        letterSpacing: 2,
        textTransform: "uppercase",
        color: C.inkFaint,
        marginBottom: 8,
      }}>
        Add image
      </div>
      <div style={{
        fontFamily: FONT.body,
        fontSize: 13,
        color: C.inkMuted,
      }}>
        {title}
      </div>
    </div>
  </div>
);

// ─── GALLERY ITEM ─────────────────────────────────────────────────────
const GalleryItem = ({ item, index, onOpen }) => {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Reveal delay={0.05 * (index % 6)}>
      <motion.div
        layoutId={`gallery-${item.id}`}
        onClick={() => onOpen(item)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          cursor: "pointer",
          borderRadius: 12,
          overflow: "hidden",
          position: "relative",
          breakInside: "avoid",
          marginBottom: 16,
        }}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Image or placeholder */}
        {imageError ? (
          <PlaceholderImage title={item.title} aspectRatio={item.aspectRatio} />
        ) : (
          <img
            src={item.image}
            alt={item.title}
            onError={() => setImageError(true)}
            style={{
              width: "100%",
              aspectRatio: item.aspectRatio,
              objectFit: "cover",
              display: "block",
              borderRadius: 12,
              transition: "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
              transform: isHovered ? "scale(1.03)" : "scale(1)",
            }}
          />
        )}

        {/* Hover overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.25 }}
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 12,
            background: "linear-gradient(to top, rgba(26, 24, 20, 0.8) 0%, rgba(26, 24, 20, 0.1) 50%, transparent 100%)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: 20,
          }}
        >
          {item.featured && (
            <div style={{
              position: "absolute",
              top: 16,
              left: 16,
              fontFamily: FONT.mono,
              fontSize: 9,
              fontWeight: 600,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: C.accent,
              background: "rgba(224, 91, 91, 0.15)",
              backdropFilter: "blur(8px)",
              padding: "4px 10px",
              borderRadius: 6,
              border: "1px solid rgba(224, 91, 91, 0.2)",
            }}>
              Featured
            </div>
          )}

          <h3 style={{
            fontFamily: FONT.display,
            fontSize: 20,
            fontWeight: 400,
            fontStyle: "italic",
            color: "#F4F1EC",
            margin: "0 0 4px",
          }}>
            {item.title}
          </h3>
          <p style={{
            fontFamily: FONT.mono,
            fontSize: 10,
            letterSpacing: 1.5,
            textTransform: "uppercase",
            color: "rgba(244, 241, 236, 0.5)",
            margin: 0,
          }}>
            {CATEGORIES.find(c => c.id === item.category)?.label}
          </p>
        </motion.div>
      </motion.div>
    </Reveal>
  );
};

// ─── LIGHTBOX ─────────────────────────────────────────────────────────
const Lightbox = ({ item, onClose }) => {
  const [imageError, setImageError] = useState(false);

  // Close on escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!item) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(10, 9, 8, 0.92)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 40,
        cursor: "pointer",
      }}
    >
      {/* Close button */}
      <div style={{
        position: "absolute",
        top: 24,
        right: 28,
        width: 40,
        height: 40,
        borderRadius: "50%",
        background: "rgba(255,255,255,0.08)",
        border: "1px solid rgba(255,255,255,0.1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        zIndex: 2,
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </div>

      <motion.div
        layoutId={`gallery-${item.id}`}
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: 900,
          width: "100%",
          display: "flex",
          gap: 40,
          alignItems: "center",
          cursor: "default",
        }}
        className="lightbox-inner"
      >
        {/* Image */}
        <div style={{ flex: "1 1 60%", maxHeight: "80vh" }}>
          {imageError ? (
            <PlaceholderImage title={item.title} aspectRatio={item.aspectRatio} />
          ) : (
            <motion.img
              src={item.image}
              alt={item.title}
              onError={() => setImageError(true)}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              style={{
                width: "100%",
                maxHeight: "80vh",
                objectFit: "contain",
                borderRadius: 12,
              }}
            />
          )}
        </div>

        {/* Info panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          style={{ flex: "1 1 35%", minWidth: 200 }}
        >
          <div style={{
            fontFamily: FONT.mono,
            fontSize: 10,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: C.accent,
            marginBottom: 12,
          }}>
            {CATEGORIES.find(c => c.id === item.category)?.label}
          </div>
          <h2 style={{
            fontFamily: FONT.display,
            fontSize: 32,
            fontWeight: 400,
            fontStyle: "italic",
            color: "#F4F1EC",
            margin: "0 0 16px",
            lineHeight: 1.2,
          }}>
            {item.title}
          </h2>
          <p style={{
            fontFamily: FONT.body,
            fontSize: 14,
            lineHeight: 1.7,
            color: "rgba(244, 241, 236, 0.6)",
            margin: 0,
          }}>
            {item.description}
          </p>

          {item.featured && (
            <div style={{
              marginTop: 20,
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontFamily: FONT.mono,
              fontSize: 10,
              letterSpacing: 1.5,
              textTransform: "uppercase",
              color: C.accent,
              background: "rgba(224, 91, 91, 0.1)",
              padding: "6px 14px",
              borderRadius: 6,
              border: "1px solid rgba(224, 91, 91, 0.15)",
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill={C.accent} stroke="none">
                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
              </svg>
              Featured Work
            </div>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

// ─── MAIN GALLERY PAGE ───────────────────────────────────────────────
export default function WorkGallery() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedItem, setSelectedItem] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => { setLoaded(true); }, []);

  const filtered = activeFilter === "all"
    ? WORK_ITEMS
    : WORK_ITEMS.filter(item => item.category === activeFilter);

  const counts = {
    all: WORK_ITEMS.length,
    photography: WORK_ITEMS.filter(i => i.category === "photography").length,
    brand: WORK_ITEMS.filter(i => i.category === "brand").length,
    print: WORK_ITEMS.filter(i => i.category === "print").length,
  };

  return (
    <div style={{
      background: C.bg,
      minHeight: "100vh",
      color: C.ink,
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700&family=JetBrains+Mono:wght@400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        ::selection { background: rgba(224, 91, 91, 0.2); }
        @media (max-width: 768px) {
          .masonry-grid { columns: 1 !important; }
          .lightbox-inner { flex-direction: column !important; }
          .gallery-header-grid { flex-direction: column !important; gap: 20px !important; }
          .filter-tabs { overflow-x: auto !important; flex-wrap: nowrap !important; }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          .masonry-grid { columns: 2 !important; }
        }
      `}</style>

      {/* ── Nav bar ── */}
      <nav style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: "rgba(244, 241, 236, 0.92)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: `1px solid ${C.rule}`,
      }}>
        <div style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 40px",
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
            <img src={logoImg} alt="Home" style={{ height: 32, width: "auto", display: "block" }} />
          </Link>
          <a href="/" style={{
            fontFamily: FONT.mono,
            fontSize: 11,
            letterSpacing: 1.5,
            textTransform: "uppercase",
            color: C.inkMuted,
            textDecoration: "none",
            transition: "color 0.2s",
          }}
            onMouseEnter={e => e.target.style.color = C.accent}
            onMouseLeave={e => e.target.style.color = C.inkMuted}
          >
            ← Back to portfolio
          </a>
        </div>
      </nav>

      {/* ── Header ── */}
      <header style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: "120px 40px 40px",
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={loaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div style={{
            fontFamily: FONT.mono,
            fontSize: 10,
            fontWeight: 500,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: C.accent,
            marginBottom: 16,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}>
            <div style={{ width: 20, height: 1, background: C.accent }} />
            Selected Work
          </div>

          <div className="gallery-header-grid" style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: 40,
          }}>
            <div>
              <h1 style={{
                fontFamily: FONT.display,
                fontSize: 56,
                fontWeight: 400,
                fontStyle: "italic",
                lineHeight: 1.1,
                color: C.ink,
                margin: "0 0 12px",
              }}>
                Design & Photography
              </h1>
              <p style={{
                fontFamily: FONT.body,
                fontSize: 16,
                color: C.inkMuted,
                maxWidth: 500,
                lineHeight: 1.6,
              }}>
                A curated selection of work across photography, brand identity, and print design — the visual foundation beneath everything I build.
              </p>
            </div>

            <div style={{
              fontFamily: FONT.mono,
              fontSize: 11,
              color: C.inkFaint,
              whiteSpace: "nowrap",
            }}>
              {WORK_ITEMS.length} pieces
            </div>
          </div>
        </motion.div>
      </header>

      {/* ── Filter tabs ── */}
      <div style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: "0 40px 40px",
        position: "sticky",
        top: 64,
        zIndex: 100,
      }}>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={loaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="filter-tabs"
          style={{
            display: "flex",
            gap: 6,
            padding: "12px 0",
            background: C.bg,
            borderBottom: `1px solid ${C.rule}`,
          }}
        >
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveFilter(cat.id)}
              style={{
                fontFamily: FONT.mono,
                fontSize: 11,
                fontWeight: activeFilter === cat.id ? 600 : 400,
                letterSpacing: 1,
                textTransform: "uppercase",
                color: activeFilter === cat.id ? C.accent : C.inkMuted,
                background: activeFilter === cat.id ? C.accentDim : "transparent",
                border: `1px solid ${activeFilter === cat.id ? "rgba(224, 91, 91, 0.2)" : "transparent"}`,
                borderRadius: 8,
                padding: "8px 16px",
                cursor: "pointer",
                transition: "all 0.25s ease",
                whiteSpace: "nowrap",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
              onMouseEnter={e => {
                if (activeFilter !== cat.id) {
                  e.target.style.color = C.inkSoft;
                  e.target.style.background = "rgba(0,0,0,0.02)";
                }
              }}
              onMouseLeave={e => {
                if (activeFilter !== cat.id) {
                  e.target.style.color = C.inkMuted;
                  e.target.style.background = "transparent";
                }
              }}
            >
              {cat.label}
              <span style={{
                fontSize: 9,
                fontWeight: 400,
                color: activeFilter === cat.id ? C.accent : C.inkFaint,
                opacity: 0.7,
              }}>
                {counts[cat.id]}
              </span>
            </button>
          ))}
        </motion.div>
      </div>

      {/* ── Masonry grid ── */}
      <div style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: "0 40px 80px",
      }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="masonry-grid"
            style={{
              columns: 3,
              columnGap: 16,
            }}
          >
            {filtered.map((item, i) => (
              <GalleryItem
                key={item.id}
                item={item}
                index={i}
                onOpen={setSelectedItem}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {filtered.length === 0 && (
          <div style={{
            textAlign: "center",
            padding: "80px 0",
            fontFamily: FONT.body,
            fontSize: 15,
            color: C.inkFaint,
          }}>
            No pieces in this category yet.
          </div>
        )}
      </div>

      {/* ── Footer ── */}
      <footer style={{
        borderTop: `1px solid ${C.rule}`,
        padding: "32px 40px",
        maxWidth: 1200,
        margin: "0 auto",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <span style={{
          fontFamily: FONT.mono,
          fontSize: 10,
          letterSpacing: 1.5,
          color: C.inkFaint,
          textTransform: "uppercase",
        }}>
          © 2026 Camden Blackburn
        </span>
        <span style={{
          fontFamily: FONT.display,
          fontSize: 16,
          fontStyle: "italic",
          color: C.inkFaint,
        }}>
          Built with AI, designed with intent.
        </span>
      </footer>

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {selectedItem && (
          <Lightbox item={selectedItem} onClose={() => setSelectedItem(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
