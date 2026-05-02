/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './node_modules/@boldmind-tech/ui/dist/**/*.{js,mjs}',
  ],
  theme: {
    extend: {
      colors: {
        // ── Brand palette (matches home page hero) ──────────────────
        'edu-navy': {
          DEFAULT: '#00143C',   // deepest — text, auth bg
          deep:    '#0F1E35',   // dark section backgrounds
          mid:     '#1E3A5F',   // hero gradient start
          light:   '#2A4A6E',   // headings, sidebar active
          muted:   '#0A1F4F',   // subtle overlay
        },
        'edu-gold': {
          DEFAULT: '#FFC800',
          dark:    '#E6B400',
        },
        'edu-green': '#00A859',
        'edu-blue':  '#1E40AF',  // kept for legacy / theme-provider
      },
      keyframes: {
        'animate-float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':       { transform: 'translateY(-10px)' },
        },
        'animate-gradient': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%':      { backgroundPosition: '100% 50%' },
        },
      },
      animation: {
        'float':         'animate-float 3s ease-in-out infinite',
        'float-delayed': 'animate-float 3s ease-in-out 1.5s infinite',
        'gradient':      'animate-gradient 4s ease infinite',
      },
    },
  },
};
export default config;
