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
      screens: {
        'custom-lg': '850px', 
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "header-bg": "var(--header-bg)",
        "header-text": "var(--header-text)",
        primary: "var(--primary)",
        "button-bg": "var(--button-bg)",
        "button-text": "var(--button-text)",
      },
    },
  },
  plugins: [],
} satisfies Config;
