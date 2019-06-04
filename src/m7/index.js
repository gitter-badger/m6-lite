/**
 * Created by XLBerry on 2019/5/5
 */

require("./utils/Prototype");
import "./index.less";

import Re from "./component/router/Re";
import create from "./hoc/WrapComponent";

import Button from "./component/form/Button";
import Input from "./component/input/Input";
import Selector from "./component/selector/Selector";
import List from "./component/list/List";
import ProcessUtils from "./component/process/index";

export default {
  Re,
  create,
  Button, Input, Selector,
  List,
  ...ProcessUtils,
};