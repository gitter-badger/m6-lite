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
import MyList from "./list/MyList";
import MyListDetail from "./list/MyDetail";
import MyUploader from "./uploader/MyUploader";

ReactDOM.render(<M7.Re>
  <M7.Re path="/" component={IndexView}/>
  <M7.Re path="/button" component={MyButton} title="按钮"/>
  <M7.Re path="/input" component={MyInput} title="输入框"/>
  <M7.Re path="/dict" component={MyDict} title="字典"/>
  <M7.Re path="/list" component={MyList} title="列表"/>
  <M7.Re path="/list-detail" component={MyListDetail} title="列表元素内容"/>
  <M7.Re path="/uploader" component={MyUploader} title="Uploader"/>
</M7.Re>, document.getElementById("m7-main"));
