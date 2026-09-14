import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        blush: {
          50: '#FDF7F9',
          100: '#FCEEF3',
          200: '#F8D7E3',
          300: '#F1B2C9',
          400: '#E896B1',
          500: '#DF7A98',
          600: '#C75B7C',
          700: '#A44261',
          800: '#84354D',
          900: '#692E40',
        },
        champagne: {
          50: '#FAF8F5',
          100: '#F4EFEA',
          200: '#E8DECة',
          300: '#DCCDBF',
          400: '#CDB7A3',
          500: '#C59B6D',
          600: '#B08355',
          700: '#8F663F',
        },
        pearl: {
          50: '#FFFFFF',
          100: '#FAF7F5',
          200: '#F5EFEB',
          300: '#EBE2DC',
          400: '#DED3CB',
        },
        charcoal: {
          800: '#2A2427',
          900: '#1C1719',
          950: '#120F10',
        },
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans: ['var(--font-jakarta)', 'system-ui', 'sans-serif'],
        script: ['var(--font-cormorant)', 'var(--font-playfair)', 'cursive', 'serif'],
      },
      boxShadow: {
        'soft-pink': '0 10px 30px -5px rgba(223, 122, 152, 0.18)',
        'luxury': '0 20px 40px -15px rgba(28, 23, 25, 0.08), 0 0 20px 0 rgba(232, 150, 177, 0.12)',
        'glow': '0 0 25px rgba(223, 122, 152, 0.35)',
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 7s ease-in-out 2s infinite',
        'pulse-subtle': 'pulseSlow 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseSlow: {
          '0%, 100%': { opacity: '0.95', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.02)' },
        }
      }
    },
  },
  plugins: [],
} satisfies Config;
