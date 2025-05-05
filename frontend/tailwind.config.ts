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
        profile: ['var(--profile-font-primary)'],
        profileMono: ['var(--profile-font-mono)'],
      },
      screens: {
        'custom-lg': '850px',
      },
      colors: {
        'zodValidation': '#b41400',
        background: "var(--background)",
        profile: {
          background: "var(--profile-background)",
          warningBg: "var(--profile-warning-bg)",
          profileIcons: "var(--profile-icons-var1)",
          danger: "var(--profile-danger)",
          text: "var(--profile-text)",
          textSecondary: "var(--profile-text-secondary)",
          label: "var(--profile-label)",
          error: "var(--profile-error)",
          inputBg: "var(--profile-input-bg)",
          inputDisabledBg: "var(--profile-input-disabled-bg)",
          buttonDanger: "var(--profile-button-danger)",
          buttonDangerText: "var(--profile-button-danger-text)",
          buttonCancel: "var(--profile-button-cancel)",
          buttonCancelText: "var(--profile-button-cancel-text)",
          buttonBg: "var(--profile-button-bg)",
          buttonHover: "var(--profile-button-hover)",
          buttonText: "var(--profile-button-text)",
          buttonIconBg: "var(--profile-button-icon-bg)",
          buttonBorder: "var(--profile-button-border)",
        },
      },
      spacing: {
        'profile-spacing-sm': "var(--profile-spacing-sm)",
        'profile-spacing-md': "var(--profile-spacing-md)",
        'profile-spacing-lg': "var(--profile-spacing-lg)",
        'profile-spacing-xl': "var(--profile-spacing-xl)",
        'profile-padding-sm': "var(--profile-padding-sm)",
        'profile-padding-md': "var(--profile-padding-md)",
        'profile-padding-lg': "var(--profile-padding-lg)",
        'profile-margin-sm': "var(--profile-margin-sm)",
        'profile-margin-md': "var(--profile-margin-md)",
        'profile-margin-lg': "var(--profile-margin-lg)",
        'profile-margin-button': "var(--profile-margin-button)",
      },
      width: {
        'profile-icon-container': "var(--profile-icon-container)",
        'profile-button-sm': "var(--profile-button-sm)",
        'profile-button-md': "var(--profile-button-md)",
      },
      height: {
        'profile-icon-container': "var(--profile-icon-container)",
        'profile-input-height': "var(--profile-input-height)",
        'profile-button-sm': "var(--profile-button-sm)",
        'profile-button-md': "var(--profile-button-md)",
      },
      fontSize: {
        'profile-icon-size': "var(--profile-icon-size)",
      },
      borderWidth: {
        'profile-border': "1px",
        'profile-border-light': "1px",
      },
      borderColor: {
        profile: {
          border: "var(--profile-border)",
          light: "var(--profile-border-light)",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;