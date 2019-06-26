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
import MyGallery from "./gallery/MyGallery";
import MyIcons from "./icons/MyIcons";

import MyToast from "./process/MyToast";
import MyModal from "./process/MyModal";
import MyActionSheet from "./process/MyActionSheet";
import MyNotification from "./process/MyNotification";
import MyMsg from "./process/MyMsg";
import MyMsgDetail from "./process/MyMsgDetail";

ReactDOM.render(<M7.Re>
  <M7.Re path="/" component={IndexView}/>
  <M7.Re path="/button" component={MyButton} title="按钮"/>
  <M7.Re path="/input" component={MyInput} title="输入框"/>
  <M7.Re path="/dict" component={MyDict} title="字典"/>
  <M7.Re path="/list" component={MyList} title="列表"/>
  <M7.Re path="/list-detail" component={MyListDetail} title="列表元素内容"/>
  <M7.Re path="/uploader" component={MyUploader} title="Uploader"/>
  <M7.Re path="/gallery" component={MyGallery} title="Gallery"/>
  <M7.Re path="/icons" component={MyIcons} title="Icons"/>

  <M7.Re path="/process/toast" component={MyToast} title="Toast"/>
  <M7.Re path="/process/modal" component={MyModal} title="Modal"/>
  <M7.Re path="/process/actionsheet" component={MyActionSheet} title="Actionsheet"/>
  <M7.Re path="/process/notification" component={MyNotification} title="Notification"/>
  <M7.Re path="/process/msg" component={MyMsg} title="Msg"/>
  <M7.Re path="/process/msg/detail" component={MyMsgDetail}/>
</M7.Re>, document.getElementById("m7-main"));
