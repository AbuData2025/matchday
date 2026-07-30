/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      spacing: {
        "4.5": "1.125rem",
        "5.5": "1.375rem",
        "6.5": "1.625rem",
        "10.5": "2.625rem",
      },
      colors: {
        bg: "#0B0B0B",
        "bg-alt": "#0E0E0E",
        surface: "#161515",
        "surface-alt": "#1D1B1B",
        border: "#2A2626",
        "border-bright": "#3A3434",
        chalk: "#F2F0E6",
        "chalk-dim": "#A6A19E",
        "chalk-faint": "#726C6A",
        gold: "#E8B23D",
        muted: "#7B8890",
      },
      fontFamily: {
        display: ["Oswald", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
