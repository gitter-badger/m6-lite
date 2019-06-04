/**
 * Created by XLBerry on 2019/6/3
 */
import React from "react";
import M7 from "m7";
import * as DataFor from "./DataFor";

@M7.create({ namespace: "dict-view" })
export default class MyDict extends React.PureComponent {
  render() {
    return <div>
      <div className="m7-cells__title">字典</div>
      <div className="m7-cells">
        <M7.Selector id="dict1" type="dict" title="字典1" placeholder="请选择字典1" dataFor={DataFor}/>
        <M7.Selector id="dict2" type="dict" title="字典2" placeholder="请选择字典2" searchable mode="multiple" dataFor={DataFor}/>
      </div>
    </div>;
  }
}