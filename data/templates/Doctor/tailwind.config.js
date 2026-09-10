/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        campuscv: {
          accent: 'var(--campuscv-accent, #0284c7)',
          background: 'var(--campuscv-background, #f8fafc)',
          foreground: 'var(--campuscv-foreground, #0f172a)',
          muted: 'var(--campuscv-muted, #64748b)',
          border: 'var(--campuscv-border, #e2e8f0)',
        }
      },
      fontFamily: {
        sans: ['var(--campuscv-font-family, "Plus Jakarta Sans")', 'system-ui', 'sans-serif'],
        serif: ['Newsreader', 'Georgia', 'serif'],
      }
    },
  },
  plugins: [],
}
