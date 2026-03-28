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

const MAX_SCALE = 1.08;
const MAX_DISTANCE = 140; // px — subtle dock magnification
/** Inside the glass: same value for side padding and gaps between items */
const NAV_SPACING = 12;

function NavLink({ label, id, href, isActive, navMouseX, navLeft, scrollTo, darkBackground }) {
  const linkRef = useRef(null);
  const leaveTimerRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [magnificationFactor, setMagnificationFactor] = useState(0);
  const [isPressed, setIsPressed] = useState(false);
  const [isBouncing, setIsBouncing] = useState(false);

  useEffect(() => {
    if (navMouseX === null || !linkRef.current) {
      setScale(1);
      setMagnificationFactor(0);
      return;
    }
    const linkRect = linkRef.current.getBoundingClientRect();
    const linkCenter = linkRect.left + linkRect.width / 2 - navLeft;
    const distance = Math.abs(navMouseX - linkCenter);
    const factor = Math.max(0, 1 - distance / MAX_DISTANCE);
    const newScale = 1 + (MAX_SCALE - 1) * Math.pow(factor, 2);
    setScale(newScale);
    setMagnificationFactor(factor);
  }, [navMouseX, navLeft]);

  useEffect(() => {
    if (!isBouncing) return;
    const t = setTimeout(() => setIsBouncing(false), 400);
    return () => clearTimeout(t);
  }, [isBouncing]);

  useEffect(() => () => {
    if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current);
  }, []);

  const displayScale = isActive ? Math.max(scale, 1.02) : scale;

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

  const defaultInactiveColor = darkBackground ? "rgba(255, 255, 255, 0.92)" : "rgba(26, 24, 20, 0.78)";
  const coral = C.accent;
  const f = magnificationFactor;
  // Subtle hover: keep text readable; tiny warm nudge only when magnified
  const subtleHoverColor = darkBackground
    ? `rgba(255, 255, 255, ${0.92 + 0.06 * f})`
    : `rgba(26, 24, 20, ${0.78 + 0.12 * f})`;

  const shouldTint = scale > 1.035;
  const shouldBold = scale > 1.055;

  const innerStyle = {
    fontFamily: FONT.mono,
    fontSize: 11,
    fontWeight: isActive ? 600 : shouldBold ? 500 : 400,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: isActive ? coral : f > 0 ? subtleHoverColor : defaultInactiveColor,
    padding: `8px ${NAV_SPACING}px`,
    borderRadius: 8,
    cursor: "pointer",
    transition: "color 0.2s ease, background 0.2s ease, fontWeight 0.2s ease",
    background: isActive
      ? "transparent"
      : shouldTint
        ? "rgba(224, 91, 91, 0.035)"
        : "transparent",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    whiteSpace: "nowrap",
    textDecoration: "none",
  };

  const wrapperStyle = {
    transformOrigin: "center center",
    display: "inline-block",
    ...(isBouncing
      ? { animation: "glassPress 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards" }
      : {
          transform: `scale(${isPressed ? displayScale * 0.92 : displayScale})`,
          transition: isPressed ? "transform 0.1s ease" : "transform 0.12s ease-out",
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
  const [navMouseX, setNavMouseX] = useState(null);
  const [navLeft, setNavLeft] = useState(0);
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
    if (mode !== "home") return;
    if (window.innerWidth <= 768) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setNavMouseX(e.clientX - rect.left);
    setNavLeft(rect.left);
  }, [mode]);

  const handleNavMouseLeave = useCallback(() => setNavMouseX(null), []);

  useEffect(() => {
    if (mode !== "home") {
      setLogoScale(1);
      return;
    }
    if (navMouseX === null || !navRef?.current || !logoRef.current) {
      setLogoScale(1);
      return;
    }
    const navRect = navRef.current.getBoundingClientRect();
    const logoRect = logoRef.current.getBoundingClientRect();
    const logoCenter = logoRect.left + logoRect.width / 2 - navRect.left;
    const distance = Math.abs(navMouseX - logoCenter);
    const maxDist = 120;
    setLogoScale(distance > 120 ? 1 : 1 + 0.06 * Math.pow(1 - distance / maxDist, 2));
  }, [navMouseX, mode]);

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

        @keyframes noiseShift {
          0% { background-position: 0 0; }
          100% { background-position: 128px 128px; }
        }

        /* Fallback for browsers where backdrop-filter is unsupported/blocked.
           The absolute fallback-surface div already provides a blur layer;
           this rule additionally forces the LiquidGlassContainer to an
           opaque background so the nav is never fully invisible. */
        @supports not (backdrop-filter: blur(1px)) {
          .nav-glass-fallback-surface {
            background: rgba(244, 241, 236, 0.94) !important;
            border: 1px solid rgba(0, 0, 0, 0.10) !important;
            box-shadow: 0 4px 24px rgba(0, 0, 0, 0.10) !important;
          }
        }

        /* Centered dock; width hugs content; cap so it never overflows viewport */
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
          position: relative !important;
        }
        .nav-glass-wrap > * {
          width: max-content !important;
          max-width: min(960px, calc(100vw - 24px)) !important;
          box-sizing: border-box !important;
          overflow: visible !important;
        }
        /* Gallery routes: bar spans cap width so label can sit on the right */
        .nav-glass-wrap--page {
          width: min(960px, calc(100vw - 24px)) !important;
          max-width: min(960px, calc(100vw - 24px)) !important;
        }
        .nav-glass-wrap--page > * {
          width: 100% !important;
          max-width: min(960px, calc(100vw - 24px)) !important;
        }

        @media (max-width: 768px) {
          .nav-pill {
            padding: 10px 12px 16px !important;
          }
          .nav-pill-inner-row {
            width: max-content !important;
            min-width: 0 !important;
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
          }
          .nav-glass-wrap--page .nav-pill-inner-row {
            width: 100% !important;
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
          left: 0,
          right: 0,
          width: "100%",
          zIndex: 1000,
        }}
        className="nav-pill"
      >
        <div className={`nav-glass-wrap${mode !== "home" ? " nav-glass-wrap--page" : ""}`}>
        {/* Fallback surface: sits behind LiquidGlassContainer and is visible
            when backdrop-filter fails — ensures nav is never fully transparent */}
        <div
          aria-hidden="true"
          className="nav-glass-fallback-surface"
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 50,
            background: "rgba(248, 244, 240, 0.82)",
            backdropFilter: "blur(10px) saturate(1.3)",
            WebkitBackdropFilter: "blur(10px) saturate(1.3)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.2), 0 4px 20px rgba(0,0,0,0.07)",
            zIndex: 0,
            pointerEvents: "none",
          }}
        />
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
          width={960}
          height={52}
          style={{
            width: mode === "home" ? "max-content" : "100%",
            maxWidth: "min(960px, calc(100vw - 24px))",
            minWidth: 0,
            borderRadius: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(255, 255, 255, 0.08)",
            backdropFilter: "none",
            WebkitBackdropFilter: "none",
            border: "none",
            boxShadow: "none",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Specular highlight at the top edge */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 50,
              pointerEvents: "none",
              background:
                "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.08) 40%, transparent 70%)",
              zIndex: 1,
            }}
          />

          {/* Subtle animated internal glass noise */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 50,
              overflow: "hidden",
              pointerEvents: "none",
              opacity: 0.04,
              zIndex: 0,
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage:
                  'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'256\' height=\'256\' filter=\'url(%23n)\' opacity=\'0.5\'/%3E%3C/svg%3E")',
                backgroundSize: "128px 128px",
                mixBlendMode: "overlay",
                animation: "noiseShift 8s linear infinite",
              }}
            />
          </div>

          <div
            className="nav-pill-inner-row"
            style={{
              display: "flex",
              alignItems: "center",
              gap: NAV_SPACING,
              padding: `8px ${NAV_SPACING}px`,
              width: mode === "home" ? "max-content" : "100%",
              maxWidth: "min(960px, calc(100vw - 24px))",
              justifyContent: mode === "home" ? "center" : "flex-start",
              position: "relative",
              zIndex: 2,
            }}
          >
            {mode === "home" ? (
              <>
                {/* Logo — always original coral; dock magnification on home only */}
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
                  onKeyDown={(e) => e.key === "Enter" && scrollTo(null)}
                >
                  <img
                    src={logoImg}
                    alt="CB"
                    style={{
                      height: 28,
                      width: "auto",
                      display: "block",
                      transition: "opacity 0.25s ease",
                    }}
                  />
                </div>
                <div
                  className="nav-pill-divider"
                  style={{
                    width: 1,
                    height: 16,
                    background: navOverDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.08)",
                    margin: 0,
                    flexShrink: 0,
                    transition: "background 0.25s ease",
                  }}
                />
                {/* Desktop links */}
                <div style={{ display: "flex", gap: NAV_SPACING, alignItems: "center" }} className="desktop-nav">
                  {links.map((l) => (
                    <NavLink
                      key={l.id}
                      id={l.id}
                      label={l.label}
                      href={l.href}
                      isActive={activeSection === l.id}
                      navMouseX={navMouseX}
                      navLeft={navLeft}
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
              <div
                style={{
                  display: "flex",
                  gap: NAV_SPACING,
                  alignItems: "center",
                  width: "100%",
                  justifyContent: "flex-start",
                }}
              >
                <Link
                  to={backHref}
                  style={{
                    fontFamily: FONT.mono,
                    fontSize: 11,
                    letterSpacing: 1.5,
                    textTransform: "uppercase",
                    color: navOverDark ? "rgba(255, 255, 255, 0.92)" : "rgba(26, 24, 20, 0.78)",
                    textDecoration: "none",
                    whiteSpace: "nowrap",
                    transition: "opacity 0.2s ease",
                    padding: "8px 0",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = "0.75";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = "1";
                  }}
                >
                  ← Back
                </Link>

                <Link
                  to="/"
                  aria-label="Home"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    lineHeight: 0,
                  }}
                >
                  <img
                    src={logoImg}
                    alt=""
                    style={{
                      height: 28,
                      width: "auto",
                      display: "block",
                    }}
                  />
                </Link>

                <div
                  style={{
                    fontFamily: FONT.mono,
                    fontSize: 11,
                    letterSpacing: 1.5,
                    textTransform: "uppercase",
                    color: navOverDark ? "rgba(255, 255, 255, 0.92)" : "rgba(26, 24, 20, 0.78)",
                    padding: "8px 0",
                    whiteSpace: "nowrap",
                    marginLeft: "auto",
                  }}
                >
                  {pageLabel}
                </div>
              </div>
            )}
          </div>
        </LiquidGlassContainer>
        </div>
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

