import { useEffect, useState } from "react";

/*
 * HeroBackground — Vibrant abstract gradient mesh
 * 
 * Colorful, organic flowing shapes that give the frosted glass 
 * buttons something rich to refract against — like the iOS 
 * Control Center glass over a wallpaper.
 *
 * Palette derived from CB coral (#E05B5B) plus complementary tones.
 */

export default function HeroBackground() {
  const [time, setTime] = useState(0);

  useEffect(() => {
    let raf;
    const start = Date.now();
    const tick = () => {
      setTime((Date.now() - start) / 1000);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Very slow organic drift
  const d1x = Math.sin(time * 0.06) * 40;
  const d1y = Math.cos(time * 0.04) * 30;
  const d2x = Math.cos(time * 0.05) * 35;
  const d2y = Math.sin(time * 0.07) * 25;
  const d3x = Math.sin(time * 0.04) * 30;
  const d3y = Math.cos(time * 0.06) * 35;
  const d4x = Math.cos(time * 0.03) * 25;
  const d4y = Math.sin(time * 0.05) * 20;

  return (
    <div style={{
      position: "absolute",
      inset: 0,
      zIndex: 0,
      overflowX: "hidden",
      overflowY: "visible",
    }}>
      {/* Base — warm light cream */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(145deg, #FDF6F0 0%, #F8EDE4 30%, #F0E4DA 60%, #FDF6F0 100%)",
      }} />

      {/* Orb 1 — Coral/salmon (primary brand color) */}
      <div style={{
        position: "absolute",
        width: "55%",
        height: "70%",
        top: "10%",
        right: "-5%",
        transform: `translate(${d1x}px, ${d1y}px)`,
        background: "radial-gradient(ellipse at center, rgba(224, 91, 91, 0.55) 0%, rgba(224, 91, 91, 0.2) 40%, transparent 70%)",
        filter: "blur(60px)",
        pointerEvents: "none",
      }} />

      {/* Orb 2 — Soft peach/apricot */}
      <div style={{
        position: "absolute",
        width: "50%",
        height: "60%",
        top: "25%",
        left: "-5%",
        transform: `translate(${d2x}px, ${d2y}px)`,
        background: "radial-gradient(ellipse at center, rgba(245, 166, 120, 0.5) 0%, rgba(245, 166, 120, 0.15) 45%, transparent 70%)",
        filter: "blur(55px)",
        pointerEvents: "none",
      }} />

      {/* Orb 3 — Dusty rose / mauve */}
      <div style={{
        position: "absolute",
        width: "45%",
        height: "55%",
        top: "5%",
        left: "25%",
        transform: `translate(${d3x}px, ${d3y}px)`,
        background: "radial-gradient(ellipse at center, rgba(200, 130, 155, 0.45) 0%, rgba(200, 130, 155, 0.1) 45%, transparent 70%)",
        filter: "blur(50px)",
        pointerEvents: "none",
      }} />

      {/* Orb 4 — Cool lavender (contrast) */}
      <div style={{
        position: "absolute",
        width: "35%",
        height: "45%",
        bottom: "5%",
        right: "15%",
        transform: `translate(${d4x}px, ${d4y}px)`,
        background: "radial-gradient(ellipse at center, rgba(160, 140, 200, 0.3) 0%, rgba(160, 140, 200, 0.08) 45%, transparent 70%)",
        filter: "blur(45px)",
        pointerEvents: "none",
      }} />

      {/* Orb 5 — Warm highlight (top) */}
      <div style={{
        position: "absolute",
        width: "40%",
        height: "35%",
        top: "-8%",
        left: "10%",
        background: "radial-gradient(ellipse at center, rgba(255, 220, 190, 0.5) 0%, transparent 65%)",
        filter: "blur(50px)",
        pointerEvents: "none",
      }} />

      {/* Orb 6 — Deep coral accent (bottom left) */}
      <div style={{
        position: "absolute",
        width: "30%",
        height: "40%",
        bottom: "10%",
        left: "-5%",
        transform: `translate(${-d1x * 0.5}px, ${-d1y * 0.5}px)`,
        background: "radial-gradient(ellipse at center, rgba(200, 70, 70, 0.3) 0%, transparent 60%)",
        filter: "blur(50px)",
        pointerEvents: "none",
      }} />

      {/* Soft overall blur to blend everything smoothly */}
      <div style={{
        position: "absolute",
        inset: 0,
        backdropFilter: "blur(2px)",
        WebkitBackdropFilter: "blur(2px)",
        pointerEvents: "none",
      }} />

      {/* Very subtle noise for texture (barely visible) */}
      <div style={{
        position: "absolute",
        inset: 0,
        opacity: 0.03,
        mixBlendMode: "multiply",
        pointerEvents: "none",
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='256' height='256' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E")`,
        backgroundSize: "128px 128px",
      }} />

      {/* Bottom fade into the page background */}
      <div style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: "35%",
        background: "linear-gradient(to bottom, transparent 0%, #F4F1EC 100%)",
        pointerEvents: "none",
      }} />
    </div>
  );
}
