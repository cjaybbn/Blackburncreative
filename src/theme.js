/** Shared design tokens — WCAG-oriented contrast on light + dark surfaces */
export const C = {
  bg: "rgba(42, 6, 17, 0.1)",
  bgAlt: "rgba(42, 6, 17, 0.15)",
  surface: "rgba(42, 6, 17, 0.08)",
  surfaceDim: "rgba(42, 6, 17, 0.05)",
  ink: "rgba(42, 6, 17, 0.96)",
  inkSoft: "rgba(42, 6, 17, 0.78)",
  inkMuted: "rgba(42, 6, 17, 0.68)",
  inkFaint: "rgba(42, 6, 17, 0.55)",
  accent: "#E05B5B",
  accentDim: "rgba(224, 91, 91, 0.08)",
  accentLight: "rgba(224, 91, 91, 0.15)",
  rule: "rgba(42, 6, 17, 0.12)",
  ruleStrong: "rgba(150, 150, 150, 0.28)",
  darkBg: "#141416",
  inkOnDark: "rgba(255, 255, 255, 0.96)",
  inkOnDarkMuted: "rgba(255, 255, 255, 0.78)",
  inkOnDarkFaint: "rgba(255, 255, 255, 0.68)",
  inkOnDarkSubtle: "rgba(255, 255, 255, 0.62)",
};

export const FONT = {
  display: "'DM Serif Display', Georgia, serif",
  body: "'DM Sans', -apple-system, sans-serif",
  mono: "'JetBrains Mono', monospace",
};

export const viewport = { once: true, amount: 0.1 };

export const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { delayChildren: 0.15, staggerChildren: 0.1 },
  },
};

export const staggerItem = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export const caseStudyMotion = { viewport, sectionVariants, staggerContainer, staggerItem };
