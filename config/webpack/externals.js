/**
 * Created by XLBerry on 2019/3/13
 */
const { mode } = require("./Toolkit").getEnv();

function get() {
  let externals = {};
  if (mode === "build") {
    Object.assign(externals, {
      "react": "React",
      "react-dom": "ReactDOM"
    });
  } else if (mode === "release") {
    Object.assign(externals, {
      "react": "React",
      "react-dom": "ReactDOM",
      "m7": "m7.default"
    });
  } else if (mode === "libBuild") {
    // 开发模式加入node_modules，则关联的依赖库则从node_modules寻找，比如react，不能填React，因为没有这个大写的文件夹
    Object.assign(externals, {
      "react": "react",
      "react-dom": "react-dom"
    });
  } else if (mode === "libRelease") {
    Object.assign(externals, {
      "react": "React",
      "react-dom": "ReactDOM"
    });
  }
  return externals;
}

module.exports = {
  get
};