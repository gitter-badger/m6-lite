/**
 * Created by XLBerry on 2019/4/29
 */

import React from "react";
import ReactDOM from "react-dom";
import M7 from "m7";
import "./app.less";
require.context("../../res");

import MainView from "./main/MainView";
import MainView2 from "./main/MainView2";

ReactDOM.render(<M7.Re>
  <M7.Re path="/" component={MainView} title="主页"/>
  <M7.Re path="/main2" component={MainView2} title="主页2"/>
</M7.Re>, document.getElementById("m7-main"));
