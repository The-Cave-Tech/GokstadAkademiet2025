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
      fontSize: {
        "main-title-big": "var(--main-title-big)",
        "main-title-medium": "var(--main-title-medium)",
        "main-title-small": "var(--main-title-small)",
        "section-title-big": "var(--section-title-big)",
        "section-title-medium": "var(--section-title-medium)",
        "section-title-small": "var(--section-title-small)",
        "sub-section-title-big": "var(--sub-section-title-big)",
        "sub-section-title-small": "var(--sub-section-title-small)",
        "body-big": "var(--body-text-big)",
        "body-small": "var(--body-text-small)",
        "captions-big": "var(--captions-big)",
        "captions-small": "var(--captions-small)",
        "btn-cta-big": "var(--btn-cta-big)",
        "btn-cta-medium": "var(--btn-cta-medium)",
        "btn-cta-small": "var(--btn-cta-small)",
      },

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
