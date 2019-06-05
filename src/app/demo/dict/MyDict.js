/**
 * Created by XLBerry on 2019/6/3
 */
import React from "react";
import M7 from "m7";
import * as DataFor from "./DataFor";
import * as DataForCascade from "./DataForCascade";

@M7.create({ namespace: "dict-view" })
export default class MyDict extends React.PureComponent {
  render() {
    return <div>
      <div className="m7-cells__title">字典</div>
      <div className="m7-cells">
        <M7.Selector id="dict1" type="dict" title="单选" placeholder="请选择字典1" dataFor={DataFor}/>
        <M7.Selector id="dict2" type="dict" title="多选" placeholder="请选择字典2" searchable multiple dataFor={DataFor}/>
        <M7.Selector id="dict3" type="dict" title="多标签单选" placeholder="请选择字典3" cascade dataFor={DataForCascade}/>
        <M7.Selector id="dict4" type="dict" title="多标签多选" placeholder="请选择字典4" cascade multiple dataFor={DataForCascade}
                     displayRender={({ value, label }) => label.map((d) => d.detail).join("") + value.detail}/>
      </div>
    </div>;
  }
}