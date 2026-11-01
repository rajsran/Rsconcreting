import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50:  "#FDFBF8",
          100: "#F8F4EE",
          200: "#EEE9E2",
          300: "#E0D9CF",
        },
        violet: {
          50:  "#F9F5EE",
          100: "#F1E8D8",
          400: "#D3BB93",
          500: "#C7A877",
          600: "#BA9662",
          700: "#9F7E4D",
          900: "#5C4A2D",
        },
        ink: {
          900: "#0D0D1A",
          700: "#2D2D3A",
          500: "#5A5A6E",
          300: "#9898AA",
          100: "#D4D4DE",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Montserrat", "sans-serif"],
      },
      boxShadow: {
        card: "0 2px 16px 0 rgba(13,13,26,0.08)",
        "card-lg": "0 8px 40px 0 rgba(13,13,26,0.12)",
        violet: "0 4px 24px 0 rgba(186,150,98,0.30)",
      },
    },
  },
  plugins: [],
};

export default config;
