/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        "primary": "#0B0B0B",
        "barber-blue": "#497CFF",
        "barber-red": "#E63946",
        "barber-yellow": "#F1FAEE",
        "barber-green": "#A8DADC",
        "barber-white": "#F1FAEE",
        "barber-black": "#0D1317",
      },
    },
  },
  variants: {},
  plugins: [],
};
