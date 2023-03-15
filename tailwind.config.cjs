/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        "darkprimary":"#16A34A",
        "primary":"#22C55E",
        "secondary":"#EAB308",
        "accent":"#4ADE80",
        "lightest":"#F5F5F5",
        "lighter":"#EEEEEE",
        "light":"#E0E0E0",
        "dark":"#616161",
        "darker":"#424242",
        "darkest":"#212121",
        "semitrans":"rgba(0,0,0,0.25)"
      }
    },
  },
  plugins: [],
}