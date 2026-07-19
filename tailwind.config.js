/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,jsx}",
    "./src/components/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0b0b0d",
        panel: "#141417",
        gold: "#c9a76a",
        goldSoft: "#e6d5ad"
      },
      fontFamily: {
        display: ["Georgia", "'Times New Roman'", "serif"],
        body: ["Helvetica", "Arial", "sans-serif"]
      }
    }
  },
  plugins: []
};
