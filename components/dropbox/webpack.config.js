const path = require("path");
const webpack = require("webpack");
const CopyPlugin = require("copy-webpack-plugin");

const baseConfig = {
  mode: "production",
  target: "node",
  plugins: [new webpack.IgnorePlugin(/^pg-native$/)],
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
};

const componentConfig = {
  ...baseConfig,
  plugins: [
    ...baseConfig.plugins,
    new CopyPlugin({
      patterns: [{ from: "assets", to: path.resolve(__dirname, "dist") }],
    }),
  ],
  ...{
    entry: {
      index: "./src/index.ts",
    },
    output: {
      filename: "[name].js",
      path: path.resolve(__dirname, "dist"),
      libraryTarget: "commonjs2",
    },
  },
};

const testappConfig = {
  ...baseConfig,
  ...{
    entry: {
      testapp: "./src/testapp.ts",
    },
    output: {
      filename: "[name].js",
      path: path.resolve(__dirname, "test"),
      libraryTarget: "commonjs2",
    },
  },
};

module.exports = [componentConfig, testappConfig];
