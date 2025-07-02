import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./layouts/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        notoSansKR: ['"Noto Sans KR"', "sans-serif"],
        roboto: ["Roboto", "sans-serif"],
      },
      animation: {
        "spin-slow": "spin 3s linear infinite", // 3초에 한 바퀴
      },
    },
  },
} satisfies Config;
