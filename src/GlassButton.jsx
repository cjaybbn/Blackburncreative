import { useState, useRef, useCallback } from "react";

/*
 * GlassButton — iOS/visionOS frosted glass button
 * 
 * Designed to sit on top of a colorful background so the 
 * backdrop-filter blur is clearly visible (like iOS Control Center).
 *
 * Features:
 *   - Real frosted glass via backdrop-filter
 *   - 3D perspective tilt following cursor
 *   - Specular light highlight that tracks mouse position
 *   - Magnetic subtle pull toward cursor
 *   - Soft shadow depth
 */

export default function GlassButton({
  children = "Get in touch",
  href = "#",
  onClick,
  dark = false,  // set true when on dark backgrounds
  download = false,
}) {
  const ref = useRef(null);
  const [hover, setHover] = useState(false);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, tx: 0, ty: 0, mx: 50, my: 50 });

  const handleMouseMove = useCallback((e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const cx = x - 0.5;
    const cy = y - 0.5;

    setTilt({
      rx: cy * -12,
      ry: cx * 12,
      tx: cx * 5,
      ty: cy * 3,
      mx: x * 100,
      my: y * 100,
    });
  }, []);

  const handleMouseEnter = useCallback(() => setHover(true), []);
  const handleMouseLeave = useCallback(() => {
    setHover(false);
    setTilt({ rx: 0, ry: 0, tx: 0, ty: 0, mx: 50, my: 50 });
  }, []);

  const Tag = href && href !== "#" ? "a" : "div";
  const linkProps = Tag === "a" ? {
    href,
    ...(download && { download: true }),
    target: (download || href.startsWith("mailto")) ? undefined : "_blank",
    rel: "noopener noreferrer",
  } : {};

  // Color scheme adapts to light or dark context
  const borderColor = dark 
    ? `rgba(255, 255, 255, ${hover ? 0.25 : 0.12})`
    : `rgba(255, 255, 255, ${hover ? 0.45 : 0.35})`;
  
  const bgColor = dark
    ? `rgba(255, 255, 255, ${hover ? 0.1 : 0.06})`
    : `rgba(255, 255, 255, ${hover ? 0.18 : 0.12})`;

  const textColor = dark
    ? "rgba(255, 255, 255, 0.9)"
    : "rgba(30, 28, 26, 0.85)";

  const shadowColor = dark
    ? "rgba(0, 0, 0, 0.3)"
    : "rgba(0, 0, 0, 0.08)";

  return (
    <Tag
      {...linkProps}
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px 40px",
        position: "relative",
        cursor: "pointer",
        textDecoration: "none",
        borderRadius: 16,
        overflow: "hidden",

        // ── Frosted glass ──
        background: bgColor,
        backdropFilter: "blur(28px) saturate(1.6) brightness(1.1)",
        WebkitBackdropFilter: "blur(28px) saturate(1.6) brightness(1.1)",

        // ── Border ──
        border: `1px solid ${borderColor}`,

        // ── Shadow for depth ──
        boxShadow: [
          `0 4px 16px ${shadowColor}`,
          `0 1px 4px ${shadowColor}`,
          "inset 0 1px 0 0 rgba(255, 255, 255, 0.25)",
          "inset 0 -0.5px 0 0 rgba(0, 0, 0, 0.04)",
        ].join(", "),

        // ── 3D Transform ──
        transform: hover
          ? `perspective(600px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) translateX(${tilt.tx}px) translateY(${tilt.ty}px) scale(1.03)`
          : "perspective(600px) rotateX(0deg) rotateY(0deg) scale(1)",
        transformStyle: "preserve-3d",
        transition: hover
          ? "transform 0.15s cubic-bezier(0.03, 0.98, 0.52, 0.99), background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease"
          : "transform 0.4s cubic-bezier(0.03, 0.98, 0.52, 0.99), background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",

        userSelect: "none",
        WebkitUserSelect: "none",
      }}
    >
      {/* ── Specular light highlight ── */}
      <div style={{
        position: "absolute",
        inset: 0,
        borderRadius: 16,
        background: `radial-gradient(
          ellipse 100% 70% at ${tilt.mx}% ${tilt.my}%, 
          rgba(255, 255, 255, ${hover ? 0.3 : 0}) 0%, 
          rgba(255, 255, 255, ${hover ? 0.08 : 0}) 40%, 
          transparent 65%
        )`,
        transition: "background 0.3s ease",
        pointerEvents: "none",
      }} />

      {/* ── Top edge glint ── */}
      <div style={{
        position: "absolute",
        top: 0,
        left: "15%",
        right: "15%",
        height: "1px",
        background: `linear-gradient(90deg, transparent, rgba(255,255,255,${dark ? 0.3 : 0.6}), transparent)`,
        pointerEvents: "none",
      }} />

      {/* ── Text ── */}
      <span style={{
        position: "relative",
        zIndex: 1,
        fontFamily: "'JetBrains Mono', 'SF Mono', 'Fira Code', monospace",
        fontSize: 12,
        fontWeight: 500,
        letterSpacing: 2.5,
        textTransform: "uppercase",
        color: textColor,
        transition: "color 0.3s ease",
      }}>
        {children}
      </span>
    </Tag>
  );
}
