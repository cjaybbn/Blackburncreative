import React, { useState, useEffect, useRef } from "react";
import { useInView } from "framer-motion";

const CORAL = "#E05B5B";
const INK_DARK = "#1A1814";
const INK_MUTED = "#4A4640";
const FONT_MONO = "'JetBrains Mono', monospace";
const FONT_BODY = "'DM Sans', -apple-system, sans-serif";

const PROMPTS = [
  {
    prompt:
      "We need to examine this bug — session drops after the magic link on cold start. Trace the Supabase client init and suggest where the race is.",
    response:
      "Likely gap between getSession() and onAuthStateChange. I’d await initialize() before rendering the stack, and gate navigation until INITIAL_SESSION fires...",
  },
  {
    prompt:
      "This list re-renders on every scroll tick. Keep the UX; tighten it with memo + stable callbacks so we’re not thrashing the map layer.",
    response:
      "Wrap the row in memo, hoist handlers with useCallback keyed on listing id, and move scroll position to a ref instead of lifting state each frame...",
  },
  {
    prompt:
      "Wire the comps API into this screen — map the JSON to our PropertyContext shape, null-safe enrichment, and surface a clear empty state on 429.",
    response:
      "Added adapter layer: normalize keys, default missing beds/baths, exponential backoff on rate limit, and a single toast + retry CTA in the UI...",
  },
  {
    prompt:
      "We need to fix this dealer note sync — voice capture saves locally but the CRM payload is missing customerId. Walk the handoff and patch the mapper.",
    response:
      "The dictation pipeline completes before roster lookup resolves. Queue the save until customerId is set, or include a temp key the server can reconcile...",
  },
  {
    prompt:
      "Draft release notes for TestFlight 0.4 from this bullet list — keep it agent-facing, no marketing fluff.",
    response:
      "0.4 — Faster listing load, offline draft queue, Rentcast fallback when comps time out, crash fix on iOS 18 sheet dismissal...",
  },
];

export default function AIChatBubble() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, amount: 0.2 });

  const [displayedText, setDisplayedText] = useState("");
  const [showResponse, setShowResponse] = useState(false);
  const [previousExchanges, setPreviousExchanges] = useState([]);
  const [currentResponse, setCurrentResponse] = useState(null);
  const [currentPromptText, setCurrentPromptText] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);

  const promptIndexRef = useRef(0);
  const timeoutIdsRef = useRef([]);

  const clearTimeouts = () => {
    timeoutIdsRef.current.forEach((id) => clearTimeout(id));
    timeoutIdsRef.current = [];
  };

  useEffect(() => {
    if (!inView) return;

    const addTimeout = (fn, delay) => {
      const id = setTimeout(fn, delay);
      timeoutIdsRef.current.push(id);
    };

    const runCycle = () => {
      const prompt = PROMPTS[promptIndexRef.current];

      // 1. Cursor blinks alone 1.2s (no text)
      addTimeout(() => {
        let i = 0;
        const typeNext = () => {
          if (i < prompt.prompt.length) {
            setDisplayedText(prompt.prompt.slice(0, i + 1));
            i++;
            // Typing speed: ~70ms per char with 50–90ms randomization
            const delay = 50 + Math.random() * 40;
            addTimeout(typeNext, delay);
          } else {
            // 3. Hold prompt fully typed for 0.8s
            addTimeout(() => {
              // 4. Gemini thinking dots for 1.5s
              setIsThinking(true);
              addTimeout(() => {
                setIsThinking(false);
                // 5. Show response (fades in via CSS)
                setCurrentResponse(prompt.response);
                setCurrentPromptText(prompt.prompt);
                setDisplayedText(""); // clear input so only cursor shows
                setShowResponse(true);

                // 6. Hold complete exchange visible for 3s
                addTimeout(() => {
                  // 7. Slide up + fade archive over 0.5s
                  setIsArchiving(true);
                  addTimeout(() => {
                    setPreviousExchanges((prev) => {
                      const next = [...prev, { prompt: prompt.prompt, response: prompt.response }];
                      return next.slice(-2);
                    });
                    setDisplayedText("");
                    setShowResponse(false);
                    setCurrentResponse(null);
                    setCurrentPromptText("");
                    setIsArchiving(false);
                    promptIndexRef.current = (promptIndexRef.current + 1) % PROMPTS.length;
                    // 8. Cursor blinks alone again for 1.2s before next prompt
                    addTimeout(runCycle, 1200);
                  }, 500);
                }, 3000);
              }, 1500);
            }, 800);
          }
        };
        typeNext();
      }, 1200);
    };

    runCycle();
    return () => clearTimeouts();
  }, [inView]);

  return (
    <div
      ref={ref}
      className="ai-chat-bubble"
      style={{ position: "relative", width: "100%", maxWidth: 360 }}
    >
      <div
        style={{
          background: "rgba(255, 255, 255, 0.5)",
          backdropFilter: "blur(20px) saturate(1.4)",
          WebkitBackdropFilter: "blur(20px) saturate(1.4)",
          border: "1px solid rgba(0, 0, 0, 0.06)",
          borderRadius: 20,
          padding: "20px 24px",
          boxShadow:
            "0 8px 32px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255,255,255,0.8)",
        }}
      >
        {/* Previous prompts area */}
        <div
          style={{
            height: "auto",
            maxHeight: "none",
            overflow: "visible",
            marginBottom: 16,
          }}
        >
          {previousExchanges.map((ex, i) => (
            <div key={i} style={{ marginBottom: 16 }}>
              {/* User (right-aligned) */}
              <div
                style={{
                  marginLeft: "20%",
                  textAlign: "right",
                  marginBottom: 6,
                }}
              >
                <div
                  style={{
                    fontFamily: FONT_MONO,
                    fontSize: 9,
                    fontWeight: 500,
                    letterSpacing: 1,
                    textTransform: "uppercase",
                    color: CORAL,
                    marginBottom: 4,
                  }}
                >
                  You
                </div>
                <div
                  style={{
                    fontFamily: FONT_BODY,
                    fontSize: 13,
                    color: INK_DARK,
                  }}
                >
                  {ex.prompt}
                </div>
              </div>

              {/* Gemini (left-aligned) */}
              <div
                style={{
                  marginRight: "20%",
                  textAlign: "left",
                  marginTop: 6,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    marginBottom: 4,
                  }}
                >
                  <span style={{ color: CORAL, fontSize: 10 }}>✦</span>
                  <span
                    style={{
                      fontFamily: FONT_MONO,
                      fontSize: 9,
                      letterSpacing: 1,
                      textTransform: "uppercase",
                      color: CORAL,
                    }}
                  >
                    Gemini
                  </span>
                </div>
                <div
                  style={{
                    fontFamily: FONT_BODY,
                    fontSize: 12,
                    fontStyle: "italic",
                    color: INK_MUTED,
                  }}
                >
                  {ex.response}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Current exchange (when showResponse) */}
        {showResponse && currentResponse && (
          <div
            style={{
              marginBottom: 16,
              animation: isArchiving
                ? "aiChatSlideUp 0.5s ease-out forwards"
                : "aiChatFadeIn 0.4s ease-out forwards",
            }}
          >
            {/* User (right-aligned) */}
            <div
              style={{
                marginLeft: "20%",
                textAlign: "right",
                marginBottom: 6,
              }}
            >
              <div
                style={{
                  fontFamily: FONT_MONO,
                  fontSize: 9,
                  fontWeight: 500,
                  letterSpacing: 1,
                  textTransform: "uppercase",
                  color: CORAL,
                  marginBottom: 4,
                }}
              >
                You
              </div>
              <div
                style={{
                  fontFamily: FONT_BODY,
                  fontSize: 13,
                  color: INK_DARK,
                }}
              >
                {currentPromptText}
              </div>
            </div>

            {/* Gemini (left-aligned) */}
            <div
              style={{
                marginRight: "20%",
                textAlign: "left",
                marginTop: 6,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  marginBottom: 4,
                }}
              >
                <span style={{ color: CORAL, fontSize: 10 }}>✦</span>
                <span
                  style={{
                    fontFamily: FONT_MONO,
                    fontSize: 9,
                    letterSpacing: 1,
                    textTransform: "uppercase",
                    color: CORAL,
                  }}
                >
                  Gemini
                </span>
              </div>
              <div
                style={{
                  fontFamily: FONT_BODY,
                  fontSize: 12,
                  fontStyle: "italic",
                  color: INK_MUTED,
                }}
              >
                {currentResponse}
              </div>
            </div>
          </div>
        )}

        {/* Gemini thinking dots */}
        {isThinking && (
          <div
            style={{
              marginRight: "20%",
              textAlign: "left",
              marginBottom: 12,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginBottom: 6,
              }}
            >
              <span style={{ color: CORAL, fontSize: 10 }}>✦</span>
              <span
                style={{
                  fontFamily: FONT_MONO,
                  fontSize: 9,
                  letterSpacing: 1,
                  textTransform: "uppercase",
                  color: CORAL,
                }}
              >
                Gemini
              </span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              {[0, 1, 2].map((i) => (
                <span
                  // eslint-disable-next-line react/no-array-index-key
                  key={i}
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: CORAL,
                    opacity: 0.2,
                    animation: "aiChatDotPulse 1s ease-in-out infinite",
                    animationDelay: `${i * 0.2}s`,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Active input area */}
        <div
          style={{
            background: "rgba(0, 0, 0, 0.03)",
            border: "1px solid rgba(0, 0, 0, 0.06)",
            borderRadius: 12,
            padding: "12px 16px",
            minHeight: 40,
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <span
            style={{
              fontFamily: FONT_MONO,
              fontSize: 13,
              color: INK_DARK,
              display: "inline",
            }}
          >
            {displayedText}
            <span
              style={{
                display: "inline-block",
                width: 2,
                height: "1em",
                background: CORAL,
                marginLeft: 2,
                verticalAlign: "text-bottom",
                animation: "aiChatBlink 1s step-end infinite",
              }}
            />
          </span>
        </div>
      </div>
      <style>{`
        @keyframes aiChatBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes aiChatFadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes aiChatSlideUp {
          from { opacity: 1; transform: translateY(0); }
          to { opacity: 0; transform: translateY(-6px); }
        }
        @keyframes aiChatDotPulse {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}
