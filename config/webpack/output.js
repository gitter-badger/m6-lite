/**
 * Created by XLBerry on 2019/3/13
 */
const PATH = require("path");

let pathEnv;

function get() {
  if (pathEnv) return pathEnv;
  const {mode} = require("./Toolkit").getEnv();
  pathEnv = {
    path: PATH.join(process.cwd(), mode === "dev" ? "" : "output/", mode),
    publicPath: mode === "dev" ? "/" : "./",
    filename: `js/[name].js`,
    sourceMapFilename: "js/[name].js.map",

    outputJS: "js/",
    outputCss: "css/",
    outputImage: "image/",
    outputFont: "font/",

    buildSrc: PATH.join(process.cwd(), "./src/") // 编译资源路径
  };
  return pathEnv;
}

function target() {
  const { path, publicPath, filename, sourceMapFilename } = get();
  return { path, publicPath, filename, sourceMapFilename };
}

module.exports = {
  get, target
};