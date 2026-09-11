import type { Config } from "tailwindcss";

/**
 * Design tokens mapped from
 * website-forensics/rioproperty/priority-1/design-tokens/design_tokens.json
 */
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          300: "#7DD3FC",
          500: "#00A3FF",
          800: "#0B3A5C",
          DEFAULT: "#00A3FF",
        },
        beige: {
          500: "#fffefc",
          DEFAULT: "#fffefc",
        },
        yellow: {
          500: "#ffea00",
          DEFAULT: "#ffea00",
        },
        ink: {
          DEFAULT: "#0B3A5C",
          soft: "#3d3d3d",
        },
        mist: {
          100: "#e0e0e0",
          200: "#ccc",
          300: "#b8b8b8",
        },
        admin: {
          canvas: "#F4F6F8",
          soft: "#EFEFEF",
          card: "#FFFFFF",
          sky: "#00A3FF",
          "sky-soft": "#38BDF8",
          navy: "#0F172A",
          "navy-soft": "#1E293B",
        },
        sky: {
          400: "#38BDF8",
          500: "#00A3FF",
          600: "#0086D1",
          DEFAULT: "#00A3FF",
        },
      },
      fontFamily: {
        sans: ["Rubik", "Arial", "sans-serif"],
        display: ['"Blauer Nue"', "Rubik", "Verdana", "sans-serif"],
        vazir: ["var(--font-vazirmatn)", "Vazirmatn", "Tahoma", "sans-serif"],
        vazirmatn: ["var(--font-vazirmatn)", "Vazirmatn", "Tahoma", "sans-serif"],
      },
      borderRadius: {
        rio: "1rem",
        "rio-sm": "0.5rem",
        pill: "100vw",
      },
      maxWidth: {
        rio: "120rem",
        "rio-sm": "67.5rem",
      },
      spacing: {
        gutter: "1rem",
        margin: "clamp(1rem, 5vw, 3.75rem)",
        "section-sm": "5rem",
        "section-md": "clamp(5.25rem, 8vw, 7.5rem)",
        "section-lg": "clamp(5.25rem, 10vw, 10rem)",
        "page-top": "clamp(5rem, 12vw, 12.5rem)",
      },
      fontSize: {
        display: [
          "clamp(4rem, 8vw, 7.25rem)",
          { lineHeight: "0.95", letterSpacing: "-0.03em", fontWeight: "600" },
        ],
        h1: [
          "clamp(3rem, 5vw, 4.625rem)",
          { lineHeight: "1", letterSpacing: "-0.03em", fontWeight: "600" },
        ],
        h2: [
          "clamp(2.125rem, 4vw, 3.25rem)",
          { lineHeight: "1.05", letterSpacing: "-0.03em", fontWeight: "600" },
        ],
        h3: ["2.25rem", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "600" }],
        body: ["1rem", { lineHeight: "1.5", fontWeight: "400" }],
        "body-lg": ["clamp(1.0625rem, 1.2vw, 1.125rem)", { lineHeight: "1.45" }],
      },
      transitionTimingFunction: {
        rio: "cubic-bezier(0.7, 0, 0.3, 1)",
      },
      boxShadow: {
        none: "none",
      },
    },
  },
  plugins: [],
};

export default config;
