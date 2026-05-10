import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LiquidGlassContainer } from "@tinymomentum/liquid-glass-react";
import "@tinymomentum/liquid-glass-react/dist/components/LiquidGlassBase.css";
import GlowCanvas from "./GlowCanvas";
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

const DARK_SECTION_IDS = [];

/** Home scroll-spy order (top → bottom) */
const HOME_SECTION_IDS = ["hero", "bio", "experience", "process", "contact"];

const MAX_SCALE = 1.08;
const MAX_DISTANCE = 140; // px — subtle dock magnification
/** Inside the glass: same value for side padding and gaps between items */
const NAV_SPACING = 12;

function NavLink({
  label,
  id,
  href,
  isActive,
  navMouseX,
  navLeft,
  scrollTo,
  darkBackground,
  compact,
  noiseIndex = 0,
}) {
  const linkRef = useRef(null);
  const pillGlowRef = useRef(null);
  const leaveTimerRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [magnificationFactor, setMagnificationFactor] = useState(0);
  const [isPressed, setIsPressed] = useState(false);
  const [isBouncing, setIsBouncing] = useState(false);
  const [pillGlowMouse, setPillGlowMouse] = useState({ x: 50, y: 50 });

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

  const displayScale = isActive ? Math.max(scale, 1.045) : scale;

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

  const activeTextColor = darkBackground && isActive ? "rgba(255, 255, 255, 0.96)" : coral;
  const inactiveHoverBg = darkBackground ? "rgba(255, 255, 255, 0.1)" : "rgba(224, 91, 91, 0.035)";

  const innerStyle = {
    fontFamily: FONT.mono,
    fontSize: compact ? 9.5 : 11,
    fontWeight: isActive ? 600 : shouldBold ? 500 : 400,
    letterSpacing: compact ? 1.1 : 1.5,
    textTransform: "uppercase",
    color: isActive ? activeTextColor : f > 0 ? subtleHoverColor : defaultInactiveColor,
    padding: compact ? `5px ${Math.max(5, NAV_SPACING - 4)}px` : `6px ${NAV_SPACING}px`,
    borderRadius: 8,
    cursor: "pointer",
    transition: "color 0.2s ease, background 0.2s ease, fontWeight 0.2s ease, box-shadow 0.2s ease",
    background: isActive
      ? darkBackground
        ? "rgba(224, 91, 91, 0.45)"
        : "rgba(224, 91, 91, 0.12)"
      : shouldTint
        ? inactiveHoverBg
        : "transparent",
    boxShadow: isActive
      ? darkBackground
        ? "0 0 0 1px rgba(255, 255, 255, 0.22), inset 0 1px 0 rgba(255, 255, 255, 0.14)"
        : "0 0 0 1px rgba(224, 91, 91, 0.28), inset 0 1px 0 rgba(255,255,255,0.06)"
      : "none",
    display: "inline-flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    whiteSpace: "nowrap",
    textDecoration: "none",
    lineHeight: 1,
  };

  const showPillNoise =
    typeof window !== "undefined" &&
    window.innerWidth > 768 &&
    !compact &&
    (isActive || shouldTint);

  const handlePillGlowMove = useCallback((e) => {
    const el = pillGlowRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    if (r.width <= 0 || r.height <= 0) return;
    setPillGlowMouse({
      x: ((e.clientX - r.left) / r.width) * 100,
      y: ((e.clientY - r.top) / r.height) * 100,
    });
  }, []);

  const handlePillGlowLeave = useCallback(() => {
    setPillGlowMouse({ x: 50, y: 50 });
  }, []);

  const layeredLabelStyle = {
    ...innerStyle,
    background: "transparent",
    boxShadow: "none",
    position: "relative",
    zIndex: 2,
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

  const pillShell = showPillNoise ? (
    <span
      ref={pillGlowRef}
      onMouseMove={handlePillGlowMove}
      onMouseLeave={handlePillGlowLeave}
      style={{ position: "relative", display: "inline-block", verticalAlign: "middle" }}
    >
      <span
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 8,
          overflow: "hidden",
          zIndex: 0,
          pointerEvents: "none",
        }}
      >
        <GlowCanvas
          wrapperRef={pillGlowRef}
          mouseX={pillGlowMouse.x}
          mouseY={pillGlowMouse.y}
          isHovered={showPillNoise}
          seed={noiseIndex * 19}
          startDelayMs={0}
          borderRadius={8}
          skipEntranceAnimation
          stackZIndex={0}
        />
      </span>
      <span
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 8,
          zIndex: 1,
          pointerEvents: "none",
          background: innerStyle.background,
          boxShadow: innerStyle.boxShadow,
        }}
      />
      {href ? (
        <Link to={href} style={layeredLabelStyle} aria-current={isActive ? "page" : undefined}>
          {label}
        </Link>
      ) : (
        <span
          onClick={() => scrollTo(id)}
          style={layeredLabelStyle}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && scrollTo(id)}
        >
          {label}
        </span>
      )}
    </span>
  ) : href ? (
    <Link to={href} style={innerStyle} aria-current={isActive ? "page" : undefined}>
      {label}
    </Link>
  ) : (
    <span
      onClick={() => scrollTo(id)}
      style={innerStyle}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && scrollTo(id)}
    >
      {label}
    </span>
  );

  return (
    <span
      ref={linkRef}
      style={wrapperStyle}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      {pillShell}
    </span>
  );
}

/** Sentinel for “scroll to top” when navigating home from another route */
export const NAV_SCROLL_ROOT = "__root__";

export default function Nav() {
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [navMouseX, setNavMouseX] = useState(null);
  const [navLeft, setNavLeft] = useState(0);
  /** Which `#section` anchor is active on `/` (scroll spy) */
  const [scrollSection, setScrollSection] = useState("hero");
  const [navOverDarkFromScroll, setNavOverDarkFromScroll] = useState(false);
  const navRef = useRef(null);
  const logoRef = useRef(null);
  const [logoScale, setLogoScale] = useState(1);

  const activeSection = useMemo(() => {
    if (pathname === "/work") return "gallery";
    if (pathname === "/lightpainting") return "lights";
    if (pathname === "/") return scrollSection;
    return "";
  }, [pathname, scrollSection]);

  const navOverDark = pathname === "/lightpainting" || navOverDarkFromScroll;

  /** Glass dock: on dark pages/sections, pull luminance down so it matches light-section subtlety. */
  const glassTintOpacityLight = scrolled ? 22 : 18;
  const glassTintOpacityDark = scrolled ? 10 : 8;
  const glassSurfaceLight = "rgba(255, 255, 255, 0.14)";
  const glassSurfaceDark = "rgba(255, 255, 255, 0.055)";
  const glassFallbackLight = "rgba(248, 244, 240, 0.72)";
  const glassFallbackDark = "rgba(22, 22, 24, 0.58)";
  const glassSpecularLight =
    "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.08) 40%, transparent 70%)";
  const glassSpecularDark =
    "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.03) 42%, transparent 72%)";

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    if (pathname !== "/") {
      setScrollSection("");
      return;
    }

    const updateScrollSection = () => {
      const marker = window.scrollY + Math.min(96, window.innerHeight * 0.2);
      let current = "hero";
      for (const sid of HOME_SECTION_IDS) {
        const el = document.getElementById(sid);
        if (!el) continue;
        const top = el.getBoundingClientRect().top + window.scrollY;
        if (top <= marker + 1) current = sid;
      }
      setScrollSection(current);
    };

    updateScrollSection();
    const t = setTimeout(updateScrollSection, 150);
    window.addEventListener("scroll", updateScrollSection, { passive: true });
    window.addEventListener("resize", updateScrollSection);
    return () => {
      clearTimeout(t);
      window.removeEventListener("scroll", updateScrollSection);
      window.removeEventListener("resize", updateScrollSection);
    };
  }, [pathname]);

  useEffect(() => {
    if (pathname !== "/") {
      setNavOverDarkFromScroll(false);
      return;
    }

    const rectOverlaps = (a, b) =>
      a.bottom > b.top && a.top < b.bottom && a.right > b.left && a.left < b.right;

    const darkRectsUnderNav = () => {
      const rects = [];
      for (const id of DARK_SECTION_IDS) {
        const el = document.getElementById(id);
        if (el) rects.push(el.getBoundingClientRect());
      }
      document.querySelectorAll('[id^="pro-work-panel-"]').forEach((el) => {
        rects.push(el.getBoundingClientRect());
      });
      return rects;
    };

    const checkOverlap = () => {
      const navEl = navRef.current;
      if (!navEl) return;
      const nr = navEl.getBoundingClientRect();
      const hit = darkRectsUnderNav().some((r) => r.width > 0 && r.height > 0 && rectOverlaps(nr, r));
      setNavOverDarkFromScroll(hit);
    };

    checkOverlap();
    const t = setTimeout(checkOverlap, 100);
    window.addEventListener("scroll", checkOverlap, { passive: true });
    window.addEventListener("resize", checkOverlap);
    return () => {
      clearTimeout(t);
      window.removeEventListener("scroll", checkOverlap);
      window.removeEventListener("resize", checkOverlap);
    };
  }, [pathname]);

  const scrollTo = useCallback(
    (id) => {
      setMenuOpen(false);
      if (id === "home") {
        if (pathname !== "/") navigate("/", { state: { scrollToId: NAV_SCROLL_ROOT } });
        else window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      if (pathname !== "/") {
        navigate("/", { state: { scrollToId: id } });
        return;
      }
      if (id === "hero") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    [navigate, pathname]
  );

  const goHomeTop = useCallback(() => {
    setMenuOpen(false);
    if (pathname !== "/") {
      navigate("/", { state: { scrollToId: NAV_SCROLL_ROOT } });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [navigate, pathname]);

  const handleNavMouseMove = useCallback((e) => {
    if (window.innerWidth <= 768) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setNavMouseX(e.clientX - rect.left);
    setNavLeft(rect.left);
  }, []);

  const handleNavMouseLeave = useCallback(() => setNavMouseX(null), []);

  useEffect(() => {
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
  }, [navMouseX]);

  const links = useMemo(() => {
    if (pathname === "/") {
      return [
        { id: "hero", label: "Intro" },
        { id: "bio", label: "About" },
        { id: "experience", label: "Cases" },
        { id: "process", label: "AI" },
        { id: "gallery", label: "Gallery", href: "/work" },
        { id: "contact", label: "Contact" },
      ];
    }
    return [
      { id: "home", label: "Home", href: "/" },
      { id: "gallery", label: "Gallery", href: "/work" },
      { id: "Lightpainting", label: "Lightpainting", href: "/lightpainting" },
      { id: "contact", label: "Contact" },
    ];
  }, [pathname]);

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
          .nav-glass-fallback-surface.nav-glass-fallback-surface--dark {
            background: rgba(28, 28, 30, 0.92) !important;
            border: 1px solid rgba(255, 255, 255, 0.1) !important;
            box-shadow: 0 8px 28px rgba(0, 0, 0, 0.45) !important;
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
          align-items: center !important;
          overflow: visible !important;
          padding: 10px clamp(16px, 2.5vw, 22px) !important;
          box-sizing: border-box !important;
        }
        .nav-glass-wrap {
          width: max-content !important;
          max-width: min(960px, calc(100vw - 48px)) !important;
          flex: 0 1 auto !important;
          min-width: 0 !important;
          overflow: visible !important;
          position: relative !important;
        }
        .nav-glass-wrap > * {
          width: max-content !important;
          max-width: min(960px, calc(100vw - 48px)) !important;
          box-sizing: border-box !important;
          overflow: visible !important;
        }
        /* Gallery routes: bar spans cap width so label can sit on the right */
        .nav-glass-wrap--page {
          width: min(960px, calc(100vw - 48px)) !important;
          max-width: min(960px, calc(100vw - 48px)) !important;
        }
        .nav-glass-wrap--page > * {
          width: 100% !important;
          max-width: min(960px, calc(100vw - 48px)) !important;
        }

        @media (max-width: 768px) {
          /* Full-width bar with horizontal inset; logo left, menu right */
          .nav-pill {
            padding: 10px clamp(18px, 5.5vw, 28px) !important;
            justify-content: stretch !important;
          }
          .nav-glass-wrap {
            width: 100% !important;
            max-width: 100% !important;
            flex: 1 1 auto !important;
          }
          .nav-glass-wrap > * {
            width: 100% !important;
            max-width: 100% !important;
          }
          .nav-glass-wrap .liquid-glass-container {
            width: 100% !important;
            max-width: 100% !important;
            box-sizing: border-box !important;
          }
          .nav-glass-wrap .liquid-glass-container > .liquid-glass {
            width: 100% !important;
            max-width: 100% !important;
            box-sizing: border-box !important;
          }
          .nav-pill-inner-row {
            width: 100% !important;
            max-width: 100% !important;
            min-width: 0 !important;
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
            box-sizing: border-box !important;
            padding-left: clamp(12px, 3.5vw, 22px) !important;
            padding-right: clamp(12px, 3.5vw, 22px) !important;
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
        <div className="nav-glass-wrap">
        {/* Fallback surface: sits behind LiquidGlassContainer and is visible
            when backdrop-filter fails — ensures nav is never fully transparent */}
        <div
          aria-hidden="true"
          className={`nav-glass-fallback-surface${navOverDark ? " nav-glass-fallback-surface--dark" : ""}`}
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 50,
            background: navOverDark ? glassFallbackDark : glassFallbackLight,
            backdropFilter: "blur(32px) saturate(1.35)",
            WebkitBackdropFilter: "blur(32px) saturate(1.35)",
            boxShadow: navOverDark
              ? "inset 0 1px 0 rgba(255,255,255,0.06), 0 10px 36px rgba(0,0,0,0.42)"
              : "inset 0 1px 0 rgba(255,255,255,0.22), 0 8px 32px rgba(0,0,0,0.08)",
            zIndex: 0,
            pointerEvents: "none",
            transition: "background 0.35s ease, box-shadow 0.35s ease",
          }}
        />
        <LiquidGlassContainer
          borderRadius={50}
          innerShadowColor={
            navOverDark ? "rgba(255, 255, 255, 0.14)" : "rgba(255, 255, 255, 0.5)"
          }
          innerShadowBlur={20}
          innerShadowSpread={-5}
          glassTintColor={navOverDark ? "#c4c2be" : "#ffffff"}
          glassTintOpacity={navOverDark ? glassTintOpacityDark : glassTintOpacityLight}
          frostBlurRadius={28}
          noiseFrequency={0.009}
          noiseStrength={navOverDark ? 48 : 80}
          width={960}
          height={46}
          style={{
            width: "max-content",
            maxWidth: "min(960px, calc(100vw - 48px))",
            minWidth: 0,
            borderRadius: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: navOverDark ? glassSurfaceDark : glassSurfaceLight,
            backdropFilter: navOverDark ? "blur(28px) saturate(1.05)" : "blur(24px) saturate(1.2)",
            WebkitBackdropFilter: navOverDark ? "blur(28px) saturate(1.05)" : "blur(24px) saturate(1.2)",
            border: "none",
            boxShadow: "none",
            position: "relative",
            overflow: "hidden",
            transition:
              "background 0.35s ease, backdrop-filter 0.35s ease, -webkit-backdrop-filter 0.35s ease",
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
              background: navOverDark ? glassSpecularDark : glassSpecularLight,
              zIndex: 1,
              transition: "background 0.35s ease",
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
              opacity: navOverDark ? 0.025 : 0.04,
              zIndex: 0,
              transition: "opacity 0.35s ease",
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
              padding: `6px ${NAV_SPACING + 8}px`,
              width: "max-content",
              maxWidth: "min(960px, calc(100vw - 48px))",
              justifyContent: "center",
              position: "relative",
              zIndex: 2,
            }}
          >
            <>
                {/* Logo — dock magnification */}
                <div
                  ref={logoRef}
                  onClick={goHomeTop}
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
                  onKeyDown={(e) => e.key === "Enter" && goHomeTop()}
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
                  {links.map((l, i) => (
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
                      noiseIndex={i}
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
          </div>
        </LiquidGlassContainer>
        </div>
      </nav>

      {menuOpen && (
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
          {links.map((l) => {
            const isOn = activeSection === l.id;
            const baseMobile = {
              fontFamily: FONT.display,
              fontSize: 28,
              fontStyle: "italic",
              cursor: "pointer",
              textDecoration: "none",
              padding: "8px 20px",
              borderRadius: 12,
              transition: "background 0.2s ease, color 0.2s ease, box-shadow 0.2s ease",
            };
            const activeMobile = {
              color: "#E05B5B",
              background: "rgba(224, 91, 91, 0.12)",
              boxShadow: "0 0 0 1px rgba(224, 91, 91, 0.35)",
            };
            const idleMobile = {
              color: "#E05B5B",
              background: "transparent",
              boxShadow: "none",
            };
            return l.href ? (
              <Link
                key={l.id}
                to={l.href}
                onClick={() => setMenuOpen(false)}
                style={{ ...baseMobile, ...(isOn ? activeMobile : idleMobile) }}
              >
                {l.label}
              </Link>
            ) : (
              <span
                key={l.id}
                role="button"
                tabIndex={0}
                onClick={() => {
                  scrollTo(l.id);
                  setMenuOpen(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    scrollTo(l.id);
                    setMenuOpen(false);
                  }
                }}
                style={{ ...baseMobile, ...(isOn ? activeMobile : idleMobile) }}
              >
                {l.label}
              </span>
            );
          })}
        </div>
      )}
    </>
  );
}

