/** @type {import('tailwindcss').Config} */
import defaultTheme from "tailwindcss/defaultTheme";
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Figtree", ...defaultTheme.fontFamily.sans],
        khmer_battambang: ["battambang", "sans-serif"], // Khmer font family Battambang
      },
      colors: {
        activeText: "#F06424", // Custom color for active text
      },
    },
  },
  plugins: [],
};
