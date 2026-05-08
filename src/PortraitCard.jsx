import { useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import "./PortraitCard.css";

/**
 * Tuning knobs (see also PortraitCard.css):
 * - ease (below) — lower = floatier, higher = snappier
 * - MAX_TILT — degrees of rotation at card edge
 * - Glare: mix-blend-mode overlay | screen | soft-light; gradient stops for intensity
 */
const EASE = 0.12;
const MAX_TILT = 15;

export default function PortraitCard({
  src = "/headshot.png",
  alt = "Camden Blackburn",
  className = "",
}) {
  const cardRef = useRef(null);
  const glareRef = useRef(null);
  const rafRef = useRef(null);
  const targetRef = useRef({ x: 0, y: 0, glareX: 50, glareY: 50 });
  const currentRef = useRef({ x: 0, y: 0, glareX: 50, glareY: 50 });
  const isHoveringRef = useRef(false);
  const leaveTimerRef = useRef(null);

  const animate = useCallback(() => {
    const c = currentRef.current;
    const t = targetRef.current;

    c.x += (t.x - c.x) * EASE;
    c.y += (t.y - c.y) * EASE;
    c.glareX += (t.glareX - c.glareX) * EASE;
    c.glareY += (t.glareY - c.glareY) * EASE;

    if (cardRef.current) {
      cardRef.current.style.setProperty("--rx", `${c.y}deg`);
      cardRef.current.style.setProperty("--ry", `${c.x}deg`);
    }
    if (glareRef.current) {
      glareRef.current.style.setProperty("--gx", `${c.glareX}%`);
      glareRef.current.style.setProperty("--gy", `${c.glareY}%`);
    }

    rafRef.current = requestAnimationFrame(animate);
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const rect = cardRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;

    targetRef.current.glareX = px * 100;
    targetRef.current.glareY = py * 100;

    if (reduced) return;

    targetRef.current.x = (px - 0.5) * MAX_TILT * 2;
    targetRef.current.y = (0.5 - py) * MAX_TILT * 2;
  }, []);

  const handleMouseEnter = useCallback(() => {
    isHoveringRef.current = true;
    if (leaveTimerRef.current) {
      window.clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }
    if (cardRef.current) {
      cardRef.current.style.willChange = "transform";
    }
    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(animate);
    }
  }, [animate]);

  const handleMouseLeave = useCallback(() => {
    isHoveringRef.current = false;
    targetRef.current.x = 0;
    targetRef.current.y = 0;
    targetRef.current.glareX = 50;
    targetRef.current.glareY = 50;

    if (leaveTimerRef.current) {
      window.clearTimeout(leaveTimerRef.current);
    }
    leaveTimerRef.current = window.setTimeout(() => {
      leaveTimerRef.current = null;
      if (!isHoveringRef.current && rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
        if (cardRef.current) {
          cardRef.current.style.willChange = "auto";
          cardRef.current.style.setProperty("--rx", "0deg");
          cardRef.current.style.setProperty("--ry", "0deg");
        }
        if (glareRef.current) {
          glareRef.current.style.setProperty("--gx", "50%");
          glareRef.current.style.setProperty("--gy", "50%");
        }
        currentRef.current = { x: 0, y: 0, glareX: 50, glareY: 50 };
      }
    }, 600);
  }, []);

  useEffect(() => {
    return () => {
      if (leaveTimerRef.current) {
        window.clearTimeout(leaveTimerRef.current);
      }
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, []);

  return (
    <div className={`portrait-perspective hero-headshot-inner ${className}`.trim()}>
      <motion.div
        ref={cardRef}
        className="portrait-card"
        initial={false}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        whileHover={{ borderRadius: "50%" }}
        transition={{ borderRadius: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }}
      >
        <img src={src} alt={alt} loading="eager" fetchPriority="high" />
        <div className="portrait-card-coral" aria-hidden />
        <div ref={glareRef} className="portrait-glare" aria-hidden />
      </motion.div>
    </div>
  );
}
