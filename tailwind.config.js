/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        buzz: {
          DEFAULT: '#E57D24',
          light: '#FFF6EF',
          darkLight: '#2c190b',
          border: '#FCDCC2',
          hover: '#D06B16',
          glow: 'rgba(229, 125, 36, 0.25)',
        },
        media: {
          earned: '#7CAAD9',
          paid: '#2BB59B',
          owned: '#F57888',
        },
      },
      boxShadow: {
        'glow': '0 0 20px -3px rgba(229, 125, 36, 0.3)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.08)',
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
    },
  },
  plugins: [],
};
