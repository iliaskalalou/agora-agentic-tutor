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
        ink: {
          900: "#0a0e1a",
          800: "#0f1525",
          700: "#161d33",
          600: "#1e2740",
          500: "#2a3552",
        },
        // One signature accent per agent, used across the activity stream and badges.
        planner: "#7c83ff",
        tutor: "#3ecf8e",
        assessor: "#ffb020",
        diagnostician: "#ff5d73",
        learner: "#22d3ee",
        orchestrator: "#c084fc",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(124,131,255,0.25), 0 8px 30px rgba(0,0,0,0.45)",
      },
      keyframes: {
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.45" },
        },
        "slide-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "pulse-soft": "pulse-soft 1.4s ease-in-out infinite",
        "slide-in": "slide-in 0.32s ease-out",
      },
    },
  },
  plugins: [],
};
