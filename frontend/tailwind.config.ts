import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    // Core theme overrides (completely replacing defaults)
    screens: {
      lg: { max: "1279px" },
      md: { max: "991px" },
      sm: { max: "639px" },
    },
    // Keep extend as a single object with all extensions
    extend: {
      fontFamily: {
        sans: [""],
        display: [""],
        mono: [""],
      },
      colors: {
        primary: {
          50: "",
          100: "",
          200: "",
          300: "",
          400: "",
          500: "",
          600: "",
          700: "",
          800: "",
          900: "",
        },
        secondary: {
          // Same as over for different colors
        },
        accent: {
          // Same as over for different colors
        },
        error: {
          // Same as over for different colors
        },
      },
      spacing: {
        // Core spacing units
        xs: "0.5rem", // 8px - Fine details, tight spacing
        sm: "1rem", // 16px - Standard spacing for small elements
        md: "1.5rem", // 24px - Medium components, card padding
        lg: "2rem", // 32px - Larger component separation
        xl: "3rem", // 48px - Section padding
        "2xl": "4rem", // 64px - Major section margins
        "3xl": "6rem", // 96px - Page section separation

        // Screen-relative spacing
        "screen-1/4": "25vh",
        "screen-1/3": "33vh",
        "screen-1/2": "50vh",
        "screen-3/4": "75vh",
      },
      zIndex: {
        behind: "-1",
        normal: "1",
        dropdown: "10",
        sticky: "20",
        fixed: "30",
        modal: "40",
        popover: "50",
        tooltip: "60",
      },
      margin: {
        section: "clamp(3rem, 8vh, 6rem)", // Responsive section margins
      },
      padding: {
        section: "clamp(2rem, 5vh, 4rem)", // Responsive section padding
      },
      boxShadow: {
        sm: "0 1px 2px rgba(0, 0, 0, 0.05)",
        DEFAULT: "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
        md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("@tailwindcss/forms")],
} satisfies Config;
