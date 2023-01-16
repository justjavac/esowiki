/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}"],
  plugins: [
    require("@tailwindcss/forms"),
    function ({ addVariant }) {
      addVariant("scrollbar", "&::-webkit-scrollbar");
      addVariant("scrollbar-thumb", "&::-webkit-scrollbar-thumb");
    },
  ],
  theme: {
    extend: {
      colors: {
        normal: "#888888",
        fine: "#2DC50E",
        superior: "#A02EF7",
        epic: "#A02EF7",
        legendary: "#CCAA1A",
      },
    },
  },
};
