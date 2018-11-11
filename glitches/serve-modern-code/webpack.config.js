// Copyright 2018 Google LLC.
// SPDX-License-Identifier: Apache-2.0

const path = require("path");

const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  entry: ["./src"],
  output: {
    path: path.resolve(__dirname, "public"),
    filename: "[name].bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.css$/, 
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: "css-loader"
        })
      },
      { 
        test: /\.js$/, 
        exclude: /node_modules/, 
        loader: "babel-loader" 
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin({filename: "[name].css", allChunks: true}),
    new HtmlWebpackPlugin({template: "./src/index.html"})
  ]
}