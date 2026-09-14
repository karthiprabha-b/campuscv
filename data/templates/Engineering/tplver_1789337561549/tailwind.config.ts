import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          950: "#030712", // obsidian midnight
          900: "#0b0f19",
          850: "#0f172a",
          800: "#1e1b4b", // deep indigo base
          700: "#312e81",
          600: "#4338ca", // royal cobalt indigo
          500: "#6366f1", // electric indigo
          400: "#818cf8",
          300: "#a5b4fc",
          neonCyan: "#06b6d4",
          brightCyan: "#38bdf8",
          neonViolet: "#a855f7",
          electricPurple: "#c084fc",
          lightBg: "#f8fafc",
          surfaceLight: "#ffffff",
        },
      },
      fontFamily: {
        sans: ["var(--font-outfit)", "system-ui", "sans-serif"],
        display: ["var(--font-plus-jakarta)", "system-ui", "sans-serif"],
        mono: ["var(--font-fira)", "monospace"],
      },
      borderRadius: {
        'stadium': '9999px',
        'arch': '160px',
        'curve-xl': '48px',
        'curve-2xl': '64px',
      },
      boxShadow: {
        'cyan-glow': '0 15px 35px -5px rgba(6, 182, 212, 0.45)',
        'indigo-glow': '0 20px 45px -10px rgba(99, 102, 241, 0.4)',
        'violet-glow': '0 20px 40px -10px rgba(168, 85, 247, 0.35)',
        'deep-float': '0 25px 60px -15px rgba(3, 7, 18, 0.35)',
        'soft-elevation': '0 20px 40px -15px rgba(15, 23, 42, 0.08)',
      },
    },
  },
  plugins: [],
};
export default config;
