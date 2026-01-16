import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Poker theme colors
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Poker table colors
        poker: {
          "felt-dark": "#0d1f0d",
          "felt": "#1a3a1a",
          "gold": "#fbbf24",
        },
        // Felt green (poker table)
        felt: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
          950: "#052e16",
        },
        // Gold for chips
        chip: {
          gold: "#fbbf24",
          silver: "#94a3b8",
          bronze: "#d97706",
          platinum: "#e2e8f0",
        },
        // Card colors
        card: {
          red: "#dc2626",
          black: "#1e293b",
          white: "#ffffff",
        },
        // Rank tier colors
        rank: {
          fish: "#64748b",
          calling: "#22c55e",
          tag: "#3b82f6",
          semi: "#8b5cf6",
          pro: "#ec4899",
          highroller: "#f59e0b",
          legend: "#ef4444",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Montserrat", "sans-serif"],
      },
      animation: {
        "chip-bounce": "chipBounce 0.5s ease-out",
        "rank-up": "rankUp 1s ease-in-out",
      },
      keyframes: {
        chipBounce: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        rankUp: {
          "0%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.2)", opacity: "0.8" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
