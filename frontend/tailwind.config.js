/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Manrope", "Inter", "system-ui", "sans-serif"],
        display: ["Manrope", "Inter", "system-ui", "sans-serif"],
      },
      colors: {
        base: {
          DEFAULT: "#05070D",
          950: "#03040A",
          900: "#080B14",
          800: "#0C1120",
        },
        surface: {
          DEFAULT: "#0E1424",
          light: "#131A2E",
          border: "#1E2740",
        },
        indigo: {
          glow: "#6366F1",
        },
        accent: {
          blue: "#3B82F6",
          indigo: "#6366F1",
          violet: "#8B5CF6",
          cyan: "#22D3EE",
        },
        severity: {
          low: "#34D399",
          medium: "#FBBF24",
          high: "#FB923C",
          critical: "#F87171",
        },
        muted: "#8A93A8",
      },
      backgroundImage: {
        "grid-fade":
          "linear-gradient(to bottom, rgba(99,102,241,0.08), transparent 60%)",
        "hero-radial":
          "radial-gradient(60% 60% at 50% 0%, rgba(99,102,241,0.25) 0%, rgba(5,7,13,0) 70%)",
        "card-sheen":
          "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 60%)",
      },
      boxShadow: {
        glow: "0 0 40px -8px rgba(99,102,241,0.45)",
        "glow-sm": "0 0 20px -6px rgba(99,102,241,0.4)",
        card: "0 1px 0 0 rgba(255,255,255,0.04) inset, 0 8px 30px -12px rgba(0,0,0,0.6)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { opacity: 0.5 },
          "50%": { opacity: 1 },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "pulse-glow": "pulse-glow 2.4s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
      },
    },
  },
  plugins: [],
};
