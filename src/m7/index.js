/**
 * Created by XLBerry on 2019/5/5
 */

require("./utils/Prototype");
import "./index.less";

import Re from "./component/router/Re";
import View from "./hoc/View";

import Button from "./component/form/Button";
import Input from "./component/input/Input";
import Selector from "./component/selector/Selector";
import ProcessUtils from "./component/process/index";

export default {
  Re,
  View,
  Button, Input, Selector,
  ...ProcessUtils,
};