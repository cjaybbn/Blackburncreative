import { useState, useRef, useCallback } from "react";
import GlowCanvas from "./GlowCanvas";

/*
 * GlassButton — Clear glass panel with canvas-based Siri-like glow + white bezel
 *
 * Layer order (back to front):
 * 1. GlowCanvas (simplex noise, organic morphing glow behind button)
 * 2. Button glass (frosted, overflow hidden)
 * 3. White bezel border + inset reflection
 * 4. Specular highlight (hover only, follows cursor)
 * 5. Text
 */

const BORDER_RADIUS = 16;

export default function GlassButton({
  children = "Get in touch",
  href = "#",
  onClick,
  dark = false,
  download = false,
  animationDelay = 0,
  index = 0,
}) {
  const ref = useRef(null);
  const wrapperRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, tx: 0, ty: 0, mx: 50, my: 50 });

  const seed = index * 100;

  const handleWrapperMouseMove = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  }, []);

  const handleWrapperMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleWrapperMouseLeave = useCallback(() => {
    setIsHovered(false);
    setMousePos({ x: 50, y: 50 });
  }, []);

  const handleButtonMouseMove = useCallback((e) => {
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

  const handleButtonMouseLeave = useCallback(() => {
    setTilt({ rx: 0, ry: 0, tx: 0, ty: 0, mx: 50, my: 50 });
  }, []);

  const Tag = href && href !== "#" ? "a" : "div";
  const linkProps = Tag === "a" ? {
    href,
    ...(download && { download: true }),
    target: (download || href.startsWith("mailto")) ? undefined : "_blank",
    rel: "noopener noreferrer",
  } : {};

  const textColor = dark
    ? "rgba(255, 255, 255, 0.9)"
    : "rgba(30, 28, 26, 0.85)";

  return (
    <div
      ref={wrapperRef}
      onMouseMove={handleWrapperMouseMove}
      onMouseEnter={handleWrapperMouseEnter}
      onMouseLeave={handleWrapperMouseLeave}
      style={{
        position: "relative",
        display: "inline-flex",
        overflow: "hidden",
        opacity: 0,
        animation: "buttonMaterialize 3s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        animationDelay: `${animationDelay}s`,
      }}
    >
      {/* LAYER 1 + 2 — Button glass (glow inside so it tilts/lifts with button) */}
      <Tag
        {...linkProps}
        ref={ref}
        onClick={onClick}
        onMouseMove={handleButtonMouseMove}
        onMouseLeave={handleButtonMouseLeave}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "16px 40px",
          position: "relative",
          cursor: "pointer",
          textDecoration: "none",
          borderRadius: BORDER_RADIUS,
          overflow: "hidden",

          background: isHovered ? "rgba(255, 255, 255, 0.15)" : "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(24px) saturate(1.5)",
          WebkitBackdropFilter: "blur(24px) saturate(1.5)",
          border: isHovered ? "1.5px solid rgba(255,255,255,0.6)" : "1.5px solid rgba(255, 255, 255, 0.45)",
          boxShadow: isHovered
            ? "inset 0 1px 0 0 rgba(255,255,255,0.4), inset 0 -0.5px 0 0 rgba(255,255,255,0.1), 0 12px 40px rgba(224, 91, 91, 0.12)"
            : "inset 0 1px 0 0 rgba(255,255,255,0.4), inset 0 -0.5px 0 0 rgba(255,255,255,0.1)",

          transform: isHovered
            ? `perspective(600px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) translateX(${tilt.tx}px) translateY(${tilt.ty - 3}px) scale(1.04)`
            : "perspective(600px) rotateX(0deg) rotateY(0deg) scale(1)",
          transformStyle: "preserve-3d",
          transition: isHovered ? "all 0.35s cubic-bezier(0.22, 1, 0.36, 1)" : "all 0.5s ease",

          userSelect: "none",
          WebkitUserSelect: "none",
        }}
      >
        {/* Glow canvas: same size as button, moves with tilt/lift */}
        <GlowCanvas
          wrapperRef={ref}
          mouseX={mousePos.x}
          mouseY={mousePos.y}
          isHovered={isHovered}
          seed={seed}
          startDelayMs={1200}
        />
        {/* LAYER 4 — Specular highlight (hover only, very subtle) */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: BORDER_RADIUS,
            background: `radial-gradient(
              ellipse 100% 70% at ${tilt.mx}% ${tilt.my}%,
              rgba(255, 255, 255, ${isHovered ? 0.12 : 0}) 0%,
              transparent 65%
            )`,
            transition: "background 0.3s ease",
            pointerEvents: "none",
          }}
        />

        {/* LAYER 5 — Text */}
        <span
          style={{
            position: "relative",
            zIndex: 1,
            fontFamily: "'JetBrains Mono', 'SF Mono', 'Fira Code', monospace",
            fontSize: 12,
            fontWeight: 500,
            letterSpacing: 2.5,
            textTransform: "uppercase",
            color: textColor,
            textShadow: "0 1px 3px rgba(0,0,0,0.1)",
            transition: "color 0.3s ease",
          }}
        >
          {children}
        </span>
      </Tag>
    </div>
  );
}
