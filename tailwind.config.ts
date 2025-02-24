
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    extend: {
      fontFamily: {
        mono: ["JetBrains Mono", "monospace"],
      },
      colors: {
        cyber: {
          black: "#0A0F1B",
          blue: "#00F0FF",
          darkBlue: "#001A1B",
          gray: "#2A2A2A",
        },
      },
      scale: {
        '115': '1.15',
        '135': '1.35'
      },
      keyframes: {
        glow: {
          '0%, 100%': { textShadow: '0 0 4px #00F0FF' },
          '50%': { textShadow: '0 0 8px #00F0FF' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scanline: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(100vh)' },
        },
      },
      animation: {
        glow: 'glow 2s ease-in-out infinite',
        fadeIn: 'fadeIn 0.5s ease-in-out',
        scanline: 'scanline 8s linear infinite',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

