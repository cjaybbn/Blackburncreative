import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { LiquidGlassContainer } from "@tinymomentum/liquid-glass-react";
import "@tinymomentum/liquid-glass-react/dist/components/LiquidGlassBase.css";
import logoImg from "./logo.png";

const FONT = {
  display: "'DM Serif Display', Georgia, serif",
  body: "'DM Sans', -apple-system, sans-serif",
  mono: "'JetBrains Mono', monospace",
};

const C = {
  ink: "rgba(42, 6, 17, 0.95)",
  inkMuted: "rgba(42, 6, 17, 0.6)",
  inkFaint: "rgba(42, 6, 17, 0.4)",
  accent: "#E05B5B",
};

const DARK_SECTION_IDS = ["realcopy"];

const MAG_MAX_SCALE = 1.1;
const MAG_PADDING_PX = 5; // extra pixels outside link bounds for reaction zone

function NavLink({ label, id, href, isActive, mouseX, navRef, scrollTo, darkBackground }) {
  const linkRef = useRef(null);
  const leaveTimerRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [magnificationFactor, setMagnificationFactor] = useState(0);
  const [isPressed, setIsPressed] = useState(false);
  const [isBouncing, setIsBouncing] = useState(false);

  useEffect(() => {
    if (mouseX === null || !navRef?.current || !linkRef.current) {
      setScale(1);
      setMagnificationFactor(0);
      return;
    }
    const navRect = navRef.current.getBoundingClientRect();
    const linkRect = linkRef.current.getBoundingClientRect();
    const linkCenter = linkRect.left + linkRect.width / 2 - navRect.left;
    const distance = Math.abs(mouseX - linkCenter);
    const maxDistance = linkRect.width / 2 + MAG_PADDING_PX;
    const factor = Math.max(0, 1 - distance / maxDistance);
    const newScale = 1 + (MAG_MAX_SCALE - 1) * Math.pow(factor, 1.5);
    setScale(newScale);
    setMagnificationFactor(factor);
  }, [mouseX, navRef]);

  useEffect(() => {
    if (!isBouncing) return;
    const t = setTimeout(() => setIsBouncing(false), 400);
    return () => clearTimeout(t);
  }, [isBouncing]);

  useEffect(() => () => {
    if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current);
  }, []);

  const displayScale = isActive ? Math.max(scale, 1.05) : scale;

  const handleMouseDown = () => {
    if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current);
    setIsPressed(true);
  };

  const handleMouseUp = () => {
    leaveTimerRef.current = setTimeout(() => {
      leaveTimerRef.current = null;
      setIsPressed(false);
      setIsBouncing(true);
    }, 150);
  };

  const handleMouseLeave = () => {
    if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current);
    leaveTimerRef.current = null;
    setIsPressed(false);
  };

  const defaultInactiveColor = darkBackground ? "rgba(255, 255, 255, 0.85)" : "rgba(26, 24, 20, 0.5)";
  const coral = C.accent;
  const f = magnificationFactor;
  const blendColor = darkBackground
    ? `rgba(${Math.round(255 * (1 - f) + 224 * f)}, ${Math.round(255 * (1 - f) + 91 * f)}, ${Math.round(255 * (1 - f) + 91 * f)}, ${(0.85 * (1 - f) + 1 * f).toFixed(2)})`
    : `rgba(${Math.round(26 * (1 - f) + 224 * f)}, ${Math.round(24 * (1 - f) + 91 * f)}, ${Math.round(20 * (1 - f) + 91 * f)}, ${(0.5 * (1 - f) + 1 * f).toFixed(2)})`;

  const innerStyle = {
    fontFamily: FONT.mono,
    fontSize: 11,
    fontWeight: isActive ? 600 : 400 + Math.round(200 * f),
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: isActive ? coral : f > 0 ? blendColor : defaultInactiveColor,
    padding: "8px 16px",
    borderRadius: 8,
    cursor: "pointer",
    transition: "color 0.2s ease, background 0.2s ease, fontWeight 0.2s ease",
    background: isActive
      ? scale > 1.05
        ? darkBackground
          ? "rgba(255, 255, 255, 0.08)"
          : "rgba(224, 91, 91, 0.05)"
        : "transparent"
      : f > 0
        ? `rgba(224, 91, 91, ${0.05 * f})`
        : "transparent",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    whiteSpace: "nowrap",
    textDecoration: "none",
  };

  const wrapperStyle = {
    transformOrigin: "center bottom",
    display: "inline-block",
    ...(isBouncing
      ? { animation: "glassPress 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards" }
      : {
          transform: `scale(${isPressed ? displayScale * 0.92 : displayScale})`,
          transition: isPressed ? "transform 0.1s ease" : "transform 0.28s ease-out",
        }),
  };

  return (
    <span
      ref={linkRef}
      style={wrapperStyle}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      {href ? (
        <Link to={href} style={innerStyle}>
          {label}
        </Link>
      ) : (
        <span
          onClick={() => scrollTo(id)}
          style={{ ...innerStyle, flexDirection: "column" }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && scrollTo(id)}
        >
          {label}
          {isActive && (
            <div
              style={{
                width: 4,
                height: 4,
                borderRadius: "50%",
                background: "#E05B5B",
                margin: "4px auto 0",
              }}
            />
          )}
        </span>
      )}
    </span>
  );
}

export default function Nav({
  // mode:
  // - "home": full multi-section nav (used by /)
  // - "page": slim nav for gallery routes (/work and /lightpainting)
  mode = "home",
  activeSection,
  pageLabel,
  backHref = "/",
  darkBackground = false,
}) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mouseX, setMouseX] = useState(null);
  const [navOverDark, setNavOverDark] = useState(darkBackground);
  const navRef = useRef(null);
  const logoRef = useRef(null);
  const [logoScale, setLogoScale] = useState(1);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    setNavOverDark(darkBackground);
  }, [darkBackground]);

  useEffect(() => {
    if (mode !== "home") return;

    const checkSection = () => {
      const navCenterY = 50;
      const sectionIds = ["about", "realcopy", "experience", "process", "work", "contact"];
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= navCenterY && rect.bottom >= navCenterY) {
          setNavOverDark(DARK_SECTION_IDS.includes(id));
          return;
        }
      }
      setNavOverDark(false);
    };

    checkSection();
    window.addEventListener("scroll", checkSection, { passive: true });
    window.addEventListener("resize", checkSection);
    return () => {
      window.removeEventListener("scroll", checkSection);
      window.removeEventListener("resize", checkSection);
    };
  }, [mode]);

  const scrollTo = (id) => {
    setMenuOpen(false);
    if (id && id !== "about") document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavMouseMove = useCallback((e) => {
    if (window.innerWidth <= 768) return;
    if (!navRef.current) return;
    const rect = navRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    setMouseX(x);
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

  return (
    <>
      <style>{`
        @keyframes glassPress {
          0% { transform: scale(0.92); }
          50% { transform: scale(1.12); }
          100% { transform: scale(1); }
        }

        @media (max-width: 768px) {
          .nav-pill {
            left: 12px !important;
            right: 12px !important;
            width: calc(100vw - 24px) !important;
            max-width: calc(100vw - 24px) !important;
            transform: none !important;
            display: flex !important;
            justify-content: stretch !important;
            overflow: hidden !important;
          }
          .nav-pill > div {
            width: 100% !important;
            max-width: 100% !important;
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
          }
          .nav-pill-divider { display: none !important; }
          .desktop-nav { display: none !important; }
          .mobile-nav-toggle { display: flex !important; }
        }
      `}</style>

      <nav
        ref={navRef}
        onMouseMove={handleNavMouseMove}
        onMouseLeave={handleNavMouseLeave}
        style={{
          position: "fixed",
          top: 12,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1000,
        }}
        className="nav-pill"
      >
        <LiquidGlassContainer
          borderRadius={50}
          innerShadowColor="rgba(255, 255, 255, 0.5)"
          innerShadowBlur={20}
          innerShadowSpread={-5}
          glassTintColor="#ffffff"
          glassTintOpacity={scrolled ? 14 : 10}
          frostBlurRadius={2}
          noiseFrequency={0.009}
          noiseStrength={80}
          width={700}
          height={52}
          style={{
            width: "auto",
            minWidth: 200,
            borderRadius: "50px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              padding: "8px 24px",
              width: "100%",
              justifyContent: mode === "home" ? "center" : "space-between",
            }}
          >
            {/* Logo (dock magnification) */}
            <div
              ref={logoRef}
              onClick={() => (mode === "home" ? scrollTo(null) : (window.location.href = "/"))}
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
              onKeyDown={(e) => e.key === "Enter" && (mode === "home" ? scrollTo(null) : (window.location.href = "/"))}
            >
              <img
                src={logoImg}
                alt="CB"
                style={{
                  height: 28,
                  width: "auto",
                  display: "block",
                  filter: navOverDark ? "brightness(0) invert(1)" : "none",
                  transition: "filter 0.25s ease",
                  opacity: mode === "home" ? 1 : 0.3,
                }}
              />
            </div>

            {mode === "home" ? (
              <>
                <div
                  className="nav-pill-divider"
                  style={{
                    width: 1,
                    height: 16,
                    background: navOverDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.08)",
                    margin: "0 8px",
                    flexShrink: 0,
                    transition: "background 0.25s ease",
                  }}
                />
                {/* Desktop links */}
                <div style={{ display: "flex", gap: 4, alignItems: "center" }} className="desktop-nav">
                  {links.map((l) => (
                    <NavLink
                      key={l.id}
                      id={l.id}
                      label={l.label}
                      href={l.href}
                      isActive={activeSection === l.id}
                      mouseX={mouseX}
                      navRef={navRef}
                      scrollTo={scrollTo}
                      darkBackground={navOverDark}
                    />
                  ))}
                </div>

                {/* Mobile hamburger */}
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
                  <div
                    style={{
                      width: 20,
                      height: 2,
                      background: navOverDark ? "rgba(255,255,255,0.9)" : C.ink,
                      transition: "transform 0.3s ease, background 0.25s ease",
                      transformOrigin: "center",
                      transform: menuOpen ? "rotate(45deg) translate(5px, 5px)" : "none",
                    }}
                  />
                  <div
                    style={{
                      width: 20,
                      height: 2,
                      background: navOverDark ? "rgba(255,255,255,0.9)" : C.ink,
                      transition: "opacity 0.3s ease, background 0.25s ease",
                      opacity: menuOpen ? 0 : 1,
                    }}
                  />
                  <div
                    style={{
                      width: 20,
                      height: 2,
                      background: navOverDark ? "rgba(255,255,255,0.9)" : C.ink,
                      transition: "transform 0.3s ease, background 0.25s ease",
                      transformOrigin: "center",
                      transform: menuOpen ? "rotate(-45deg) translate(5px, -5px)" : "none",
                    }}
                  />
                </div>
              </>
            ) : (
              <div style={{ display: "flex", gap: 14, alignItems: "center", width: "100%", justifyContent: "flex-end" }}>
                <div
                  style={{
                    fontFamily: FONT.mono,
                    fontSize: 11,
                    letterSpacing: 1.5,
                    textTransform: "uppercase",
                    color: navOverDark ? "rgba(255,255,255,0.3)" : C.inkMuted,
                    padding: "8px 0",
                    whiteSpace: "nowrap",
                  }}
                >
                  {pageLabel}
                </div>

                <Link
                  to={backHref}
                  style={{
                    fontFamily: FONT.mono,
                    fontSize: 11,
                    letterSpacing: 1.5,
                    textTransform: "uppercase",
                    color: navOverDark ? "rgba(255,255,255,0.3)" : C.inkMuted,
                    textDecoration: "none",
                    whiteSpace: "nowrap",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = C.accent)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = navOverDark ? "rgba(255,255,255,0.3)" : C.inkMuted)}
                >
                  ← Back
                </Link>
              </div>
            )}
          </div>
        </LiquidGlassContainer>
      </nav>

      {mode === "home" && menuOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999,
            background: "rgba(244, 241, 236, 0.98)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 32,
            paddingTop: 80,
          }}
        >
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
            style={{
              position: "absolute",
              top: 20,
              right: 24,
              width: 40,
              height: 40,
              padding: 0,
              border: "none",
              background: "transparent",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#E05B5B",
            }}
          >
            <span style={{ fontSize: 32, lineHeight: 1 }}>×</span>
          </button>
          {links.map((l) =>
            l.href ? (
              <Link
                key={l.id}
                to={l.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  fontFamily: FONT.display,
                  fontSize: 28,
                  fontStyle: "italic",
                  color: "#E05B5B",
                  cursor: "pointer",
                  textDecoration: "none",
                }}
              >
                {l.label}
              </Link>
            ) : (
              <span
                key={l.id}
                onClick={() => {
                  scrollTo(l.id);
                  setMenuOpen(false);
                }}
                style={{
                  fontFamily: FONT.display,
                  fontSize: 28,
                  fontStyle: "italic",
                  color: "#E05B5B",
                  cursor: "pointer",
                }}
              >
                {l.label}
              </span>
            )
          )}
        </div>
      )}
    </>
  );
}

