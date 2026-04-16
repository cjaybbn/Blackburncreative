import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { C, FONT, viewport, staggerContainer, staggerItem } from "./theme.js";

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
  const processDetails = study.processDetails || [];

  const outerPadding = inline
    ? "clamp(20px, 4vw, 36px) 0 clamp(28px, 5vw, 48px)"
    : embedded
      ? "100px 0"
      : "0";

  const innerPadX = inline ? "clamp(16px, 4vw, 40px)" : "40px";

  return (
    <>
      <style>{`
        @keyframes coralGlow {
          0% { color: inherit; text-shadow: none; }
          15% { color: #E05B5B; text-shadow: 0 0 24px rgba(224, 91, 91, 0.5); }
          35% { color: #E05B5B; text-shadow: 0 0 16px rgba(224, 91, 91, 0.35); }
          100% { color: inherit; text-shadow: none; }
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
            gap: 24px !important;
          }
          .case-study--inline .process-detail-panel {
            display: block !important;
            position: static !important;
            top: auto !important;
            min-height: 0 !important;
            padding: clamp(20px, 5vw, 28px) !important;
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
                    maxWidth: 500,
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
                        borderRadius: 2,
                      }}
                      whileHover={{ y: -2 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                    >
                      {s}
                    </motion.span>
                  ))}
                </div>
              </div>
            </Reveal>
          </motion.div>

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
              gap: 40,
              alignItems: "start",
            }}
          >
            <div style={{ maxWidth: 600 }}>
              {process.map((step, i) => (
                <Reveal key={i} delay={0.08 * i}>
                  <div
                    onMouseEnter={() => setActiveStep(i)}
                    onFocus={() => setActiveStep(i)}
                    style={{
                      display: "flex",
                      gap: 24,
                      position: "relative",
                      marginBottom: i < process.length - 1 ? 8 : 0,
                      padding: "16px 20px",
                      borderRadius: 8,
                      transition: "all 0.3s ease",
                      cursor: "default",
                      borderLeft: activeStep === i ? "2px solid #E05B5B" : "2px solid transparent",
                      background: activeStep === i ? "rgba(224, 91, 91, 0.05)" : "transparent",
                    }}
                  >
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 20 }}>
                      <div
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          background: C.accent,
                          border: `2px solid ${C.inkOnDark}`,
                          boxShadow: `0 0 0 2px ${C.accent}`,
                          zIndex: 1,
                        }}
                      />
                      {i < process.length - 1 && (
                        <div style={{ width: 1, flex: 1, background: "rgba(224, 91, 91, 0.2)", marginTop: 4 }} />
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontFamily: FONT.mono,
                          fontSize: 10,
                          fontWeight: 600,
                          letterSpacing: 2,
                          textTransform: "uppercase",
                          color: C.accent,
                          marginBottom: 6,
                        }}
                      >
                        {String(i + 1).padStart(2, "0")} — {step.phase}
                      </div>
                      <Reveal glowText delay={0.08 * i}>
                        <p
                          style={{
                            fontFamily: FONT.body,
                            fontSize: 14,
                            lineHeight: 1.7,
                            color: C.inkOnDarkMuted,
                            margin: 0,
                          }}
                        >
                          {step.detail}
                        </p>
                      </Reveal>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            <div
              className="process-detail-panel"
              style={{
                position: "sticky",
                top: 100,
                background: "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: 16,
                padding: 36,
                minHeight: 280,
              }}
            >
              {(() => {
                const item = processDetails[activeStep];
                if (!item) return null;
                return (
                  <motion.div
                    key={activeStep}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                  >
                    {item.statEntranceScale ? (
                      <motion.div
                        key={`${activeStep}-stat-scale`}
                        initial={{ scale: 0.7, opacity: 0.85 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        style={{
                          fontFamily: FONT.display,
                          fontSize: 48,
                          fontWeight: 800,
                          color: "#E05B5B",
                          marginBottom: 4,
                          transformOrigin: "left center",
                        }}
                      >
                        {typeof item.statValue === "number" ? (
                          <AnimatedNumber
                            value={item.statValue}
                            prefix={item.statPrefix || ""}
                            suffix={item.statSuffix || ""}
                          />
                        ) : (
                          item.stat
                        )}
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
                        {typeof item.statValue === "number" ? (
                          <AnimatedNumber
                            value={item.statValue}
                            prefix={item.statPrefix || ""}
                            suffix={item.statSuffix || ""}
                          />
                        ) : (
                          item.stat
                        )}
                      </div>
                    )}
                    <div
                      style={{
                        fontFamily: FONT.mono,
                        fontSize: 12,
                        textTransform: "uppercase",
                        letterSpacing: 2,
                        color: C.inkOnDarkSubtle,
                        marginBottom: 28,
                      }}
                    >
                      {item.statLabel}
                    </div>
                    <div
                      style={{
                        fontSize: 20,
                        fontWeight: 700,
                        color: "rgba(255, 255, 255, 0.92)",
                        marginBottom: 12,
                      }}
                    >
                      {item.title}
                    </div>
                    <p
                      style={{
                        fontSize: 14,
                        lineHeight: 1.7,
                        color: C.inkOnDarkSubtle,
                        margin: 0,
                      }}
                    >
                      {item.detail}
                    </p>
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
