import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#FDFBF7',
          100: '#F7EECE',
          200: '#EEDAA1',
          300: '#E4C674',
          400: '#D5B350',
          500: '#C89B3C', // Primary Gold
          600: '#A67D28',
          700: '#83601C',
          800: '#614413',
          900: '#402B0A',
        },
        charcoal: {
          DEFAULT: '#111827',
          light: '#1F2937',
          dark: '#0B0F19',
        },
        luxury: {
          bg: '#FAF8F4',
          card: '#FFFFFF',
          border: '#E7E2D9',
          textPrimary: '#1A1A1A',
          textSecondary: '#6B7280',
          darkBg: '#0B0F19',
          darkCard: '#111827',
          darkBorder: '#1F2937',
        },
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'sans-serif'],
      },
      boxShadow: {
        'gold-glow': '0 0 25px -5px rgba(200, 155, 60, 0.25)',
        'gold-glow-lg': '0 0 40px -5px rgba(200, 155, 60, 0.35)',
        'luxury': '0 20px 40px -15px rgba(0, 0, 0, 0.07)',
      },
    },
  },
  plugins: [],
};

export default config;
