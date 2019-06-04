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
import MainView3 from "./main/MainView3";

import MyDict from "./dict/MyDict";

ReactDOM.render(<M7.Re>
  <M7.Re path="/" component={MainView}/>
  <M7.Re path="/main2" component={MainView2} title="主页2"/>
  <M7.Re path="/main3" component={MainView3} title="主页3"/>

  <M7.Re path="/dict" component={MyDict} title="字典"/>
</M7.Re>, document.getElementById("m7-main"));
