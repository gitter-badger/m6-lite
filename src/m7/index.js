/**
 * Created by XLBerry on 2019/5/5
 */

require("./utils/Prototype");
import "./index.less";

import Re from "./component/router/Re";
import history from "./component/router/History";
import create from "./hoc/WrapComponent";
import * as boost from "./hoc/Boost";
import request, { requestAsync } from "./utils/Fetch";

import Button from "./component/form/Button";
import Input from "./component/input/Input";
import Selector from "./component/selector/Selector";
import List from "./component/list/List";
import ProcessUtils from "./component/process/index"; // 弹窗通知组事件
import Uploader from "./component/uploader/Uploader";
import Gallery from "./component/uploader/Gallery";

export default {
  Re, navigate: history.navigate,
  create, boost, request, requestAsync,
  Button, Input, Selector,
  List, Uploader, Gallery,
  ...ProcessUtils,
};