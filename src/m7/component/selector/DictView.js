/**
 * Created by XLBerry on 2019/5/21
 */
import React from "react";
import { setRef, getRef } from "../../hoc/Enhance";
import Search from "../form/Search";

export default class DictView extends React.Component {
  setRef = setRef.value.bind(this);
  getRef = getRef.value.bind(this);

  render() {
    return <div>
      <Search/>
      <div>内容</div>
    </div>;
  }
}