import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, useInView, AnimatePresence } from "framer-motion";
import logoImg from "./logo.png";
import SiteNav from "./Nav.jsx";
import SeoHead from "./SeoHead.jsx";
import { SEO } from "./seoConstants.js";

/*
 * WorkGallery — Filtered portfolio gallery page
 * 
 * Categories: Photography, Brand Identity, Print Design
 * Features: filter tabs, masonry layout, lightbox, scroll reveals
 *
 * SETUP:
 * 1. Add this file as src/WorkGallery.jsx
 * 2. Place images under public/work/ (Branding, Photography, BTS, lightpaint) and reference as "/work/…"
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

// SVG feTurbulence noise for paper texture (data URL)
const PAPER_NOISE =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

function workGalleryIsVideoSrc(src) {
  return typeof src === "string" && /\.(mp4|webm|mov)$/i.test(src.trim());
}

/** Auto-advance interval for multi-image gallery tiles and matching lightbox. */
const WORK_GALLERY_CAROUSEL_MS = 4200;

/** Masonry: space between columns and between stacked tiles (irregular grid, not edge-to-edge). */
const WORK_GALLERY_MASONRY_GAP = 16;

/** Image URLs for a work row: prefers `item.images` when set, else single `item.image`. Videos omitted. */
function workGalleryImageSlides(item) {
  if (Array.isArray(item?.images) && item.images.length > 0) {
    return item.images.filter((s) => typeof s === "string" && s.trim() && !workGalleryIsVideoSrc(s));
  }
  if (typeof item?.image === "string" && item.image.trim() && !workGalleryIsVideoSrc(item.image)) {
    return [item.image];
  }
  return [];
}

function workGalleryBasenameLabel(src) {
  const base = typeof src === "string" ? src.replace(/^.*\//, "").replace(/\.[^.]+$/, "") : "";
  return base.replace(/_/g, " ") || "Slide";
}

/** `[w,h]` from `item.aspectRatio` string (e.g. `"3/4"`). Lightbox frame uses this so `contain` fills the box without random gutters. */
function workGalleryAspectRatioTuple(item) {
  const raw = item?.aspectRatio;
  if (typeof raw === "string" && raw.includes("/")) {
    const parts = raw.split("/").map((s) => Number(String(s).trim()));
    if (parts.length === 2 && parts.every((n) => Number.isFinite(n) && n > 0)) return parts;
  }
  return [4, 3];
}

/** Masonry tile: stacked fades + dots; pauses auto-advance while hovered. */
function WorkGalleryCarouselTile({ slides, aspectRatio, isHovered, onSlideIndexChange }) {
  const [idx, setIdx] = useState(0);
  const slideKey = slides.join("|");

  useEffect(() => {
    setIdx(0);
  }, [slideKey]);

  useEffect(() => {
    onSlideIndexChange(idx);
  }, [idx, onSlideIndexChange]);

  useEffect(() => {
    if (slides.length <= 1) return undefined;
    if (isHovered) return undefined;
    const id = window.setInterval(() => {
      setIdx((i) => (i + 1) % slides.length);
    }, WORK_GALLERY_CAROUSEL_MS);
    return () => window.clearInterval(id);
  }, [slides.length, isHovered, slideKey]);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        aspectRatio,
        borderRadius: 0,
        overflow: "hidden",
        background: C.ink,
      }}
    >
      {slides.map((src, i) => (
        <img
          key={src}
          src={src}
          alt={workGalleryBasenameLabel(src)}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            opacity: i === idx ? 1 : 0,
            transition: "opacity 0.55s ease",
            pointerEvents: "none",
            display: "block",
          }}
        />
      ))}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: 10,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          gap: 5,
          zIndex: 2,
          pointerEvents: "none",
        }}
      >
        {slides.map((_, i) => (
          <span
            key={i}
            style={{
              width: i === idx ? 14 : 5,
              height: 5,
              borderRadius: 3,
              background: i === idx ? C.accent : "rgba(255,255,255,0.45)",
              boxShadow: "0 0 0 1px rgba(0,0,0,0.12)",
              transition: "width 0.25s ease, background 0.25s ease",
            }}
          />
        ))}
      </div>
    </div>
  );
}

/** Lightbox: large carousel with dots (click to jump) + auto-advance. */
function WorkGalleryLightboxCarousel({ slides, startIndex, onActiveNaturalSize }) {
  const [idx, setIdx] = useState(startIndex);
  const slideKey = slides.join("|");
  const activeRef = useRef(null);

  const reportActive = useCallback(
    (el) => {
      if (!el || !onActiveNaturalSize) return;
      const nw = el.naturalWidth;
      const nh = el.naturalHeight;
      if (nw > 0 && nh > 0) onActiveNaturalSize(nw, nh);
    },
    [onActiveNaturalSize],
  );

  useEffect(() => {
    setIdx(Math.min(startIndex, Math.max(0, slides.length - 1)));
  }, [startIndex, slideKey, slides.length]);

  useEffect(() => {
    if (slides.length <= 1) return undefined;
    const id = window.setInterval(() => {
      setIdx((i) => (i + 1) % slides.length);
    }, WORK_GALLERY_CAROUSEL_MS);
    return () => window.clearInterval(id);
  }, [slides.length, slideKey]);

  useEffect(() => {
    const el = activeRef.current;
    if (el?.complete && el.naturalWidth > 0) reportActive(el);
  }, [idx, slideKey, reportActive]);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        overflow: "hidden",
        background: C.ink,
      }}
    >
      <div style={{ position: "absolute", inset: 0 }}>
        {slides.map((src, i) => (
          <motion.img
            key={src}
            src={src}
            alt={workGalleryBasenameLabel(src)}
            ref={i === idx ? activeRef : undefined}
            onLoad={(e) => {
              if (i === idx) reportActive(e.currentTarget);
            }}
            initial={false}
            animate={{
              opacity: i === idx ? 1 : 0,
            }}
            transition={{ duration: 0.45 }}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "contain",
              objectPosition: "center",
              display: "block",
              pointerEvents: "none",
              zIndex: i === idx ? 2 : 1,
            }}
          />
        ))}
      </div>
      <div
        role="tablist"
        aria-label="Image slides"
        style={{
          position: "absolute",
          bottom: 12,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          gap: 8,
          flexWrap: "wrap",
          zIndex: 4,
        }}
      >
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={i === idx}
            onClick={(e) => {
              e.stopPropagation();
              setIdx(i);
            }}
            style={{
              width: i === idx ? 22 : 8,
              height: 8,
              borderRadius: 4,
              border: "none",
              cursor: "pointer",
              background: i === idx ? C.accent : "rgba(255,255,255,0.35)",
              transition: "width 0.2s ease, background 0.2s ease",
            }}
          />
        ))}
      </div>
    </div>
  );
}

/** Optional: paste the live Sun Devil Sitdown site here. `VITE_SUN_DEVIL_SITDOWN_URL` in `.env` overrides this when set. */
const SUN_DEVIL_SITDOWN_URL_FALLBACK = "https://asugit402podcast.wordpress.com/";

const SUN_DEVIL_SITDOWN_PROJECT_URL = (() => {
  const fromEnv =
    typeof import.meta !== "undefined" && import.meta.env?.VITE_SUN_DEVIL_SITDOWN_URL;
  if (typeof fromEnv === "string" && fromEnv.trim()) return fromEnv.trim();
  return typeof SUN_DEVIL_SITDOWN_URL_FALLBACK === "string"
    ? SUN_DEVIL_SITDOWN_URL_FALLBACK.trim()
    : "";
})();

// ─── YOUR WORK — UPDATE THESE WITH YOUR ACTUAL PIECES ─────────────────
// Paths use public/work/Photography, work/Branding, work/BTS — see folders on disk.
const WORK_ITEMS = [
  // ── PHOTOGRAPHY ──
  {
    id: 1,
    category: "photography",
    title: "IPA Italy Church",
    description: "Photography · IPA Italy Church · JPG.",
    image: "/work/Photography/IPA_ITALY_CHURCH.jpg",
    aspectRatio: "3/4",           // portrait
    featured: true,
  },
  {
    id: 2,
    category: "photography",
    title: "Architecture Italy Basilica",
    description: "Photography · Architecture Italy Basilica · JPG.",
    image: "/work/Photography/ARCHITECTURE_ITALY_BASILICA.jpg",
    aspectRatio: "3/4",
  },
  {
    id: 3,
    category: "photography",
    title: "Candid Architecture Figure",
    description: "Photography · Candid Architecture Figure · JPG.",
    image: "/work/Photography/CANDID_ARCHITECTURE_FIGURE.jpg",
    aspectRatio: "1/1",           // square
  },
  {
    id: 4,
    category: "photography",
    title: "Car ZL1 Landscape",
    description: "Photography · Car ZL1 Landscape · JPG.",
    image: "/work/Photography/CAR_ZL1_LANDSCAPE.jpg",
    aspectRatio: "21/9",
  },
  {
    id: 5,
    category: "photography",
    title: "Italy Beach Candid",
    description: "Photography · Italy Beach Candid · JPG.",
    image: "/work/Photography/ITALY_BEACH_CANDID.jpg",
    aspectRatio: "3/4",
  },
  {
    id: 6,
    category: "photography",
    title: "Tempe Glowing Sunset Candid",
    description: "Photography · Tempe Glowing Sunset Candid · JPG.",
    image: "/work/Photography/TEMPE_GLOWING_SUNSET_CANDID.jpg",
    aspectRatio: "16/9",
  },

  // ── BRAND IDENTITY ──
  {
    id: 7,
    category: "brand",
    title: "RealCopy",
    description: "Branding · RealCopy · PNG. Cycles RealCopy logo and RealCopy website files.",
    images: [
      "/work/Branding/REALCOPY_LOGO.png",
      "/work/Branding/REALCOPY_WEBSITE.png",
    ],
    image: "/work/Branding/REALCOPY_LOGO.png",
    aspectRatio: "1/1",
    featured: true,
  },
  {
    id: 9,
    category: "brand",
    title: "Personal Logo",
    description: "Branding · Personal Logo · PNG.",
    image: "/work/Branding/PERSONAL_LOGO.png",
    aspectRatio: "1/1",
  },
  {
    id: 10,
    category: "brand",
    title: "AZHype Brand Guidelines",
    description: "Branding · AZHype Brand Guidelines · JPG.",
    image: "/work/Branding/AZHYPE_BRAND_GUIDLINES.jpg",
    aspectRatio: "4/3",
  },
  {
    id: 19,
    category: "brand",
    title: "Sun Devil Sitdown Logo",
    description:
      "Branding · Sun Devil Sitdown Logo · PNG. WordPress site for the ASU GIT student podcast (Sun Devil Sit Down).",
    image: "/work/Branding/SUNDEVILSITDOWN_LOGO.png",
    aspectRatio: "1/1",
    ...(SUN_DEVIL_SITDOWN_PROJECT_URL ? { projectUrl: SUN_DEVIL_SITDOWN_PROJECT_URL } : {}),
  },
  {
    id: 17,
    category: "brand",
    title: "Alara",
    description: "BTS · Alara · PNG. Cycles Alara BTS and Alara video BTS files.",
    images: ["/work/BTS/Alara_BTS.png", "/work/BTS/ALARA_VIDEO_BTS.png"],
    image: "/work/BTS/Alara_BTS.png",
    aspectRatio: "1/1",
  },
  {
    id: 18,
    category: "brand",
    title: "SLP",
    description: "Branding / BTS · SLP · PNG. Cycles SLP mockup, logo, and BTS files.",
    images: [
      "/work/Branding/SLP_MOCKUP.png",
      "/work/Branding/SLP_LOGO.png",
      "/work/BTS/SLP_BTS.png",
    ],
    image: "/work/Branding/SLP_MOCKUP.png",
    aspectRatio: "1/1",
  },

  // ── PRINT DESIGN ──
  {
    id: 11,
    category: "print",
    title: "Onepot Magazine Cover",
    description: "Branding · Onepot Magazine Cover · PNG.",
    image: "/work/Branding/ONEPOT_MAGAZINE_COVER.png",
    aspectRatio: "3/4",
    featured: true,
  },
  {
    id: 12,
    category: "print",
    title: "Wine Label Cre8tive",
    description: "Branding · Wine Label Cre8tive · PNG.",
    image: "/work/Branding/WINE_LABEL_CRE8TIVE.png",
    aspectRatio: "4/3",
  },
  {
    id: 13,
    category: "print",
    title: "Magazine Mockup",
    description: "Branding · Magazine Mockup · PNG.",
    image: "/work/Branding/MAGAZINE_MOCKUP.png",
    aspectRatio: "3/4",
  },
  {
    id: 14,
    category: "print",
    title: "Mashupposter Mockup",
    description: "Branding · Mashupposter Mockup · PNG.",
    image: "/work/Branding/MASHUPPOSTER_MOCKUP.png",
    aspectRatio: "1/1",
  },
  // ── CASE STUDIES ──
  {
    id: 15,
    category: "caseStudies",
    title: "TEDX Cover",
    description: "Branding · TEDX Cover · PNG. Case study opens in the Behance embed.",
    image: "/work/Branding/TEDX_COVER.png",
    aspectRatio: "4/3",
    featured: true,
    isCaseStudy: true,
    embedUrl: "https://www.behance.net/embed/project/245479745?ilo0=1",
  },
  {
    id: 22,
    category: "caseStudies",
    title: "Projo",
    description:
      "Case Studies · Projo · Behance embed. Cover image not wired in the gallery yet.",
    aspectRatio: "4/3",
    isCaseStudy: true,
    embedUrl: "https://www.behance.net/embed/project/223615507?ilo0=1",
  },
  {
    id: 16,
    category: "brand",
    title: "Homecore Animation Hypothetical Business",
    description: "Branding · Homecore Animation Hypothetical Business · MP4.",
    image: "/work/Branding/HOMECORE_ANIMATION_HYPOTHETICAL_BUSINESS.mp4",
    aspectRatio: "16/9",
  },
  {
    id: 20,
    category: "brand",
    title: "TPS Animation Delivery",
    description: "Branding · TPS Animation Delivery · MP4.",
    image: "/work/Branding/TPS_ANIMATION_DELIVERY.mp4",
    aspectRatio: "16/9",
  },
  {
    id: 21,
    category: "brand",
    title: "TEDX Animation Delivery",
    description: "Branding · TEDX Animation Delivery · MP4.",
    image: "/work/Branding/TEDX_ANIMATION_DELIVERY.mp4",
    aspectRatio: "16/9",
  },
];

const CATEGORIES = [
  { id: "photography", label: "Photography" },
  { id: "brand", label: "Brand Identity" },
  { id: "print", label: "Print Design" },
  { id: "caseStudies", label: "Case Studies" },
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
    borderRadius: 0,
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
  const slideIdxRef = useRef(0);
  const slides = useMemo(
    () => workGalleryImageSlides(item),
    [item.id, item.image, item.images],
  );
  const useCarousel = slides.length > 1;
  const bumpSlide = useCallback((i) => {
    slideIdxRef.current = i;
  }, []);

  return (
    <Reveal delay={0.05 * (index % 6)}>
      <motion.div
        className="gallery-masonry-item"
        onClick={() => onOpen(item, slideIdxRef.current)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          cursor: "pointer",
          borderRadius: 0,
          overflow: "hidden",
          position: "relative",
          breakInside: "avoid",
          marginBottom: WORK_GALLERY_MASONRY_GAP,
        }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Image or placeholder */}
        {item.isCaseStudy && !item.image ? (
          <div
            style={{
              width: "100%",
              aspectRatio: item.aspectRatio,
              borderRadius: 0,
              border: "none",
              background:
                "linear-gradient(140deg, rgba(26,24,20,0.06) 0%, rgba(224,91,91,0.10) 52%, rgba(26,24,20,0.08) 100%)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: 20,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                fontFamily: FONT.mono,
                fontSize: 9,
                letterSpacing: 2,
                textTransform: "uppercase",
                color: "rgba(26, 24, 20, 0.65)",
              }}
            >
              Case Study Preview
            </div>
            <div
              style={{
                borderRadius: 0,
                border: "none",
                background: "rgba(255, 255, 255, 0.75)",
                padding: "16px 14px",
                boxShadow: "none",
              }}
            >
              <div
                style={{
                  fontFamily: FONT.display,
                  fontStyle: "italic",
                  fontSize: 20,
                  color: C.ink,
                  marginBottom: 6,
                }}
              >
                {item.title}
              </div>
              <div
                style={{
                  fontFamily: FONT.body,
                  fontSize: 12,
                  lineHeight: 1.55,
                  color: C.inkMuted,
                }}
              >
                {item.description}
              </div>
            </div>
            <div
              style={{
                fontFamily: FONT.mono,
                fontSize: 10,
                letterSpacing: 1.5,
                textTransform: "uppercase",
                color: C.accent,
              }}
            >
              Click to open →
            </div>
          </div>
        ) : imageError ? (
          <PlaceholderImage title={item.title} aspectRatio={item.aspectRatio} />
        ) : useCarousel ? (
          <WorkGalleryCarouselTile
            slides={slides}
            aspectRatio={item.aspectRatio}
            isHovered={isHovered}
            onSlideIndexChange={bumpSlide}
          />
        ) : workGalleryIsVideoSrc(item.image) ? (
          <div
            style={{
              width: "100%",
              aspectRatio: item.aspectRatio,
              borderRadius: 0,
              background: C.ink,
              overflow: "hidden",
            }}
          >
            <video
              src={item.image}
              muted
              playsInline
              loop
              autoPlay
              aria-label={item.title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
                display: "block",
              }}
            />
          </div>
        ) : (
          <div
            style={{
              width: "100%",
              aspectRatio: item.aspectRatio,
              borderRadius: 0,
              background: C.ink,
              overflow: "hidden",
            }}
          >
            <img
              src={item.image}
              alt={item.title}
              onError={() => setImageError(true)}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
                display: "block",
              }}
            />
          </div>
        )}

        {/* Hover overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.25 }}
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 0,
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
const Lightbox = ({ item, onClose, carouselStartIndex = 0 }) => {
  const [imageError, setImageError] = useState(false);
  const [tilt, setTilt] = useState({ x: 0.5, y: 0.5, hovered: false });
  const [isFlipped, setIsFlipped] = useState(false);
  const imageRef = useRef(null);
  const tiltPendingRef = useRef(null);
  const rafIdRef = useRef(null);
  const isFlippedRef = useRef(false);
  /** Pixel aspect from loaded media; tightens frame so `contain` does not sit in a wrongly tall box. */
  const [lbNatural, setLbNatural] = useState(null);

  useEffect(() => {
    isFlippedRef.current = isFlipped;
  }, [isFlipped]);

  // Close on escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Reset flip + measured size when opening a different item
  useEffect(() => {
    setIsFlipped(false);
    setLbNatural(null);
  }, [item?.id]);

  // Tilt only when NOT flipped; throttle to once per frame to avoid stutter
  const handleImageMouseMove = useCallback((e) => {
    if (isFlippedRef.current || !imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    tiltPendingRef.current = { x, y, hovered: true };
    if (rafIdRef.current != null) return;
    rafIdRef.current = requestAnimationFrame(() => {
      rafIdRef.current = null;
      if (tiltPendingRef.current && !isFlippedRef.current) setTilt(tiltPendingRef.current);
    });
  }, []);

  const handleImageMouseLeave = useCallback(() => {
    rafIdRef.current && cancelAnimationFrame(rafIdRef.current);
    rafIdRef.current = null;
    tiltPendingRef.current = null;
    setTilt({ x: 0.5, y: 0.5, hovered: false });
  }, []);

  const tiltX = (tilt.y - 0.5) * -10;
  const tiltY = (tilt.x - 0.5) * 10;

  const reportLbNatural = useCallback((w, h) => {
    if (typeof w === "number" && typeof h === "number" && w > 0 && h > 0) {
      setLbNatural([w, h]);
    }
  }, []);

  if (!item) return null;

  const isPhotography = item.category === "photography";
  const lbSlides = workGalleryImageSlides(item);
  const lbMulti = lbSlides.length > 1;
  const [arW, arH] = lbNatural ?? workGalleryAspectRatioTuple(item);
  const lbHCap = "min(85vh, 900px)";
  const lbMediaFrameStyle = {
    width: `min(100%, calc(${lbHCap} * ${arW} / ${arH}))`,
    aspectRatio: `${arW} / ${arH}`,
    maxHeight: lbHCap,
    background: C.ink,
    position: "relative",
    overflow: "hidden",
    margin: "0 auto",
    boxSizing: "border-box",
  };

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
        padding: "24px",
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
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: "min(1600px, calc(100vw - 48px))",
          width: "100%",
          display: "flex",
          gap: 24,
          alignItems: "center",
          cursor: "default",
        }}
        className="lightbox-inner"
      >
        {item.isCaseStudy ? (
        <div
          style={{
            flex: "1 1 62%",
            minWidth: 0,
            alignSelf: "stretch",
            position: "relative",
            overflow: "hidden",
            minHeight: "min(540px, 70vh)",
            maxHeight: "85vh",
          }}
        >
            <div
              style={{
                width: "100%",
                height: "100%",
                minHeight: "min(540px, 70vh)",
                display: "flex",
                flexDirection: "column",
                borderRadius: 0,
                overflow: "hidden",
                border: "none",
                background: "#111",
              }}
            >
              <iframe
                src={item.embedUrl}
                title={item.title}
                width="100%"
                allowFullScreen
                loading="lazy"
                frameBorder="0"
                allow="clipboard-write"
                referrerPolicy="strict-origin-when-cross-origin"
                style={{
                  display: "block",
                  width: "100%",
                  flex: "1 1 auto",
                  minHeight: "min(65vh, 720px)",
                  border: "none",
                  background: "#fff",
                }}
              />
            </div>
        </div>
        ) : (
          <div
            className="lightbox-media-col"
            style={{
              flex: "1 1 62%",
              minWidth: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              alignSelf: "center",
            }}
          >
            <div className="lightbox-media-frame" style={lbMediaFrameStyle}>
              {imageError ? (
            <PlaceholderImage title={item.title} aspectRatio={item.aspectRatio} />
              ) : isPhotography ? (
            <div style={{ perspective: "1200px", width: "100%", height: "100%", position: "relative" }}>
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                style={{
                  position: "relative",
                  width: "100%",
                  height: "100%",
                  cursor: "pointer",
                  transformStyle: "preserve-3d",
                  transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                  transition: "transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
                  boxShadow: isFlipped ? "0 2px 12px rgba(0,0,0,0.25)" : "none",
                }}
              >
                {/* FRONT: wrapper (ref + handlers, no transform) so hit area is stable; tilt on inner div only */}
                <div
                  ref={imageRef}
                  onMouseMove={handleImageMouseMove}
                  onMouseLeave={handleImageMouseLeave}
                  style={{
                    position: "relative",
                    height: "100%",
                    backfaceVisibility: "hidden",
                    borderRadius: 0,
                    overflow: "hidden",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      height: "100%",
                      overflow: "hidden",
                      borderRadius: 0,
                      background: C.ink,
                      transformStyle: "preserve-3d",
                      transform: !isFlipped && tilt.hovered
                        ? `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.02)`
                        : "perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)",
                      transition: "transform 0.1s ease-out",
                      boxShadow: !isFlipped && tilt.hovered
                        ? `${(tilt.x - 0.5) * -15}px ${(tilt.y - 0.5) * -15}px 30px rgba(0,0,0,0.3), 0 5px 15px rgba(0,0,0,0.2)`
                        : "0 5px 15px rgba(0,0,0,0.2)",
                    }}
                  >
                    <motion.img
                      src={item.image}
                      alt={item.title}
                      onLoad={(e) => {
                        const { naturalWidth: nw, naturalHeight: nh } = e.currentTarget;
                        reportLbNatural(nw, nh);
                      }}
                      onError={() => setImageError(true)}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: 0.1 }}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        objectPosition: "center",
                        borderRadius: 0,
                        display: "block",
                      }}
                    />
                    {/* Fingerprint smudge — suggests someone handled the photo */}
                    <div
                      style={{
                        position: "absolute",
                        bottom: 30,
                        right: 40,
                        width: 20,
                        height: 25,
                        background: "radial-gradient(ellipse, rgba(255,255,255,0.06) 0%, transparent 100%)",
                        transform: "rotate(20deg)",
                        opacity: 0.5,
                        pointerEvents: "none",
                      }}
                    />
                    {/* Sheen on tilt (only when front and hovered) */}
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        borderRadius: 0,
                        background: tilt.hovered && !isFlipped
                          ? `linear-gradient(${120 + tiltY * 4 + tiltX * 4}deg, transparent 30%, rgba(255, 255, 255, 0.08) 45%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.08) 55%, transparent 70%)`
                          : !isFlipped
                            ? "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 50%, rgba(255,255,255,0.03) 100%)"
                            : "transparent",
                        transition: "background 0.2s ease-out",
                      }}
                    />
                  </div>
                </div>

                {/* BACK: aged photo back */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backfaceVisibility: "hidden",
                    borderRadius: 0,
                    overflow: "hidden",
                    transform: "rotateY(180deg)",
                    background: "#F2EDE4",
                  }}
                >
                  {/* Layer 1 — yellowing edges */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      pointerEvents: "none",
                      background: "radial-gradient(ellipse at center, transparent 50%, rgba(180, 160, 120, 0.15) 100%)",
                    }}
                  />
                  {/* Layer 2 — noise/grain */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      pointerEvents: "none",
                      backgroundImage: PAPER_NOISE,
                      opacity: 0.08,
                      mixBlendMode: "multiply",
                    }}
                  />
                  {/* Layer 3 — stains/age marks */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      pointerEvents: "none",
                      background: `
                        radial-gradient(circle at 75% 25%, rgba(160, 140, 100, 0.12) 0%, transparent 8%),
                        radial-gradient(circle at 20% 70%, rgba(170, 150, 110, 0.08) 0%, transparent 12%),
                        radial-gradient(circle at 60% 80%, rgba(150, 135, 100, 0.06) 0%, transparent 6%)
                      `,
                    }}
                  />
                  {/* Layer 4 — crease line */}
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      right: 0,
                      top: "40%",
                      height: 1,
                      background: "rgba(160, 140, 110, 0.1)",
                      transform: "rotate(-0.5deg)",
                      pointerEvents: "none",
                    }}
                  />
                  {/* Handwritten text */}
                  <div
                    style={{
                      position: "absolute",
                      top: "38%",
                      left: "15%",
                      right: "15%",
                      fontFamily: "'Caveat', cursive",
                      fontSize: 22,
                      color: "rgba(60, 50, 40, 0.6)",
                      lineHeight: 1.8,
                      transform: "rotate(-2deg)",
                    }}
                  >
                    <div style={{ transform: "rotate(-1.5deg)" }}>
                      "{item.title}"
                    </div>
                    <div style={{ transform: "rotate(-2.2deg)", marginLeft: 4 }}>
                      {item.backNote || item.description?.slice(0, 60) + (item.description?.length > 60 ? "…" : "")}
                    </div>
                    <div style={{ transform: "rotate(-1deg)", marginTop: 4 }}>
                      Dec. 2023
                    </div>
                  </div>
                  {/* Smudge near text */}
                  <div
                    style={{
                      position: "absolute",
                      top: "52%",
                      left: "18%",
                      width: 80,
                      height: 50,
                      background: "radial-gradient(ellipse 40px 25px at center, rgba(60, 50, 40, 0.04) 0%, transparent 100%)",
                      transform: "rotate(15deg)",
                      pointerEvents: "none",
                    }}
                  />
                  {/* Photo lab stamp */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: 24,
                      right: 24,
                      fontFamily: "'Courier New', monospace",
                      fontSize: 9,
                      letterSpacing: 1,
                      textTransform: "uppercase",
                      color: "rgba(100, 90, 70, 0.2)",
                      transform: "rotate(-90deg)",
                      transformOrigin: "bottom right",
                      whiteSpace: "nowrap",
                    }}
                  >
                    PRINT NO. 001
                  </div>
                  {/* Click to flip back hint */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: 16,
                      left: "50%",
                      transform: "translateX(-50%)",
                      fontFamily: FONT.mono,
                      fontSize: 10,
                      color: "rgba(100, 90, 70, 0.3)",
                    }}
                  >
                    click to flip back
                  </div>
                </div>
              </div>
            </div>
          ) : workGalleryIsVideoSrc(item.image) ? (
            <div
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                overflow: "hidden",
                background: "#000",
              }}
            >
              <video
                src={item.image}
                controls
                playsInline
                loop
                autoPlay
                muted
                aria-label={item.title}
                onLoadedMetadata={(e) => {
                  const v = e.currentTarget;
                  reportLbNatural(v.videoWidth, v.videoHeight);
                }}
                onError={() => setImageError(true)}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  objectPosition: "center",
                  display: "block",
                }}
              />
            </div>
          ) : lbMulti ? (
            <WorkGalleryLightboxCarousel
              slides={lbSlides}
              startIndex={carouselStartIndex}
              onActiveNaturalSize={reportLbNatural}
            />
          ) : (
            <div
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                overflow: "hidden",
                background: C.ink,
              }}
            >
              <motion.img
                src={item.image}
                alt={item.title}
                onLoad={(e) => {
                  const { naturalWidth: nw, naturalHeight: nh } = e.currentTarget;
                  reportLbNatural(nw, nh);
                }}
                onError={() => setImageError(true)}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  objectPosition: "center",
                  display: "block",
                }}
              />
            </div>
              )}
            </div>
          </div>
        )}

        {/* Info panel */}
        <motion.div
          className="lightbox-info-col"
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
          {item.projectUrl ? (
            <p style={{ margin: "14px 0 0", fontFamily: FONT.body, fontSize: 14 }}>
              <a
                href={item.projectUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                style={{
                  color: C.accent,
                  textDecoration: "underline",
                  textUnderlineOffset: 3,
                }}
              >
                Visit Sun Devil Sitdown site
              </a>
            </p>
          ) : null}

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
  const [activeFilter, setActiveFilter] = useState(CATEGORIES[0].id);
  const [selectedItem, setSelectedItem] = useState(null);
  const [lightboxCarouselIndex, setLightboxCarouselIndex] = useState(0);

  const openGalleryItem = useCallback((item, carouselIndex = 0) => {
    setLightboxCarouselIndex(
      typeof carouselIndex === "number" && Number.isFinite(carouselIndex)
        ? Math.max(0, Math.floor(carouselIndex))
        : 0,
    );
    setSelectedItem(item);
  }, []);

  const closeLightbox = useCallback(() => {
    setSelectedItem(null);
  }, []);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => { setLoaded(true); }, []);

  const filtered = WORK_ITEMS.filter(item => item.category === activeFilter);

  const counts = {
    photography: WORK_ITEMS.filter(i => i.category === "photography").length,
    brand: WORK_ITEMS.filter(i => i.category === "brand").length,
    print: WORK_ITEMS.filter(i => i.category === "print").length,
    caseStudies: WORK_ITEMS.filter(i => i.category === "caseStudies").length,
  };

  return (
    <div style={{
      background: C.bg,
      minHeight: "100vh",
      color: C.ink,
    }}>
      <SeoHead title={SEO.work.title} description={SEO.work.description} path={SEO.work.path} />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;500&family=Instrument+Serif:ital@0;1&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700&family=JetBrains+Mono:wght@400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        ::selection { background: rgba(224, 91, 91, 0.2); }
        @media (max-width: 768px) {
          .masonry-grid { columns: 1 !important; column-gap: ${WORK_GALLERY_MASONRY_GAP}px !important; }
          .lightbox-inner {
            flex-direction: column !important;
            align-items: stretch !important;
            gap: 16px !important;
          }
          .lightbox-media-col {
            flex: 0 0 auto !important;
            align-self: stretch !important;
            width: 100% !important;
          }
          .lightbox-info-col {
            flex: 0 1 auto !important;
            width: 100% !important;
            min-width: 0 !important;
          }
        }
          .gallery-header-grid { flex-direction: column !important; gap: 20px !important; }
          .filter-tabs { overflow-x: auto !important; flex-wrap: nowrap !important; }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          .masonry-grid { columns: 2 !important; column-gap: ${WORK_GALLERY_MASONRY_GAP}px !important; }
        }
        .masonry-grid {
          column-gap: ${WORK_GALLERY_MASONRY_GAP}px !important;
        }
      `}</style>

      <SiteNav />

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
                Photography from ASU and travel (including an IPA-shortlisted frame), brand systems like AZHype and my app identities, print pieces, and Behance case studies from the GIT agency studio.
              </p>
            </div>

            <div style={{
              fontFamily: FONT.mono,
              fontSize: 11,
              color: C.inkFaint,
              whiteSpace: "nowrap",
            }}>
              {filtered.length} in {CATEGORIES.find((c) => c.id === activeFilter)?.label ?? "category"}
            </div>
          </div>
        </motion.div>
      </header>

      {/* ── Filter tabs ── */}
      <div style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: "0 40px 40px",
        position: "relative",
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
              columnGap: WORK_GALLERY_MASONRY_GAP,
            }}
          >
            {filtered.map((item, i) => (
              <GalleryItem
                key={item.id}
                item={item}
                index={i}
                onOpen={openGalleryItem}
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

      {/* ── Lightpainting CTA ── */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 40px 70px", textAlign: "center" }}>
        <Link
          to="/lightpainting"
          style={{
            fontFamily: FONT.mono,
            fontSize: 12,
            letterSpacing: 1,
            textTransform: "uppercase",
            color: C.ink,
            padding: "14px 28px",
            borderRadius: 2,
            textDecoration: "none",
            border: `1px solid ${C.ruleStrong}`,
            transition: "all 0.3s",
            display: "inline-block",
          }}
          onMouseEnter={(e) => {
            e.target.style.borderColor = C.accent;
            e.target.style.color = C.accent;
          }}
          onMouseLeave={(e) => {
            e.target.style.borderColor = C.ruleStrong;
            e.target.style.color = C.ink;
          }}
        >
          View Lightpainting Gallery →
        </Link>
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
          <Lightbox
            item={selectedItem}
            carouselStartIndex={lightboxCarouselIndex}
            onClose={closeLightbox}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
