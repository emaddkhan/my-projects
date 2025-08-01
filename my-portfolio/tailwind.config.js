/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        oswald: ["Oswald", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
      },
      colors: {
        brand: {
          blue: "#222831",
          grey: "#393E46",
          cyan: "#00ADB5",
          white: "#EEEEEE",
        },
      },
    },
  },
  plugins: [],
};
