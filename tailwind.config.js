/** Tailwind 3.4.17 — must match the version pinned in package.json. */
module.exports = {
  content: ["./index.html", "./js/**/*.js"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        obsidian: "#0f1115",
        charcoal: "#161920",
        surface: "#1d212b",
        gold: {
          DEFAULT: "#d4a359",
          light: "#e6be7e",
          dark: "#a87c38",
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
};
