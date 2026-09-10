/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        warm: {
          bg: '#FAF8F5',
          card: '#FFFFFF',
          subtle: '#F2EEE9',
          border: '#E5E0D8',
        },
        charcoal: {
          DEFAULT: '#111111',
          muted: '#666666',
          light: '#888888',
        },
        accent: {
          orange: '#FF4500',
          orangeHover: '#E03E00',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        heading: ['Syne', '"Plus Jakarta Sans"', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      }
    },
  },
  plugins: [],
}
