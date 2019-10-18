module.exports = {
  plugins: {
    "postcss-preset-env": {
      autoprefixer: {
        flexbox: "no-2009" // will add prefixes only for final and ie versions of specification
      },
      stage: 2
    },
    cssnano: {}
  }
};
