// tailwind.config.mjs (or .js if your project is set to "type": "module")
import scrollbarHide from "tailwind-scrollbar-hide";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        skyblue: "#0F52BA",
        lightSky: "#3B82F6",
        deepNavy: "#0A2540",
        softGray: "#F3F4F6",
        medGray: "#9CA3AF",
        aqua: "#00D1FF",
        success: "#22C55E",
        warning: "#F59E0B",
        error: "#EF4444",
        darkSky: "#1A1F33",
      },
    },
  },
  plugins: [scrollbarHide],
};
