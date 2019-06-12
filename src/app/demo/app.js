/**
 * Created by XLBerry on 2019/4/29
 */

const devServer = {
  host: "0.0.0.0",
  port: 8001,
  // 举例：localhost:8001/api/xxx 代理到 http://192.168.10.183:8103/api/xxx,如果用pathRewrite重写则代理到http://192.168.10.183:8103/xxx
  proxy: {
    "/api": {
      "target": "http://192.168.10.183:8103", // 接口的域名
      "pathRewrite": {"^/api": ""}, // 如果接口本身没有/api需要通过pathRewrite来重写了地址
      "changeOrigin": true, // 如果接口跨域，需要进行这个参数配置
    },
    "/weather_mini": {
      "target": "http://wthrcdn.etouch.cn",
      "pathRewrite": {"^/weather_mini": "/weather_mini"},
      "changeOrigin": true,
    }
  }
};

// 应用配置
const application = {
  "id": "demo", // 应用ID，唯一且英文或者英文数字
  "title": "M6 Lite", // 应用名称，网页头名
  "src": "", // 应用入口，默认应用文件夹下index.js，可自行指定，例如./src/app/example/index.js
  "version": 101, // 应用版本
  "compiled": true, // 是否编译
  "favicon": "image/favicon.ico",
  "js": [], // 初始写入html的js集 "./cordova.js"
  "css": [], // 初始写入html的css集
  "template": "", // 页面模板
  "mock": true, // 添加mock模块
  // 运行环境全局变量
  "scope": {
    "mock": true // 开发模式是否启用mock测试接口
  }
};

module.exports = {devServer, application};