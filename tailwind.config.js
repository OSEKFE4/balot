/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1a4d2e', // Kammelna Green
          light: '#2d6a4f',
          dark: '#081c15',
        },
        secondary: {
          DEFAULT: '#d4af37', // Gold
          light: '#f1c40f',
          dark: '#9a7b0c',
        },
      },
    },
  },
  plugins: [],
};
