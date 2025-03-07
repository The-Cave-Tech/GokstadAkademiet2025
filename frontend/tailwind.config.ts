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
        roboto: ['var(--font-roboto)', 'sans-serif'],
      },
      screens: {
        'custom-lg': '850px', 
      },
      colors: {
        'zodValidation': '#b41400',
        background: "var(--background)"
      },
    },
  },
  plugins: [],
} satisfies Config;
