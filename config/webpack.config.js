/**
 * Created by XLBerry on 2019/3/13
 */

const { initEnvFiles, getEnv } = require("./webpack/Toolkit");
const mEntry = require("./webpack/entry");
const mOutput = require("./webpack/output");
const mPlugins = require("./webpack/plugins");
const mRules = require("./webpack/rules");
const mResolve = require("./webpack/resolve");
const mExternals = require("./webpack/externals");
const mOptimization = require("./webpack/optimization");
const mDevServer = require("./webpack/dev-server");

initEnvFiles(); // 初始化文件准备

module.exports = {
  entry: mEntry.get(),
  output: mOutput.target(),
  plugins: mPlugins.get(),
  module: { rules: mRules.get() },
  resolve: mResolve.get(),
  externals: mExternals.get(),
  optimization: mOptimization.get(),
  mode: ["dev", "build"].includes(getEnv().mode) ? "development" : "production",
  devServer: mDevServer.get()
};
