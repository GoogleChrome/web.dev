/**
 * For anyone new to webpack, pwa-starter-kit has a good example file to follow
 * https://github.com/Polymer/pwa-starter-kit/blob/webpack/webpack.config.js
 */

const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/scripts/main.ts',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js',
  },
  resolve: {
    // Tell webpack to look for .ts files
    extensions: ['.ts', '.mjs', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'ts-loader', // translates TypeScript to JavaScript
          },
        ],
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'style-loader', // creates style nodes from JS strings
          },
          {
            loader: 'css-loader', // translates CSS into CommonJS
          },
          {
            loader: 'sass-loader', // compiles Sass to CSS
          },
        ],
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: path.join(__dirname, 'src', 'sandbox'),
        to: path.join(__dirname, 'build', 'sandbox'),
      },
    ]),
  ],
};
