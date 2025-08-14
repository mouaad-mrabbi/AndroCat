import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        interactive: {
          DEFAULT: "var(--interactive)",
          20: "rgba(102, 203, 91, 0.2)",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
