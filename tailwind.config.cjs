/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}"],
  safelist: ["h-64", "lg:h-96", "lg:w-3/4"],
  plugins: [
    require("@tailwindcss/forms"),
    function ({ addVariant, addComponents, addUtilities, theme, apply }) {
      addVariant("scrollbar", "&::-webkit-scrollbar");
      addVariant("scrollbar-thumb", "&::-webkit-scrollbar-thumb");
      addComponents({
        ".chat": {
          "@apply grid grid-cols-12 gap-y-2 my-4 py-4 border border-gray-200 rounded shadow":
            {},
        },
        ".chat .avatar": {
          "@apply flex items-center justify-center self-start h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0 text-white":
            {},
        },
        ".chat p": {
          "@apply flex flex-row items-center text-center col-start-1 col-end-11 md:col-end-10 p-3 rounded my-0 py-0":
            {},
        },
        ".chat em, .chat strong": {
          "@apply ml-3 text-left font-normal align-middle py-2 px-4 shadow rounded-lg bg-gray-100 text-black":
            {},
        },
        ".chat strong": {
          "@apply bg-indigo-100": {},
        },
        ".chat .me": {
          "@apply col-start-2 md:col-start-3 col-end-13 flex-row-reverse": {},
        },
        ".chat .me strong": {
          "@apply mr-3": {},
        },
      });
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
        health: "#EE5555",
        magicka: "#7777FF",
        stamina: "#00BB00",
        ultimate: "#AAAA00",
      },
    },
  },
};
