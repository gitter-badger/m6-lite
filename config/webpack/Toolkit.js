/**
 * Created by XLBerry on 2019/3/13
 */
const FS = require("fs");
const PATH = require("path");
const mOutput = require("./output");

let apps; // 缓存寻址app列表
/** 通过 Node.js fs 获取 APP 应用列表 */
function searchApp(findPath = "./src/app") {
  if (apps) return apps;
  apps = [];
  console.info("查找应用列表，匹配路径[./src/app/*]");
  let appPath = PATH.join(process.cwd(), findPath);
  let files0 = FS.readdirSync(appPath);
  files0.forEach(file0 => {
    let file0Path = `${appPath}/${file0}`;
    if (!FS.statSync(file0Path).isDirectory()) return;
    let files1 = FS.readdirSync(file0Path);
    files1.forEach(file1 => {
      let file1Path = `${file0Path}/${file1}`;
      if (["app.js", "app.json"].includes(file1)) {
        if (FS.statSync(file1Path).isFile()) {
          const { devServer, application } = require(file1Path) || {};
          if (typeof application === "object") {
            if (application.compiled) {
              application.src = application.src || `${file0Path}/index.js`;
              console.info(`发现应用版本[${application.version}] ${application.title}[${application.id}]，路径[${application.src}]`);
              apps.push({ devServer, application });
            }
          }
        } else console.error(`应用 [${file0}] 匹配失败，当前指定应用配置格式`);
      }
    });
  });
  return apps;
}

const ENV_STRING = process.env["env"] || "";
const ENV = ENV_STRING ? JSON.parse(ENV_STRING) : {};

/** 运行环境 */
function getEnv() {
  return {
    mode: ENV.mode || "dev", // 运行环境 dev build release
    debug: ENV.debug || false, // 是否调试编译m7内核
    version: process.env.npm_package_version
  };
}

/**
 * 遍历指定文件夹内所有文件
 * @param filePath
 * @param rMap
 * @returns {Array}
 */
function searchFiles(filePath, rMap = {}) {
  if (!exists(filePath, false)) {
    return rMap;
  }
  let files = FS.readdirSync(filePath), extName, key;
  files.forEach(function (fileName) {
    let fileDir = PATH.join(filePath, fileName); // 文件绝对路径
    let stats = FS.statSync(fileDir);
    if (stats.isFile()) {
      extName = PATH.extname(fileName).toLowerCase();
      const { path, outputImage, outputJS, outputCss } = mOutput.get();
      if (/\.(png|jpeg|jpg|gif|svg|svgz|md|ico)$/.test(extName)) {
        key = PATH.join(path, outputImage);
      } else if (/\.(js|jsx)$/.test(extName)) {
        key = PATH.join(path, outputJS);
      } else if (/\.css$/.test(extName)) {
        key = PATH.join(path, outputCss);
      } else {
        key = "";
      }
      if (key) {
        rMap[key] = rMap[key] || [];
        rMap[key].push(fileDir.replace(new RegExp("/", "g"), "\\"));
      }
    } else if (stats.isDirectory()) {
      searchFiles(fileDir, rMap); // 递归遍历
    }
  });
  return rMap;
}

/**
 * 判断文件夹是否存在
 * @param path
 * @param mkdir 创建文件夹
 * @returns {boolean}
 */
function exists(path, mkdir) {
  try {
    FS.accessSync(path, FS.F_OK);
    return true;
  } catch (e) {
    if (mkdir) {
      FS.mkdirSync(path);
    }
    return false;
  }
}

/**
 * 复制文件
 * @param targetPath 目标位置
 * @param originalFile 源文件
 * @param charset
 */
function copyFile(targetPath, originalFile, charset) {
  exists(targetPath, true);
  let targetFileName = originalFile.substring(originalFile.lastIndexOf("\\"));
  if (targetFileName.indexOf("\\") === 0) {
    targetFileName.substring(1);
  }
  FS.writeFileSync(PATH.join(targetPath, targetFileName), FS.readFileSync(PATH.join(originalFile), charset));
}

/** 初始化环境文件 */
function initEnvFiles() {
  const { mode, debug } = getEnv();
  const { path, outputJS, outputCss, outputImage } = mOutput.get();

  if (["build", "release"].includes(mode)) {
    exists(path, true);
    let staticFiles = searchFiles(PATH.join(process.cwd(), "./output/static"));
    Object.keys(staticFiles).forEach(k => staticFiles[k].forEach(f => copyFile(k, f)));
    copyFile(PATH.join(path, outputJS), PATH.join(process.cwd(), `./output/compile/m7.min.js`), "utf-8");
  }

  // 添加m7运行过程依赖的css文件
  if (["dev", "build", "release"].includes(mode) && !debug) {
    copyFile(PATH.join(path, outputCss), PATH.join(process.cwd(), `./output/compile/css/m7.min.css`), "utf-8");
  }
}

module.exports = {
  searchApp, getEnv, initEnvFiles
};