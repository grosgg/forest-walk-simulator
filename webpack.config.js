//Ensure html-webpack-plugin is pre-installed via npm.
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|svg|jpg|jpeg|gif|mp3)$/,
        use: [
          'file-loader',
        ],
      }
    ]
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
