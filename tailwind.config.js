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
  'cc-grey2': '#5a6b8c',   // texte tertiaire
  'cc-light': '#bbc9dd',   // texte clair
  'cc-faint': '#3a4560',   // texte très effacé
      },
      fontFamily: {
        racing: ["'Racing Sans One'", 'cursive'],
        rajdhani: ["'Rajdhani'", 'sans-serif'],
      },
    },
  },
  plugins: [],
};
