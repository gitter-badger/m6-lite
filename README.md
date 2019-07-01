English | 简体中文

<p align="center">
  <a href="javascript:" rel="noopener noreferrer">
    <img width="100" src="https://github.com/xlberry/m6-lite/blob/master/help/image/bee.png" alt="M6 Lite logo">
  </a>
</p>

<p align="center">
  <a href="javascript:"><img src="https://img.shields.io/badge/node-%3E%3D8-green.svg?style=flat-square" alt="Node Version"></a>
  <a href="https://travis-ci.org/xlberry/m6-lite"><img src="https://img.shields.io/travis/xlberry/m6-lite.svg?style=flat-square" alt="Build Status"></a>
</p>

<h2 align="center">
  <p style="font-size: initial; font-weight: normal; margin-top: 10px; color: gray;">基于 React 库和 WEUI 交互设计的轻量级表单类组件库</p>
</h2>

### 特性

- **简化** Component State Flux 数据流*
- **优化细节**，如请求列队，事件优化，函数防抖等
- **异步编码**，推荐 ES2015+ Async Functions 编码模式，借鉴 elm 概念 (Inspired by dva-model) 

### 例子预览

手机扫描

![Image](https://github.com/xlberry/m6-lite/blob/master/help/image/demo-qrcode.png)

[https://xlberry.github.io/m6-lite](https://xlberry.github.io/m6-lite/#/)

### 文档

- WeUI 视觉标准参考 [weui-design](https://github.com/weui/weui-design)
- 掌握 m6-lite 的所有 [API](https://github.com/xlberry/m6-lite/blob/master/help/m6-lite-api.md)
- 查看 m6-lite 配置方式 [API](https://github.com/xlberry/m6-lite/blob/master/help/m6-lite-config.md)

### 下一步

#### 安装

如果你想基于 m6-cli 创建项目，可安装构建工具 

[![npm version](https://img.shields.io/npm/v/m6-cli.svg?label=m6-cli&style=flat-square)](https://www.npmjs.com/package/m6-cli)

```cmd
npm install -g m6-cli
```

快速构建和迭代升级

```cmd
m6 init -f m6-cli
```

更多关于 m6-cli 请查阅 [m6-cli](https://github.com/xlberry/m6-cli)

#### 编译

```cmd
npm run dev
```

### 使用

#### global

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/xlberry/m6-lite@v1.0.0/output/compile/css/m7.min.css">
<script type="text/javascript" src="https://cdn.jsdelivr.net/gh/xlberry/m6-lite@v1.0.0/output/compile/m7.min.js"></script>
<script type="text/javascript">
  var Page1 = React.createElement(m7.create()(React.createElement("div")));
  var Page2 = React.createElement(m7.create()(React.createElement("div")));
  var useRe1 = React.createElement(m7.Re, { path: "/page1", component: Page1 });
  var useRe2 = React.createElement(m7.Re, { path: "/page2", component: Page2 });
  React.createElement(m7.Re, null, useRe1, useRe2);
</script>
```

#### import as module

```jsx harmony
import React from "react";
import M7 from "m7";
import Page1 from "./Page1.js";
import Page2 from "./Page2.js";

<M7.Re>
  <M7.Re path="/page1" component={Page1}/>
  <M7.Re path="/page2" component={Page2}/>
</M7.Re>
```

### 贡献

如果你有好的意见或建议，欢迎给我们提 issue 或 pull request

### License

[The MIT License](http://opensource.org/licenses/MIT)
