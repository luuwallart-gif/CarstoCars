module.exports = {
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cc-bg': '#0a0e1a',
        'cc-card': '#141b2e',
        'cc-border': '#253150',
        'cc-cyan': '#00d4ff',
        'cc-red': '#e10600',
        'cc-grey': '#8b9bb4',
      },
      fontFamily: {
        racing: ["'Racing Sans One'", 'cursive'],
        rajdhani: ["'Rajdhani'", 'sans-serif'],
      },
    },
  },
  plugins: [],
};
