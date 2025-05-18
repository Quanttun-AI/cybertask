
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
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        cyber: ["'Rajdhani'", "sans-serif"],
        japanese: ["'Noto Sans JP'", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))"
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))"
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))"
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))"
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))"
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))"
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))"
        },
        neon: {
          purple: "#9b87f5",
          pink: "#D946EF",
          blue: "#1EAEDB",
          cyan: "#0fa5e9",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)"
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" }
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" }
        },
        glow: {
          "0%, 100%": { boxShadow: "0 0 5px #9b87f5, 0 0 10px #9b87f5" },
          "50%": { boxShadow: "0 0 20px #9b87f5, 0 0 30px #9b87f5" }
        },
        "text-glow": {
          "0%, 100%": { textShadow: "0 0 5px #9b87f5, 0 0 10px #9b87f5" },
          "50%": { textShadow: "0 0 20px #9b87f5, 0 0 30px #9b87f5" }
        },
        "border-glow": {
          "0%, 100%": { 
            boxShadow: "0 0 5px #9b87f5, 0 0 10px #9b87f5",
            borderColor: "rgba(155, 135, 245, 0.7)"
          },
          "50%": { 
            boxShadow: "0 0 20px #9b87f5, 0 0 30px #9b87f5",
            borderColor: "#9b87f5"
          }
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" }
        },
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "glow": "glow 2s ease-in-out infinite",
        "text-glow": "text-glow 2s ease-in-out infinite",
        "border-glow": "border-glow 2s ease-in-out infinite",
        "fade-in": "fade-in 0.5s ease-out forwards",
        "float": "float 3s ease-in-out infinite",
        "spin-slow": "spin-slow 10s linear infinite"
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
