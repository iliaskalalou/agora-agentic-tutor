/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      colors: {
        // Primary brand: a calm, trustworthy indigo for an education product.
        brand: {
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
        },
        // Muted, professional accent per agent (used only in the advanced view).
        orchestrator: "#7c3aed",
        planner: "#4f46e5",
        tutor: "#059669",
        assessor: "#d97706",
        diagnostician: "#e11d48",
        learner: "#0284c7",
      },
      boxShadow: {
        card: "0 1px 2px rgba(16,24,40,0.05), 0 1px 3px rgba(16,24,40,0.08)",
        lift: "0 10px 30px rgba(16,24,40,0.10)",
      },
      keyframes: {
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        "slide-in": {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "pulse-soft": "pulse-soft 1.5s ease-in-out infinite",
        "slide-in": "slide-in 0.28s ease-out",
      },
    },
  },
  plugins: [],
};
