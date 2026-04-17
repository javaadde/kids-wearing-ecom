import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        display: ["var(--font-outfit)", "sans-serif"],
      },
      colors: {
        // Editorial palette from inspiration images
        cream: {
          50: "#FAFAF8",
          100: "#F5F4F0",
          200: "#EEECE6",
          300: "#E0DDD4",
        },
        stone: {
          warm: "#C4B49A",
        },
        camel: "#C8A97E",
        rust: "#C27B4B",
        bark: "#8B6348",
        denim: "#6B8BB5",
        "ink": "#1A1A1A",
        "ink-light": "#3D3D3D",
        "ink-muted": "#7A7A7A",
        "ink-faint": "#B8B8B8",
      },
      screens: {
        xs: "375px",
      },
      spacing: {
        "safe-bottom": "env(safe-area-inset-bottom)",
      },
      animation: {
        marquee: "marquee 28s linear infinite",
        "marquee-slow": "marquee 40s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
