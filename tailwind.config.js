/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        buzz: {
          DEFAULT: '#e68228', // Signature Buzzmetrics Orange (RGB: 230, 130, 40)
          hover: '#d4741e',
          light: '#fdf3e9',
          border: '#f8d2b0',
          darkblue: '#125876', // Buzzmetrics Dark Blue
          lightorange: '#e69650', // Buzzmetrics Light Orange
          sandyorange: '#fabe8c', // Buzzmetrics Sandy Orange
          grey: '#969696',
          darkgrey: '#5f5f5f',
          deepgrey: '#333333',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
