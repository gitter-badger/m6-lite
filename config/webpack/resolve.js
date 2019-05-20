/**
 * Created by XLBerry on 2019/3/13
 */
const { buildSrc } = require("./output").get();
const { mode, debug } = require("./Toolkit").getEnv();

function get() {
  let resolve = {
    modules: ["node_modules"],
    alias: {}
  };
  if (mode === "dev" && debug) {
    resolve.modules.unshift(buildSrc); // 调试M7内核，文件夹命名m7
  }
  return resolve;
}

module.exports = {
  get
};