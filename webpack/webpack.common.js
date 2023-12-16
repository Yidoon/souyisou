const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  mode: "development",
  devtool: "inline-cheap-source-map",
  entry: {
    content_script: "./src/content_script",
    popup: "./src/popup",
  },
  output: {
    path: path.resolve(__dirname, "../dist"),
    filename: "js/[name].js",
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css?$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [require("tailwindcss")],
              },
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "popup.html",
      template: path.resolve(__dirname, "../public/popup.html"),
      chunks: ["popup"],
    }),
    new MiniCssExtractPlugin(),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "../manifest.json"),
          to: path.resolve(__dirname, "../dist/manifest.json"),
        },
        {
          from: path.resolve(__dirname, "../public/icon.png"),
          to: path.resolve(__dirname, "../dist/icon.png"),
        },
      ],
    }),
  ],
};
