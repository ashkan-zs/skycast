import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        app: {
          background: "var(--app-background)",
          surface: "var(--app-surface)",
          "surface-muted": "var(--app-surface-muted)",
          border: "var(--app-border)",
          text: "var(--app-text)",
          "text-muted": "var(--app-text-muted)",
          accent: "var(--app-accent)",
        },
        neutral: {
          0: "hsl(0, 0%, 100%)",
          200: "hsl(250, 6%, 84%)",
          300: "hsl(240, 6%, 70%)",
          600: "hsl(243, 23%, 30%)",
          700: "hsl(243, 23%, 24%)",
          800: "hsl(243, 27%, 20%)",
          900: "hsl(243, 96%, 9%)",
        },
        orange: {
          500: "hsl(28, 100%, 52%)",
        },
        blue: {
          500: "hsl(233, 67%, 56%)",
          700: "hsl(248, 70%, 36%)",
        },
      },
      fontFamily: {
        sans: ['"DM Sans"', "system-ui", "sans-serif"],
        display: ['"Bricolage Grotesque"', '"DM Sans"', "system-ui", "sans-serif"],
      },
    },
  },
} satisfies Config;
