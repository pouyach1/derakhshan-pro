/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
      colors: {
        background: "#ffffff",
        surface: "#f0f0f0",
        ink: "#000000",
        muted: "#666666",
        accent: "#ff6900",
        success: "#4d9e30",
        warning: "#f6eb13",
        danger: "#fa9f47",
      },
      borderRadius: {
        main: "3px",
      },
    },
  },
};
