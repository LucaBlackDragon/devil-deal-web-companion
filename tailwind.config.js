/** @type {import('tailwindcss').Config} */
module.exports = {
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    // { pattern: /bg-.*/ },
    // { pattern: /w-.*/ },
    // { pattern: /h-.*/ },
    // { pattern: /ring-.*/, variants: ["focus"] },
    // { pattern: /text-.*/ },
  ],
  daisyui: {
    themes: ["fantasy"],
  },
};
