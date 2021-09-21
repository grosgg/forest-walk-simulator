//Ensure html-webpack-plugin is pre-installed via npm.
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  module: {
    rules: []
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: "./index.html"
    }),
  ],
  performance: {
    hints: false
  }
};
