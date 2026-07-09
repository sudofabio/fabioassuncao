import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: [
    "./app/components/**/*.{vue,ts}",
    "./app/pages/**/*.vue",
    "./app/layouts/**/*.vue",
    "./app/app.vue",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["Syne", "system-ui", "sans-serif"],
        body: ["IBM Plex Sans", "system-ui", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
      colors: {
        ink: {
          50: "#faf9f7",
          100: "#f0ede8",
          200: "#e0dbd2",
          300: "#c9c1b4",
          400: "#a89e8e",
          500: "#8d8272",
          600: "#6e6455",
          700: "#504940",
          800: "#352f29",
          900: "#1c1917",
          950: "#0f0d0b",
        },
        accent: {
          DEFAULT: "#d4a54a",
          light: "#e8c67a",
          dim: "#a17c32",
        },
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out both",
        "slide-up": "slideUp 0.6s ease-out both",
        blink: "blink 1s step-end infinite",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
      },
    },
  },
} satisfies Config;
