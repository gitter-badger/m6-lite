/**
 * Created by XLBerry on 2019/4/30
 */

const PATH = require("path");
const mPlugins = require("./webpack/plugins");
const mRules = require("./webpack/rules");
const mResolve = require("./webpack/resolve");
const mExternals = require("./webpack/externals");
const mOptimization = require("./webpack/optimization");

const mode = require("./webpack/Toolkit").getEnv().mode;
let entry, output, devtool;
if (mode === "libBuild") {
  devtool = "eval-source-map";
  entry = { index: "./src/m7/index.js" };
  output = {
    path: PATH.join(process.cwd(), "./output/compile/"),
    publicPath: "./",
    filename: "[name].js",
    library: "m7",
    libraryTarget: "umd",
    umdNamedDefine: true
  };
} else {
  entry = { m7: "./src/m7/index.js" };
  output = {
    path: PATH.join(process.cwd(), "./output/compile/"),
    filename: `[name].min.js`,
    library: "m7",
    libraryTarget: "umd",
    umdNamedDefine: true
  };
}

module.exports = {
  devtool,
  entry,
  output,
  plugins: mPlugins.get(),
  module: { rules: mRules.get() },
  resolve: mResolve.get(),
  externals: mExternals.get(),
  optimization: mOptimization.get(),
  mode: mode === "libBuild" ? "development" : "production"
};
