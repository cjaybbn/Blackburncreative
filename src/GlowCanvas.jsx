import { useRef, useEffect, useCallback } from "react";
import { createNoise3D } from "simplex-noise";

const PAD = 0;
const SAMPLE_STEP = 3;
const SCALE = 0.008;
const BLUR = "25px";
const DPR = 2;
const HOVER_LERP_DURATION = 0.3;

export default function GlowCanvas({
  wrapperRef,
  mouseX = 50,
  mouseY = 50,
  isHovered = false,
  seed = 0,
  startDelayMs = 1200,
  borderRadius = 24,
}) {
  const radiusPx = typeof borderRadius === "number" ? `${borderRadius}px` : borderRadius;
  const canvasRef = useRef(null);
  const offRef = useRef(null);
  const rafRef = useRef(null);
  const startTimeRef = useRef(null);
  const lastTimeRef = useRef(0);
  const hoverLerpRef = useRef(0);
  const visibleRef = useRef(true);
  const noiseRef = useRef(null);
  const propsRef = useRef({ mouseX, mouseY, isHovered, seed });
  propsRef.current = { mouseX, mouseY, isHovered, seed };

  const draw = useCallback((ctx, offCtx, w, h, time) => {
    const centerX = w / 2;
    const centerY = h / 2;
    const maxDist = Math.sqrt(centerX * centerX + centerY * centerY);
    const cursorRadius = maxDist * 0.55;
    const noise3D = noiseRef.current;
    if (!noise3D) return;

    const dt = time - lastTimeRef.current;
    lastTimeRef.current = time;
    const { mouseX: mx, mouseY: my, isHovered: hovered, seed: sd } = propsRef.current;
    const lerpRate = 1 / HOVER_LERP_DURATION;
    if (hovered) {
      hoverLerpRef.current = Math.min(1, hoverLerpRef.current + dt * lerpRate);
    } else {
      hoverLerpRef.current = Math.max(0, hoverLerpRef.current - dt * lerpRate);
    }
    const hoverLerp = hoverLerpRef.current;

    const mousePx = (mx / 100) * w;
    const mousePy = (my / 100) * h;
    const timeZ = hovered ? (time + sd) * 0.5 : (time + sd) * 0.3;
    const pull = hovered ? 0.3 : 0;
    const brightness = hovered ? 2.5 : 1;
    const baseAlphaMultiplier = 1.35 * brightness;

      const imageData = offCtx.createImageData(w, h);
      const data = imageData.data;

      for (let py = 0; py < h; py += SAMPLE_STEP) {
        for (let px = 0; px < w; px += SAMPLE_STEP) {
          const sx = pull ? (px + (mousePx - px) * pull) * SCALE : px * SCALE;
          const sy = pull ? (py + (mousePy - py) * pull) * SCALE : py * SCALE;
          const n = noise3D(sx, sy, timeZ);

          const distFromCenter = Math.sqrt((px - centerX) ** 2 + (py - centerY) ** 2);
          const distFromCenterNorm = Math.min(1, distFromCenter / maxDist);
          const edgeFactor = Math.pow(distFromCenterNorm, 2);

          const distFromCursor = Math.sqrt((px - mousePx) ** 2 + (py - mousePy) ** 2);
          const cursorFactor = Math.max(0, 1 - distFromCursor / cursorRadius);
          const cursorAlpha = Math.pow(cursorFactor, 1.5);

          const alphaMultiplier = (1 - hoverLerp) * edgeFactor + hoverLerp * cursorAlpha;
          const baseAlpha = baseAlphaMultiplier * alphaMultiplier;

          let r = 0,
            g = 0,
            b = 0,
            a = 0;
          if (n < -0.3) {
            a = 0;
          } else if (n < 0) {
            const t = (n + 0.3) / 0.3;
            r = 255;
            g = 107;
            b = 107;
            a = Math.min(255, Math.round(255 * baseAlpha * t * 1.65));
          } else if (n < 0.3) {
            const t = n / 0.3;
            r = 232;
            g = 145;
            b = 184;
            a = Math.min(255, Math.round(255 * baseAlpha * t * 1.65));
          } else {
            const t = Math.min(1, (n - 0.3) / 0.4);
            r = 184;
            g = 165;
            b = 232;
            a = Math.min(255, Math.round(255 * baseAlpha * t * 1.65));
          }

          for (let dy = 0; dy < SAMPLE_STEP && py + dy < h; dy++) {
            for (let dx = 0; dx < SAMPLE_STEP && px + dx < w; dx++) {
              const idx = ((py + dy) * w + (px + dx)) * 4;
              data[idx] = r;
              data[idx + 1] = g;
              data[idx + 2] = b;
              data[idx + 3] = a;
            }
          }
        }
      }

      offCtx.putImageData(imageData, 0, 0);
      ctx.filter = `blur(${BLUR})`;
      ctx.drawImage(offRef.current, 0, 0);
      ctx.filter = "none";
  }, []);

  useEffect(() => {
    noiseRef.current = createNoise3D();
  }, []);

  useEffect(() => {
    const wrapper = wrapperRef?.current;
    const canvas = canvasRef.current;
    if (!wrapper || !canvas) return;

    const resize = () => {
      const rect = wrapper.getBoundingClientRect();
      const w = Math.round(rect.width + PAD * 2);
      const h = Math.round(rect.height + PAD * 2);
      const w2 = w * DPR;
      const h2 = h * DPR;

      canvas.width = w2;
      canvas.height = h2;

      if (!offRef.current) {
        offRef.current = document.createElement("canvas");
      }
      offRef.current.width = w2;
      offRef.current.height = h2;
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrapper);

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          visibleRef.current = e.isIntersecting;
        });
      },
      { threshold: 0 }
    );
    io.observe(wrapper);

    return () => {
      ro.disconnect();
      io.disconnect();
    };
  }, [wrapperRef]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !offRef.current) return;

    const ctx = canvas.getContext("2d");
    const offCtx = offRef.current.getContext("2d");
    if (!ctx || !offCtx) return;

    let delayDone = false;
    const delayTimer = setTimeout(() => {
      delayDone = true;
      startTimeRef.current = performance.now();
    }, startDelayMs);

    const loop = () => {
      rafRef.current = requestAnimationFrame(loop);
      if (!delayDone || !visibleRef.current) return;

      const time = (performance.now() - (startTimeRef.current ?? performance.now())) / 1000;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      draw(ctx, offCtx, w, h, time);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      clearTimeout(delayTimer);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [startDelayMs]);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        borderRadius: radiusPx,
        zIndex: -1,
        pointerEvents: "none",
        opacity: 0,
        animation: "glowCanvasReveal 3s ease-out forwards",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
          borderRadius: radiusPx,
          filter: "blur(25px)",
          opacity: isHovered ? 1.0 : 0.75,
          transition: "opacity 0.4s ease",
          pointerEvents: "none",
        }}
        aria-hidden
      />
    </div>
  );
}
