/**
 * Created by XLBerry on 2019/3/13
 */
const ExtractTextPlugin = require("extract-text-webpack-plugin"); // 额外分开打包
const {mode} = require("./Toolkit").getEnv();
const {buildSrc, outputCss, outputImage} = require("./output").get();

function get() {
  return [
    {
      test: /\.(js|jsx)$/,
      type: "javascript/auto",
      enforce: "pre",
      exclude: [/node_modules/],
      include: [buildSrc],
      use: [
        {loader: "eslint-loader"}
      ]
    },
    {
      test: /\.(js|jsx)$/,
      type: "javascript/auto",
      exclude: [/node_modules/],
      include: [buildSrc],
      use: [{
        loader: "babel-loader",
        options: {cacheDirectory: mode === "dev"}
      }]
    },
    {
      test: /\.css$/,
      type: "javascript/auto",
      exclude: [/node_modules/],
      include: [buildSrc],
      use: [{loader: "file-loader", options: {name: `${outputCss}[name].[ext]`}}]
    },
    {
      test: /\.less$/,
      type: "javascript/auto",
      exclude: [/node_modules/],
      include: [buildSrc],
      use: ExtractTextPlugin.extract({
        fallback: "style-loader",
        use: [
          {loader: "css-loader"},
          {loader: "less-loader"}
        ]
      })
    },
    {
      test: /\.(png|jpeg|jpg|gif|svg|svgz|md|ico)$/,
      type: "javascript/auto",
      exclude: [/node_modules/],
      include: [buildSrc],
      use: [{loader: "file-loader", options: {name: `${outputImage}[name].[ext]`}}]
    }
  ];
}

module.exports = {
  get
};