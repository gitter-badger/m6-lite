/**
 * Created by XLBerry on 2019/3/13
 */
const webpack = require("webpack");  // 加载webpack模块
const HtmlWebpackPlugin = require("html-webpack-plugin"); // 加载自动化HTML自动化编译插件
const ExtractTextPlugin = require("extract-text-webpack-plugin"); // 额外分开打包
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin"); // CSS压缩
const toolKit = require("./Toolkit");
const { outputJS, outputCss } = require("./output").get();

function getHtmlPages() {
  const { mode, debug } = toolKit.getEnv();
  return toolKit.searchApp().map(({ application }) => {
    const { id, title, favicon, version, js = [], css = [], template, scope } = application;
    let asyncJS = [`${outputJS}exif-js.js`], denpOnCSS = [];

    if (mode === "dev") {
      asyncJS.push(`${outputJS}${id}.js?v=${version}`);
      if (!debug) {
        denpOnCSS.push(`./${outputCss}m7.css?v=${version}`);
      }
      denpOnCSS.push(`./${outputCss}${id}-runtime.css?v=${version}`);
    } else if (mode === "build") {
      asyncJS.push(`${outputJS}${id}.js?v=${version}`);
      denpOnCSS = denpOnCSS.concat([
        `./${outputCss}m7.css?v=${version}`,
        `./${outputCss}${id}-runtime.css?v=${version}`
      ]);
    } else if (mode === "release") {
      asyncJS = asyncJS.concat([
        `${outputJS}react.production.min.js?v=${version}`,
        `${outputJS}react-dom.production.min.js?v=${version}`,
        `${outputJS}m7.min.js?v=${version}`,
        `${outputJS}${id}.js?v=${version}`
      ]);
      denpOnCSS = denpOnCSS.concat([
        `./${outputCss}m7.min.css?v=${version}`,
        `./${outputCss}${id}-runtime.css?v=${version}`
      ]);
    } else {
      return null; // 未认证模式
    }

    return new HtmlWebpackPlugin({
      template: template || "./config/webpack/template.html",
      filename: `${id}.html`,
      inject: false,
      hash: false,
      title: title || "M6-Lite",
      icon: favicon,
      env: {
        id,
        version,
        // env: toolKit.getEnv(),
        css: denpOnCSS.concat(css),
        js: js.concat(`${outputJS}m7-boot.min.js`),
        asyncJS,
        scope
      }
    });
  });
}

function get() {
  let envPlugin = [], exCssName = "[name]-runtime.css";
  const { mode } = toolKit.getEnv();
  if (mode === "dev") {
    envPlugin = envPlugin.concat(getHtmlPages());
  } else if (mode === "build") {
    envPlugin = envPlugin.concat(getHtmlPages());
  } else if (mode === "release") {
    envPlugin.push(new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: require("cssnano"),
      cssProcessorOptions: { safe: true, discardComments: { removeAll: true } },
      canPrint: true
    }));
    envPlugin = envPlugin.concat(getHtmlPages());
  } else if (mode === "libBuild") {
    exCssName = "m7.css";
  } else if (mode === "libRelease") {
    exCssName = "m7.min.css";
    envPlugin.push(new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: require("cssnano"),
      cssProcessorOptions: { safe: true, discardComments: { removeAll: true } },
      canPrint: true
    }));
  }
  return [].concat([
    // 定义环境变量
    new webpack.DefinePlugin({
      "M7ENV": JSON.stringify(toolKit.getEnv()), // 传入开发变量配置
      "M7PREFIX": "window.M7PREFIX"
    }),
    new ExtractTextPlugin({
      filename: `${outputCss}${exCssName}`,
      allChunks: true
    })
  ]).concat(envPlugin);
}

module.exports = {
  get
};