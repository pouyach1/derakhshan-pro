/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Rubik", "sans-serif"],
      },
      colors: {
        beige: "#fffefc",
        brand: "#4725b8",
        ink: "#230f66",
        label: "#333333",
        yellow: "#ffea00",
      },
      borderRadius: {
        main: "1rem",
      },
      spacing: {
        gutter: "4rem",
      },
      transitionTimingFunction: {
        rio: "cubic-bezier(.625, .05, 0, 1)",
      },
    },
  },
};
