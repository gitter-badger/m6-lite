/**
 * Created by XLBerry on 2019/4/29
 */

import React from "react";
import ReactDOM from "react-dom";
import M7 from "m7";
import "./app.less";
require.context("../../res");

import IndexView from "./index/IndexView";
import MyButton from "./button/MyButton";
import MyInput from "./input/MyInput";
import MyDict from "./dict/MyDict";

ReactDOM.render(<M7.Re>
  <M7.Re path="/" component={IndexView}/>
  <M7.Re path="/button" component={MyButton} title="按钮"/>
  <M7.Re path="/input" component={MyInput} title="输入框"/>
  <M7.Re path="/dict" component={MyDict} title="字典"/>
</M7.Re>, document.getElementById("m7-main"));
