const path = require("path");
const webpack = require("webpack");
const CopyPlugin = require("copy-webpack-plugin");
const Dotenv = require("dotenv-webpack");

module.exports = {
  mode: "production",
  target: "node",
  plugins: [
    new webpack.IgnorePlugin({
      resourceRegExp: /^pg-native$|^cloudflare:sockets$/,
    }),
    new CopyPlugin({
      patterns: [{ from: "assets", to: path.resolve(__dirname, "dist") }],
    }),
    new Dotenv(),
  ],
  module: {
    rules: [
      {
        sideEffects: false,
      },
      {
        test: /\.ts/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.md$/,
        type: "asset/source",
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  optimization: {
    usedExports: true,
  },
  entry: "./src/index.ts",
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "dist"),
    libraryTarget: "commonjs2",
  },
};
