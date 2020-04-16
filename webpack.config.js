const pkg = require('./package.json')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: pkg.main,
    library: '',
    libraryTarget: 'commonjs'
  }
}