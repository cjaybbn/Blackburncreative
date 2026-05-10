import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { C, FONT, viewport, staggerContainer, staggerItem } from "./theme.js";

/** Ms per character for process-detail typewriter (single source for delay math). */
const PROCESS_DETAIL_TYPED_MS = 38;

function AnimatedNumber({ value, suffix = "", prefix = "", duration = 1.5 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const numValue = parseInt(value.toString().replace(/[^0-9]/g, ""), 10) || 0;
    const startTime = Date.now();
    const tick = () => {
      const elapsed = (Date.now() - startTime) / (duration * 1000);
      if (elapsed >= 1) {
        setDisplay(numValue);
        return;
      }
      const eased = 1 - Math.pow(1 - elapsed, 3);
      setDisplay(Math.floor(numValue * eased));
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [isInView, value, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {isInView ? display.toLocaleString() : "0"}
      {suffix}
    </span>
  );
}

/** Coral headline with typewriter reveal — used when KPI count-up is not appropriate. */
function TypedCoralHeading({ text, runKey, charDelayMs = PROCESS_DETAIL_TYPED_MS }) {
  const full = text || "";
  const [visibleLen, setVisibleLen] = useState(0);

  useEffect(() => {
    setVisibleLen(0);
    if (!full.length) return;
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setVisibleLen(Math.min(i, full.length));
      if (i >= full.length) window.clearInterval(id);
    }, charDelayMs);
    return () => window.clearInterval(id);
  }, [full, runKey, charDelayMs]);

  if (!full.length) return null;

  const done = visibleLen >= full.length;
  const slice = full.slice(0, visibleLen);

  return (
    <div
      aria-live="polite"
      style={{
        fontFamily: FONT.display,
        fontSize: "clamp(26px, 3.6vw, 34px)",
        fontWeight: 700,
        fontStyle: "italic",
        color: "#E05B5B",
        lineHeight: 1.2,
        marginBottom: 6,
        minHeight: "1.15em",
      }}
    >
      {slice}
      {!done ? (
        <span
          aria-hidden
          style={{
            display: "inline-block",
            marginLeft: 2,
            fontWeight: 400,
            fontStyle: "normal",
            animation: "typedCaretBlink 0.95s steps(1, end) infinite",
          }}
        >
          |
        </span>
      ) : null}
    </div>
  );
}

const Reveal = ({ children, delay = 0, direction = "up", glowText = false }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const directions = {
    up: { y: 40, x: 0 },
    down: { y: -40, x: 0 },
    left: { y: 0, x: -40 },
    right: { y: 0, x: 40 },
    none: { y: 0, x: 0 },
  };

  const content =
    glowText && React.isValidElement(children)
      ? React.cloneElement(children, {
          style: {
            ...children.props?.style,
            ...(isInView ? { animation: `coralGlow 1.2s ease ${delay + 0.1}s both` } : {}),
          },
        })
      : children;

  return (
    <motion.div
      ref={ref}
      style={{
        overflow: "visible",
        overflowX: "visible",
        overflowY: "visible",
      }}
      initial={{ opacity: 0, ...directions[direction] }}
      animate={isInView ? { opacity: 1, y: 0, x: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {content}
    </motion.div>
  );
};

/**
 * Same visual hierarchy and motion patterns as the RealCopy section.
 * @param {boolean} [embedded=true] — on home page (full vertical padding); false = no outer vertical padding.
 * @param {boolean} [inline=false] — accordion under Professional Work: tighter rhythm + mobile-friendly process panel.
 */
export default function CaseStudyLayout({
  study,
  badgeLabel = "Case Study",
  headingId,
  embedded = true,
  inline = false,
  onClose,
}) {
  const [activeStep, setActiveStep] = useState(0);
  const process = study.process || [];
  /** Must stay parallel to `process` (same length/order): panel uses `processDetails[activeStep]` with `process[activeStep]`. */
  const processDetails = study.processDetails || [];
  const figures = study.figures || [];
  const links = study.links || [];
  const heroAsideMedia = study.heroAsideMedia;
  const heroAsideSrc =
    heroAsideMedia && typeof heroAsideMedia.src === "string" && heroAsideMedia.src.trim() !== ""
      ? heroAsideMedia.src.trim()
      : null;
  const heroAsideMaxW =
    typeof heroAsideMedia?.maxWidth === "string" && heroAsideMedia.maxWidth.trim() !== ""
      ? heroAsideMedia.maxWidth.trim()
      : null;
  const heroAsideMaxH =
    typeof heroAsideMedia?.maxHeight === "string" && heroAsideMedia.maxHeight.trim() !== ""
      ? heroAsideMedia.maxHeight.trim()
      : null;

  const outerPadding = inline
    ? "clamp(20px, 4vw, 36px) 0 clamp(28px, 5vw, 48px)"
    : embedded
      ? "100px 0"
      : "0";

  const innerPadX = inline ? "clamp(24px, 5.5vw, 56px)" : "40px";

  return (
    <>
      <style>{`
        @keyframes coralGlow {
          0% { color: inherit; text-shadow: none; }
          15% { color: #E05B5B; text-shadow: 0 0 24px rgba(224, 91, 91, 0.5); }
          35% { color: #E05B5B; text-shadow: 0 0 16px rgba(224, 91, 91, 0.35); }
          100% { color: inherit; text-shadow: none; }
        }
        @keyframes typedCaretBlink {
          0%, 45% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
        .case-study--inline .two-col {
          margin-bottom: clamp(28px, 5vw, 48px);
        }
        @media (max-width: 900px) {
          .case-study--inline .two-col {
            grid-template-columns: 1fr !important;
            gap: 28px !important;
          }
        }
        @media (max-width: 768px) {
          .case-study--inline .case-study-inline-head {
            flex-wrap: wrap;
            gap: 10px;
          }
          .case-study--inline .process-grid {
            grid-template-columns: 1fr !important;
            gap: 28px !important;
          }
          .case-study--inline .process-detail-panel {
            display: block !important;
            position: static !important;
            top: auto !important;
            min-height: 0 !important;
            padding: clamp(22px, 5.5vw, 32px) clamp(22px, 5vw, 36px) !important;
          }
        }
      `}</style>
      <motion.div
        className={inline ? "case-study--inline" : undefined}
        style={{
          background: "#141416",
          color: C.inkOnDark,
          padding: outerPadding,
          margin: 0,
        }}
        role="region"
        aria-label={study.name}
      >
        {inline && onClose ? (
          <div
            className="case-study-inline-head"
            style={{
              maxWidth: 1200,
              margin: "0 auto",
              padding: `0 ${innerPadX} clamp(12px, 2vw, 16px)`,
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label={`Close ${study.name} case study`}
              style={{
                fontFamily: FONT.mono,
                fontSize: 11,
                letterSpacing: 1.5,
                textTransform: "uppercase",
                color: C.inkOnDark,
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.22)",
                borderRadius: 8,
                padding: "10px 18px",
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
        ) : null}
        <motion.div
          style={{ maxWidth: 1200, margin: "0 auto", padding: `0 ${innerPadX}` }}
          className={inline ? undefined : "section-padding"}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          <Reveal>
            <motion.div
              variants={staggerItem}
              style={{
                fontFamily: FONT.mono,
                fontSize: 10,
                fontWeight: 500,
                letterSpacing: 3,
                textTransform: "uppercase",
                color: C.accent,
                marginBottom: 20,
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div style={{ width: 20, height: 1, background: C.accent }} />
              {badgeLabel}
            </motion.div>
          </Reveal>

          <motion.div
            className="two-col"
            variants={staggerItem}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: inline ? 40 : 60,
              marginBottom: inline ? 40 : 60,
            }}
          >
            <div>
              <Reveal delay={0.1}>
                <h2
                  id={headingId}
                  className="case-study-title"
                  style={{
                    fontFamily: FONT.display,
                    fontSize: 52,
                    fontWeight: 400,
                    fontStyle: "italic",
                    lineHeight: 1.1,
                    marginBottom: 12,
                  }}
                >
                  {study.name}
                </h2>
              </Reveal>
              <Reveal delay={0.15}>
                <div
                  style={{
                    fontFamily: FONT.mono,
                    fontSize: 11,
                    letterSpacing: 1,
                    color: C.accent,
                    marginBottom: 24,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.accent }} />
                  {study.status}
                </div>
              </Reveal>
              <Reveal delay={0.2} glowText>
                <p
                  style={{
                    fontFamily: FONT.body,
                    fontSize: 16,
                    lineHeight: 1.8,
                    color: C.inkOnDarkMuted,
                    maxWidth: inline ? 560 : 500,
                  }}
                >
                  {study.description}
                </p>
              </Reveal>
            </div>

            <Reveal delay={0.1} direction="right">
              <div>
                <div
                  style={{
                    fontFamily: FONT.mono,
                    fontSize: 10,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    color: C.inkOnDarkFaint,
                    marginBottom: 16,
                  }}
                >
                  Tech Stack
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {(study.stack || []).map((s) => (
                    <motion.span
                      key={s}
                      style={{
                        fontFamily: FONT.mono,
                        fontSize: 11,
                        fontWeight: 500,
                        color: C.inkOnDarkMuted,
                        background: "rgba(150, 150, 150, 0.2)",
                        border: "1px solid rgba(150, 150, 150, 0.25)",
                        padding: "6px 14px",
                        borderRadius: inline ? 8 : 2,
                      }}
                      whileHover={{ y: -2 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                    >
                      {s}
                    </motion.span>
                  ))}
                </div>

                {heroAsideSrc ? (
                  <div
                    style={{
                      marginTop: 26,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      gap: 10,
                      maxWidth: "100%",
                    }}
                  >
                    <div
                      style={{
                        borderRadius: 10,
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        background: "rgba(0, 0, 0, 0.25)",
                        padding: 8,
                        lineHeight: 0,
                        maxWidth: "100%",
                      }}
                    >
                      <img
                        src={heroAsideSrc}
                        alt={
                          typeof heroAsideMedia.alt === "string" && heroAsideMedia.alt.trim() !== ""
                            ? heroAsideMedia.alt.trim()
                            : `${study.name} — supporting visual`
                        }
                        loading="lazy"
                        decoding="async"
                        style={{
                          width: "auto",
                          maxWidth: heroAsideMaxW ?? "min(200px, 100%)",
                          maxHeight: heroAsideMaxH ?? "none",
                          height: "auto",
                          display: "block",
                          objectFit: "contain",
                        }}
                      />
                    </div>
                    {typeof heroAsideMedia.caption === "string" && heroAsideMedia.caption.trim() !== "" ? (
                      <p
                        style={{
                          fontFamily: FONT.body,
                          fontSize: 12,
                          lineHeight: 1.55,
                          color: C.inkOnDarkSubtle,
                          margin: 0,
                          maxWidth: 320,
                        }}
                      >
                        {heroAsideMedia.caption.trim()}
                      </p>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </Reveal>
          </motion.div>

          {figures.length > 0 ? (
            <motion.div
              variants={staggerItem}
              style={{
                display: "grid",
                gap: 28,
                marginBottom: inline ? 36 : 56,
                maxWidth: inline ? "100%" : 920,
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              {figures.map((fig, i) => {
                const figMaxW =
                  typeof fig.maxWidth === "string" && fig.maxWidth.trim() !== ""
                    ? fig.maxWidth.trim()
                    : null;
                const figMaxH =
                  typeof fig.maxHeight === "string" && fig.maxHeight.trim() !== ""
                    ? fig.maxHeight.trim()
                    : null;
                const figConstrain = Boolean(figMaxW || figMaxH);
                return (
                <Reveal key={`${fig.src}-${i}`} delay={0.06 * i}>
                  <figure
                    style={{
                      margin: 0,
                      borderRadius: 12,
                      overflow: "hidden",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      background: "rgba(0, 0, 0, 0.2)",
                      ...(figConstrain
                        ? {
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                          }
                        : {}),
                    }}
                  >
                    <img
                      src={fig.src}
                      alt={fig.alt}
                      loading="lazy"
                      decoding="async"
                      style={{
                        ...(figConstrain
                          ? {
                              width: "auto",
                              maxWidth: figMaxW ?? "100%",
                              maxHeight: figMaxH ?? "none",
                              height: "auto",
                              objectFit: "contain",
                            }
                          : {
                              width: "100%",
                              height: "auto",
                            }),
                        display: "block",
                        verticalAlign: "middle",
                      }}
                    />
                    {fig.caption ? (
                      <figcaption
                        style={{
                          fontFamily: FONT.body,
                          fontSize: 14,
                          lineHeight: 1.65,
                          color: C.inkOnDarkSubtle,
                          padding: "14px 18px 16px",
                          borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                        }}
                      >
                        {fig.caption}
                      </figcaption>
                    ) : null}
                  </figure>
                </Reveal>
              );
              })}
            </motion.div>
          ) : null}

          {links.length > 0 ? (
            <motion.div
              variants={staggerItem}
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 12,
                alignItems: "center",
                marginBottom: inline ? 28 : 40,
                maxWidth: inline ? "100%" : 920,
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontFamily: FONT.mono,
                    fontSize: 11,
                    fontWeight: 500,
                    letterSpacing: 1.2,
                    textTransform: "uppercase",
                    color: C.accent,
                    textDecoration: "none",
                    padding: "10px 16px",
                    borderRadius: 8,
                    border: "1px solid rgba(224, 91, 91, 0.35)",
                    background: "rgba(224, 91, 91, 0.08)",
                    transition: "background 0.2s ease, border-color 0.2s ease, color 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(224, 91, 91, 0.16)";
                    e.currentTarget.style.borderColor = "rgba(224, 91, 91, 0.55)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(224, 91, 91, 0.08)";
                    e.currentTarget.style.borderColor = "rgba(224, 91, 91, 0.35)";
                  }}
                >
                  {link.label}
                  <span style={{ marginLeft: 6, opacity: 0.85 }} aria-hidden>
                    ↗
                  </span>
                </a>
              ))}
            </motion.div>
          ) : null}

          <motion.div
            variants={staggerItem}
            style={{
              fontFamily: FONT.mono,
              fontSize: 10,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: C.inkOnDarkFaint,
              marginBottom: 32,
            }}
          >
            Development Process
          </motion.div>
          <motion.div
            variants={staggerItem}
            className="process-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "55% 45%",
              gap: inline ? 48 : 40,
              alignItems: "start",
            }}
          >
            <div style={{ maxWidth: inline ? "min(100%, 640px)" : 600 }}>
              {process.map((step, i) => {
                const isActive = activeStep === i;
                return (
                  <Reveal key={i} delay={0.08 * i}>
                    <div
                      onMouseEnter={() => setActiveStep(i)}
                      onFocus={() => setActiveStep(i)}
                      style={{
                        display: "flex",
                        gap: inline ? 28 : 24,
                        position: "relative",
                        marginBottom: i < process.length - 1 ? 10 : 0,
                        padding: inline ? "20px 26px 20px 24px" : "16px 20px",
                        borderRadius: inline ? 16 : 8,
                        transition: "background 0.28s ease, border-color 0.28s ease, box-shadow 0.28s ease, transform 0.28s ease",
                        cursor: "default",
                        border: isActive
                          ? "1px solid rgba(224, 91, 91, 0.28)"
                          : "1px solid transparent",
                        background: isActive ? "rgba(224, 91, 91, 0.09)" : "transparent",
                        boxShadow: isActive
                          ? "0 8px 28px rgba(0, 0, 0, 0.22), inset 0 1px 0 rgba(255, 255, 255, 0.04)"
                          : "none",
                        transform: isActive && inline ? "translateY(-1px)" : "none",
                      }}
                    >
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 22, flexShrink: 0 }}>
                        <div
                          style={{
                            width: isActive ? 12 : 10,
                            height: isActive ? 12 : 10,
                            borderRadius: "50%",
                            background: isActive ? "#E05B5B" : C.accent,
                            border: `2px solid ${C.inkOnDark}`,
                            boxShadow: isActive
                              ? "0 0 0 2px #E05B5B, 0 0 14px rgba(224, 91, 91, 0.45)"
                              : `0 0 0 2px ${C.accent}`,
                            zIndex: 1,
                            transition: "width 0.2s ease, height 0.2s ease, box-shadow 0.2s ease, background 0.2s ease",
                          }}
                        />
                        {i < process.length - 1 && (
                          <div
                            style={{
                              width: 1,
                              flex: 1,
                              background: isActive ? "rgba(224, 91, 91, 0.45)" : "rgba(224, 91, 91, 0.2)",
                              marginTop: 4,
                              transition: "background 0.25s ease",
                            }}
                          />
                        )}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontFamily: FONT.mono,
                            fontSize: 10,
                            fontWeight: isActive ? 700 : 600,
                            letterSpacing: 2,
                            textTransform: "uppercase",
                            marginBottom: 6,
                            transition: "color 0.2s ease",
                          }}
                        >
                          <span style={{ color: isActive ? "rgba(255,255,255,0.5)" : C.accent }}>
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span style={{ color: "rgba(255,255,255,0.35)" }}> — </span>
                          <span style={{ color: isActive ? "#E05B5B" : C.accent }}>{step.phase}</span>
                        </div>
                        <Reveal glowText delay={0.08 * i}>
                          <p
                            style={{
                              fontFamily: FONT.body,
                              fontSize: inline ? 15 : 14,
                              lineHeight: 1.75,
                              fontWeight: 400,
                              color: isActive ? "rgba(255, 255, 255, 0.9)" : C.inkOnDarkMuted,
                              margin: 0,
                              transition: "color 0.2s ease",
                            }}
                          >
                            {step.detail}
                          </p>
                        </Reveal>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>

            <div
              className="process-detail-panel"
              style={{
                position: "sticky",
                top: 100,
                background: "rgba(255, 255, 255, 0.055)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: inline ? 22 : 16,
                padding: inline ? "clamp(28px, 4vw, 36px) clamp(28px, 4vw, 40px)" : "28px 32px",
                minHeight: 300,
                boxShadow: inline
                  ? "0 12px 40px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.05)"
                  : "none",
              }}
            >
              {(() => {
                const item = processDetails[activeStep];
                if (!item) return null;
                const stepRow = process[activeStep];

                const useCountUp =
                  item.countUp === true &&
                  item.omitMetric !== true &&
                  typeof item.statValue === "number";

                const hasStaticStat =
                  !useCountUp &&
                  item.omitMetric !== true &&
                  (typeof item.statValue === "number" ||
                    (item.stat != null && String(item.stat).trim() !== ""));

                const staticStatDisplay =
                  hasStaticStat && typeof item.statValue === "number"
                    ? `${item.statPrefix ?? ""}${item.statValue}${item.statSuffix ?? ""}`
                    : hasStaticStat
                      ? String(item.stat).trim()
                      : "";

                /** Prefer the same label as the hovered timeline step so the panel always matches the row. */
                const headlineText =
                  (stepRow?.phase ? String(stepRow.phase).trim() : "") ||
                  (item.title && String(item.title).trim()) ||
                  "";

                const statLabelText =
                  useCountUp || hasStaticStat ? (item.statLabel || "").trim() : "";

                const detailDelay = useCountUp
                  ? 0.22
                  : Math.min(
                      0.08 + (headlineText.length * PROCESS_DETAIL_TYPED_MS) / 1000 + 0.16,
                      2.4
                    );

                const countUpScale = item.statEntranceScale !== false;

                /** Optional media per step: `processDetails[i].image` or `process[i].image` — `{ src, type?: 'video', poster?, alt, caption?, zoom?, zoomOrigin?, maxHeight? }`. Video: `src` .mp4/.webm/.mov or `type: 'video'`; plays inline, muted, looped, autoplay (like stills—no controls). Optional `maxHeight` (CSS length, e.g. `min(300px, 40vh)`) caps size and centers wide/tall shots in the panel. */
                const panelImage = item.image || stepRow?.image;
                const panelImageSrc =
                  panelImage && typeof panelImage.src === "string" && panelImage.src.trim() !== ""
                    ? panelImage.src.trim()
                    : null;
                const panelIsVideo =
                  panelImage?.type === "video" ||
                  Boolean(panelImageSrc && /\.(mp4|webm|mov)$/i.test(panelImageSrc));
                const panelImageAlt =
                  typeof panelImage?.alt === "string"
                    ? panelImage.alt
                    : panelImageSrc
                      ? `${headlineText || stepRow?.phase || "Process"} — supporting visual`
                      : "";

                /** Optional zoom > 1 crops in tighter (e.g. 1.5 ≈ 50% zoom in). Images only. */
                const panelImageZoom =
                  !panelIsVideo &&
                  typeof panelImage?.zoom === "number" &&
                  panelImage.zoom > 1
                    ? panelImage.zoom
                    : 1;
                const zoomOrigin =
                  typeof panelImage?.zoomOrigin === "string" && panelImage.zoomOrigin.trim() !== ""
                    ? panelImage.zoomOrigin.trim()
                    : "center center";
                const panelVideoPoster =
                  typeof panelImage?.poster === "string" && panelImage.poster.trim() !== ""
                    ? panelImage.poster.trim()
                    : undefined;
                const panelMediaMaxHeight =
                  typeof panelImage?.maxHeight === "string" && panelImage.maxHeight.trim() !== ""
                    ? panelImage.maxHeight.trim()
                    : null;

                return (
                  <motion.div
                    key={activeStep}
                    initial={{ opacity: 0, scale: 0.98, y: 6 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 480,
                      damping: 34,
                      mass: 0.75,
                    }}
                  >
                    {useCountUp ? (
                      <>
                        {countUpScale ? (
                          <motion.div
                            key={`${activeStep}-countup`}
                            initial={{ scale: 0.82, opacity: 0.88 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                            style={{
                              fontFamily: FONT.display,
                              fontSize: 48,
                              fontWeight: 800,
                              color: "#E05B5B",
                              marginBottom: 4,
                              transformOrigin: "left center",
                            }}
                          >
                            <AnimatedNumber
                              value={item.statValue}
                              prefix={item.statPrefix || ""}
                              suffix={item.statSuffix || ""}
                            />
                          </motion.div>
                        ) : (
                          <div
                            style={{
                              fontFamily: FONT.display,
                              fontSize: 48,
                              fontWeight: 800,
                              color: "#E05B5B",
                              marginBottom: 4,
                            }}
                          >
                            <AnimatedNumber
                              value={item.statValue}
                              prefix={item.statPrefix || ""}
                              suffix={item.statSuffix || ""}
                            />
                          </div>
                        )}
                        {statLabelText ? (
                          <div
                            style={{
                              fontFamily: FONT.mono,
                              fontSize: 12,
                              textTransform: "uppercase",
                              letterSpacing: 2,
                              color: C.inkOnDarkSubtle,
                              marginBottom: 24,
                            }}
                          >
                            {statLabelText}
                          </div>
                        ) : null}
                        <motion.div
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.18, ease: "easeOut" }}
                          style={{
                            fontFamily: FONT.display,
                            fontSize: 20,
                            fontWeight: 700,
                            fontStyle: "italic",
                            color: "rgba(255, 255, 255, 0.92)",
                            marginBottom: 12,
                          }}
                        >
                          {headlineText}
                        </motion.div>
                      </>
                    ) : hasStaticStat ? (
                      <>
                        <motion.div
                          key={`${activeStep}-static-stat`}
                          initial={{ scale: 0.92, opacity: 0.9 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                          style={{
                            fontFamily: FONT.display,
                            fontSize: 44,
                            fontWeight: 800,
                            color: "#E05B5B",
                            marginBottom: 4,
                            lineHeight: 1.05,
                            transformOrigin: "left center",
                          }}
                        >
                          {staticStatDisplay}
                        </motion.div>
                        {statLabelText ? (
                          <div
                            style={{
                              fontFamily: FONT.mono,
                              fontSize: 12,
                              textTransform: "uppercase",
                              letterSpacing: 2,
                              color: C.inkOnDarkSubtle,
                              marginBottom: 10,
                            }}
                          >
                            {statLabelText}
                          </div>
                        ) : null}
                        <TypedCoralHeading
                          text={headlineText}
                          runKey={activeStep}
                          charDelayMs={PROCESS_DETAIL_TYPED_MS}
                        />
                      </>
                    ) : (
                      <TypedCoralHeading
                        text={headlineText}
                        runKey={activeStep}
                        charDelayMs={PROCESS_DETAIL_TYPED_MS}
                      />
                    )}

                    <motion.p
                      key={`detail-${activeStep}`}
                      initial={{ opacity: 0, y: 8, scale: 0.99 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 32,
                        delay: detailDelay,
                      }}
                      style={{
                        fontFamily: FONT.body,
                        fontSize: inline ? 16 : 15,
                        fontWeight: 400,
                        lineHeight: 1.75,
                        color: C.inkOnDarkMuted,
                        margin: 0,
                        marginTop: 6,
                        letterSpacing: "0.01em",
                      }}
                    >
                      {item.detail}
                    </motion.p>

                    {panelImageSrc ? (
                      <motion.figure
                        key={`process-step-img-${activeStep}`}
                        initial={{ opacity: 0, y: 14, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 340,
                          damping: 30,
                          delay: Math.min(detailDelay + 0.1, 2.5),
                        }}
                        style={{
                          margin: 0,
                          marginTop: 22,
                          borderRadius: inline ? 16 : 14,
                          overflow: "hidden",
                          border: "1px solid rgba(255, 255, 255, 0.1)",
                          background: "rgba(0, 0, 0, 0.28)",
                          boxShadow: "0 10px 32px rgba(0, 0, 0, 0.35)",
                        }}
                      >
                        <div
                          style={{
                            overflow: "hidden",
                            lineHeight: 0,
                            ...(panelIsVideo
                              ? {
                                  background: "rgba(0, 0, 0, 0.45)",
                                }
                              : panelImageZoom > 1
                                ? {
                                    aspectRatio: "16 / 10",
                                    position: "relative",
                                  }
                                : {}),
                          }}
                        >
                          {panelIsVideo ? (
                            <video
                              src={panelImageSrc}
                              autoPlay
                              muted
                              loop
                              playsInline
                              preload="auto"
                              poster={panelVideoPoster}
                              aria-label={panelImageAlt}
                              style={{
                                width: panelMediaMaxHeight ? "auto" : "100%",
                                maxWidth: "100%",
                                display: "block",
                                verticalAlign: "middle",
                                maxHeight: panelMediaMaxHeight || "min(420px, 52vh)",
                                margin: "0 auto",
                                background: "#0a0a0b",
                              }}
                            />
                          ) : (
                            <img
                              src={panelImageSrc}
                              alt={panelImageAlt}
                              loading="lazy"
                              decoding="async"
                              style={{
                                ...(panelImageZoom > 1
                                  ? {
                                      width: "100%",
                                      height: "100%",
                                      display: "block",
                                      objectFit: "cover",
                                      objectPosition: zoomOrigin,
                                      transform: `scale(${panelImageZoom})`,
                                      transformOrigin: zoomOrigin,
                                    }
                                  : panelMediaMaxHeight
                                    ? {
                                        width: "auto",
                                        maxWidth: "100%",
                                        maxHeight: panelMediaMaxHeight,
                                        height: "auto",
                                        display: "block",
                                        margin: "0 auto",
                                        verticalAlign: "middle",
                                        objectFit: "contain",
                                      }
                                    : {
                                        width: "100%",
                                        height: "auto",
                                        display: "block",
                                        verticalAlign: "middle",
                                      }),
                              }}
                            />
                          )}
                        </div>
                        {panelImage.caption ? (
                          <figcaption
                            style={{
                              fontFamily: FONT.body,
                              fontSize: 13,
                              lineHeight: 1.55,
                              color: C.inkOnDarkSubtle,
                              padding: "12px 14px 14px",
                              borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                              margin: 0,
                            }}
                          >
                            {panelImage.caption}
                          </figcaption>
                        ) : null}
                      </motion.figure>
                    ) : null}
                  </motion.div>
                );
              })()}
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </>
  );
}
