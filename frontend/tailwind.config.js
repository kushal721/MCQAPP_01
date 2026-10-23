/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Instrument Sans"', "ui-sans-serif", "system-ui", "sans-serif"],
        display: ['"Bricolage Grotesque"', '"Instrument Sans"', "ui-sans-serif", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "SFMono-Regular", "monospace"],
      },
      // Warm paper and ink, with marigold as the single accent colour.
      // Green and red are reserved for right and wrong answers.
      colors: {
        paper: {
          DEFAULT: "#F4F0E6",
          card: "#FFFDF7",
          sunk: "#ECE6D8",
        },
        ink: {
          DEFAULT: "#1E1C18",
          700: "#3A3630",
          500: "#6B655A",
          400: "#8F887B",
          300: "#B9B1A2",
        },
        line: {
          DEFAULT: "#E2DACA",
          strong: "#CFC5B1",
        },
        marigold: {
          100: "#FBEBC2",
          300: "#F2C14E",
          500: "#E2A11B",
          700: "#8A5A00",
        },
        right: {
          50: "#E8F3EA",
          200: "#B9DBC3",
          500: "#2E7D4F",
          700: "#1F5C39",
        },
        wrong: {
          50: "#FBEAE6",
          200: "#EFC0B6",
          500: "#B8402E",
          700: "#8A2C1F",
        },
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.25s ease-out both",
      },
    },
  },
  plugins: [],
};
