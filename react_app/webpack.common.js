const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: "./src/index.tsx",
  module: {
    rules: [
      {
        test: /\.tsx?$/i,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: "css-loader",
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "build"),
    publicPath: "auto",
    clean: true,
  },
  performance: {
    assetFilter: function (assetFilename) {
      return !assetFilename.endsWith(".js");
    },
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: "public", to: "" }],
    }),
    new HtmlWebpackPlugin({
      template: "src/index.html",
      hash: true,
      publicPath: "/",
    }),
  ],
};
