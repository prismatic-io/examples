const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");
require("dotenv").config();

module.exports = {
  mode: "production",
  target: "node",
  plugins: [
    new CopyPlugin({
      patterns: [{ from: "assets", to: path.resolve(__dirname, "dist") }],
    }),
    new webpack.DefinePlugin({
      "process.env.MICROSOFT_CLIENT_ID": JSON.stringify(process.env.MICROSOFT_CLIENT_ID || ''),
      "process.env.MICROSOFT_CLIENT_SECRET": JSON.stringify(process.env.MICROSOFT_CLIENT_SECRET || ''),
    }),
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
