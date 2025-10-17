/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
    "./*.{js,jsx}"  // ← Esto es crucial para tu estructura sin src/
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}