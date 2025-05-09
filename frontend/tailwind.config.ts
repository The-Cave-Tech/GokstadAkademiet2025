import type { Config } from "tailwindcss";

const config = {
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

      boxShadow: {
        elevation: "var(--shadow-elevation)"
      },

      fontFamily: {
        roboto: ["var(--font-roboto)", "sans-serif"],
      },
      screens: {
        "custom-lg": "850px",
      },

      spacing: {
        sm: "var(--spacing-sm)",
        md: "var(--spacing-md)",
        lg: "var(--spacing-lg)",
      },

      colors: {
        zodValidation: "#b41400",
        background: "var(--background)",
        grayed: "var(--grayed)",
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        card: "var(--color-card)",
        danger: "var(--danger)",
        "danger-hover": "var(--danger-hover)",
        standard: "var(--standard)",
        "standard-hover": "var(--standard-hover)",
        "standard-hover-dark": "var(--standard-hover-dark)",
        success: "var(--success)",
        "success-hover": "var(--success-hover)",
        typographyPrimary: "var(--typography-primary)",
        typographyPrimaryHover: "var(--typography-primary-hover)",
        typographyPrimaryWH: "var(--typography-primary-white)",
        typographySecondary: "var(--typography-secondary)",
      },
    },
  },
  plugins: [],
} satisfies Config;

export default config;


export default config;
