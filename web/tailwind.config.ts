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
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 40px rgba(0, 166, 255, 0.35)",
      },
    },
  },
  plugins: [],
};

export default config;
