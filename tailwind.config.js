module.exports = {
  purge: ["./pages/**/*.tsx", "./src/**/*.tsx"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        secondary: "#7C869F",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
