module.exports = {
  extends: [
    '@widget-editor/eslint-config',
  ],
  parserOptions: {
    babelOptions: {
      root: './src/packages/map'
    }
  }
};
