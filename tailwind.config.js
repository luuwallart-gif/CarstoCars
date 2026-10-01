module.exports = {
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cc-bg': '#0c0c0d',
        'cc-card': '#151517',
        'cc-border': '#2a2a2e',
        'cc-cyan': '#ff5a1f',   // accent unique
        'cc-red': '#ff5a1f',
        'cc-grey': '#9a978f',
        'cc-grey2': '#6f6d67',
        'cc-light': '#d6d3cb',
        'cc-faint': '#45443f',
      },
      fontFamily: {
        racing: ["'Space Grotesk'", 'sans-serif'],
        rajdhani: ["'Inter'", 'sans-serif'],
      },
    },
  },
  plugins: [],
};
