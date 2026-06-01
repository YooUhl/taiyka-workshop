import type { Config } from "tailwindcss";

/**
 * Tailwind v4 is mostly CSS-first (see `app/globals.css` @theme block).
 * This file is kept for tool compatibility and documents the brand tokens.
 * Source of truth: ../brand/tokens.json
 */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        electricBlue: "#00A6FF",
        cyan: "#00E5FF",
        navy: "#0A1628",
        white: "#FFFFFF",
        charcoal: "#0F1A2E",
        slate: "#1A2A4A",
        ink: "#E8F0FE",
        muted: "#8DA2C0",
      },
      backgroundImage: {
        "gradient-hero": "linear-gradient(135deg, #00A6FF 0%, #00E5FF 100%)",
        "gradient-navy": "linear-gradient(180deg, #0A1628 0%, #000000 100%)",
        "gradient-glow":
          "radial-gradient(circle, rgba(0,166,255,0.35) 0%, rgba(10,22,40,0) 70%)",
        "hud-grid":
          "linear-gradient(rgba(141,162,192,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(141,162,192,0.08) 1px, transparent 1px)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
        monoHud: ["var(--font-mono-hud)", "JetBrains Mono", "ui-monospace", "monospace"],
        displayHud: ["var(--font-display-hud)", "VT323", "ui-monospace", "monospace"],
      },
      boxShadow: {
        glow: "0 0 40px rgba(0, 166, 255, 0.35)",
        "hud-ring": "0 0 0 1px rgba(0,166,255,0.25), 0 0 24px rgba(0,166,255,0.18)",
        "hud-inset": "inset 0 0 0 1px rgba(0,229,255,0.2)",
      },
      animation: {
        "hud-scan": "hud-scan 7s linear infinite",
        "hud-ticker": "hud-ticker 28s linear infinite",
        "hud-bracket-pulse": "hud-bracket-pulse 4s ease-in-out infinite",
        "hud-dot-pulse": "hud-dot-pulse 1.8s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
