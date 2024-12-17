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
        bg: {
          MenuAndTextActive: "#F06424",
        },
      },
    },
  },
  plugins: [],
};
