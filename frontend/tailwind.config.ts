import type { Config } from "tailwindcss";

const config = {
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
        background: "var(--color-background)",
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        card: "var(--color-card)",
        accent: "#F59E0B",
        danger: "#DC2626",
        success: "#16A34A",
      },
    },
  },
  plugins: [],
} satisfies Config;

export default config;
