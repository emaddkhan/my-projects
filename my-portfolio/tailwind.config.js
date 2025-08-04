/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        rotateWiggle: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-8deg)' },
          '75%': { transform: 'rotate(8deg)' },
        },
        glow: {
          '0%, 100%': {
            boxShadow: '0 0 0px rgba(0, 255, 255, 0.0)',
          },
          '50%': {
            boxShadow: '0 0 15px rgba(0, 255, 255, 0.9)',
          },
        },
      },
      animation: {
        rotateWiggle: 'rotateWiggle 0.8s ease-in-out infinite',
        glow: 'glow 0.8s ease-in-out infinite',
      },
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
