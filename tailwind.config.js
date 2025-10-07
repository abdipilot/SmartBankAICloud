/** @type {import('tailwindcss').Config} */
export default {
  content: [
    // This array tells Tailwind to scan all files for utility classes
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
