module.exports = {
  extends: [
    '@widget-editor/eslint-config',
  ],
  parserOptions: {
    babelOptions: {
      root: './src/applications/widget-editor'
    }
  }
};
