module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './*.{js,ts,jsx,tsx}'
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
        heading: ['var(--font-montserrat, Montserrat)', 'sans-serif'],
        body: ['var(--font-inter, Inter)', 'sans-serif'],
        mono: ['var(--font-mono, "JetBrains Mono")', 'monospace'],
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
