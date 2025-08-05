/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navGrey:"#212121",
          black: "#000000",
          paragrey:"#444444"
        },
      },
    },
  },
  plugins: [],
}

