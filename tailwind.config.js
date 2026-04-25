// tailwind.config.js - educenter
// Extends the shared base config for ecosystem consistency
/** @type {import('tailwindcss').Config} */
const config = {
  ...baseConfig,
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    ...baseConfig.theme,
    extend: {
      ...baseConfig.theme?.extend,
      colors: {
        ...(baseConfig.theme?.extend)?.colors,
        'edu-blue': { 50: '#EFF6FF', 100: '#DBEAFE', 600: '#2563EB', 700: '#1D4ED8' },
        'edu-amber': '#F59E0B',
      },
      keyframes: {
        ...(baseConfig.theme?.extend)?.keyframes,
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
        ...(baseConfig.theme?.extend)?.animation,
        'float':          'animate-float 3s ease-in-out infinite',
        'float-delayed':  'animate-float 3s ease-in-out 1.5s infinite',
        'gradient':       'animate-gradient 4s ease infinite',
      },
    },
  },
};
export default config;
