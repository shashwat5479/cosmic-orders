import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        void: "#050414",
        abyss: "#0a0820",
        nebula: "#7c3aed",
        "nebula-bright": "#a78bfa",
        quasar: "#38bdf8",
        ember: "#f4c95d",
        mist: "#c9c3e0",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
        mono: ["var(--font-mono)"],
      },
      boxShadow: {
        glow: "0 0 40px -5px rgba(124, 58, 237, 0.45)",
        "glow-lg": "0 0 80px -10px rgba(124, 58, 237, 0.55)",
      },
      keyframes: {
        drift: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
        "spin-slow": {
  from: { transform: "rotate(0deg)" },
  to: { transform: "rotate(360deg)" },
},
      },
      animation: {
        drift: "drift 8s ease-in-out infinite",
        "spin-slow": "spin-slow 60s linear infinite",
        "spin-slower": "spin-slow 120s linear infinite reverse",
      },
    },
  },
  plugins: [],
};

export default config;
