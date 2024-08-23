/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        karla: ["Karla", "sans-serif"],
        rubik: ["Rubik", "sans-serif"],
      },
      colors: {
        primary: "#cecaff",
        "primary-light": "#d9d7f6",
        background: "#fff0eb",
      },
    },
  },
  plugins: [],
};
