/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
      colors: {
        black950: "#020617",
        black900: "#0f172a",
        grap50: "#f9fafb",
        product_addToCart: "#ff9f00",
        category_text: "var(--category-text)",
        category_arrow_div: "var(--category-arrow-div)",
        all_text: "var(--all-text)",
        important_text: "var(--important-text)",
        important_black: "var(--important-black)",
        auth_button_background: "var(--auth-button-background)",
        auth_button_background_hover: "var(--auth-button-background-hover)",
        some_less_important_text: "var(--some-less-important-text)",
      },
    },
    screens: {
      "2xl": { max: "1535px" },
      // => @media (max-width: 1535px) { ... }

      laptop: { max: "1280px" },
      // => @media (max-width: 1279px) { ... }

      sm_lap: { max: "1024px" },
      // => @media (max-width: 1023px) { ... }

      tablet: { max: "800px" },
      // => @media (max-width: 767px) { ... }

      mobile: { max: "640px" },
      // => @media (max-width: 639px) { ... }
    },
  },
  plugins: [],
};
