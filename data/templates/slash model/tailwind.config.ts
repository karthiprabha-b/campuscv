import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        slash: {
          bg: '#E5E5E5',
          left: '#D4D4D4',
          right: '#0C0C0C',
          darkBanner: '#161616',
          black: '#000000',
          white: '#FFFFFF',
          muted: '#666666',
        }
      },
      fontFamily: {
        heading: ['var(--font-montserrat)', 'sans-serif'],
        body: ['var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-space-grotesk)', 'monospace'],
      },
      boxShadow: {
        'solid-sm': '3px 3px 0px #000000',
        'solid-md': '5px 5px 0px #000000',
        'solid-lg': '8px 8px 0px #000000',
        'solid-white': '5px 5px 0px #FFFFFF',
      }
    },
  },
  plugins: [],
};

export default config;
