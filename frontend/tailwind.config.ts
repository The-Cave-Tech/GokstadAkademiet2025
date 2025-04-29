import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        roboto: ["var(--font-roboto)", "sans-serif"],
      },
      screens: {
        "custom-lg": "850px",
      },
      colors: {
        zodValidation: "#b41400",
        background: "var(--background)",
        primary: "#1D4ED8", // Example: Primary blue
        secondary: "#9333EA", // Example: Secondary purple
        accent: "#F59E0B", // Example: Accent yellow
        danger: "#DC2626", // Example: Danger red
        success: "#16A34A", // Example: Success green
      },
    },
  },
  plugins: [],
} satisfies Config;
