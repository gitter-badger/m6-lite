/**
 * Created by XLBerry on 2019/3/13
 */
let toolKit = require("./Toolkit");
const PATH = require("path");
const FS = require("fs");

const staticSrc = [
  "/image/favicon.ico",
  "/js/m7-boot.min.js",
  "/js/exif-js.js",
  "/css/m7.css",
  "/css/m7.min.css",
];

function get() {
  let apps = toolKit.searchApp(), server = {
    host: "0.0.0.0",
    hot: true,
    compress: true,
    port: 8888,
    https: false,
    historyApiFallback: true,
    inline: true,
    contentBase: `./${toolKit.getEnv().mode}`,
    proxy: {
      "/": {
        bypass: (req, res, proxyOptions) => {
          let originalUrl = req["originalUrl"];
          if (staticSrc.includes(originalUrl)) {
            let rwUrl = `./output/static/${originalUrl.substring(originalUrl.lastIndexOf("/") + 1)}`;
            res.write(FS.readFileSync(PATH.join(process.cwd(), rwUrl)));
            res.end();
          } else {
            // res.redirect(302, originalUrl);
          }
        }
      }
    }
  };

  apps.forEach(({ devServer = {} }) => {
    // 目前只接受配置 host、port和proxy代理
    const { host = server.host, port = server.port, proxy } = devServer;
    if (proxy) {
      Object.assign(server.proxy, proxy);
    }
    server.host = host;
    server.port = port;
  });

  return server;
}

module.exports = {
  get
};