/**
 * Created by XLBerry on 2019/6/3
 */
import React from "react";
import M7 from "m7";
import Header from "../component/Header";
import * as DataFor from "./DataFor";
import * as DataForCascade from "./DataForCascade";

@M7.create({ namespace: "dict-view" })
export default class MyDict extends React.Component {

  handleChange = ({ id, type, data }) => {
    console.log("handleChange", `类型[${type}]，id[${id}]，data`, data);
    this.setState({});
  };

  render() {
    return <div>
      <Header title="Dict" desc="表单字典，提供字典容器对象，支持标准格式数据载入"/>
      <div className="m7-cells__title">字典</div>
      <div className="m7-cells">
        <M7.Selector id="dict1" type="dict" title="单选" placeholder="请选择字典1" dataFor={DataFor} onChange={this.handleChange}/>
        <M7.Selector id="dict2" type="dict" title="多选" placeholder="请选择字典2" searchable multiple dataFor={DataFor} onChange={this.handleChange}/>
        <M7.Selector id="dict3" type="dict" title="多标签单选" placeholder="请选择字典3" cascade dataFor={DataForCascade} onChange={this.handleChange}/>
        <M7.Selector id="dict4" type="dict" title="多标签多选" placeholder="请选择字典4" cascade multiple dataFor={DataForCascade} onChange={this.handleChange}
                     displayRender={({ value, label }) => label.map((d) => d.detail).join("") + value.detail}/>
      </div>
      <div className="m7-cells__title">页面数据</div>
      <div className="m7-cells">
        <div className="m7-cell">
          <div style={{flex: 1}}>{JSON.stringify(this.state)}</div>
        </div>
      </div>
    </div>;
  }
}