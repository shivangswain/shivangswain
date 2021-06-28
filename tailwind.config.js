module.exports = {
  purge: [
    "gatsby-browser.js",
    "src/**/*.{js,jsx,ts,tsx}"
  ],
  darkMode: "media",
  theme: {
    extend: {
      fontFamily: {
        circular: "Circular, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif"
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}