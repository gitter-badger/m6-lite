/**
 * Created by XLBerry on 2019/6/24
 */
import React from "react";
import Header from "../component/Header";
import M7 from "m7";
import "./my-actionsheet.less";

export default class MyActionSheet extends React.Component {

  handlePickerMiss = () => {
    console.log("触发隐藏");
  };

  handlePickerCancel = () => {
    console.log("触发取消");
  };

  handlePickerConfirm = () => {
    console.log("触发确定");
  };

  handleSubmit = () => {
    M7.showPicker({
      fail: this.handlePickerCancel,
      miss: this.handlePickerMiss,
      success: this.handlePickerConfirm,
      contentCls: "demo-actionsheet",
      content: <div>
        <div className="demo-actionsheet__hd">
          <p className="demo-actionsheet__title">这是一个标题，可以为一行或者两行。</p>
        </div>
        <div className="demo-actionsheet__bd">
          <div className="demo-actionsheet__cell">示例菜单</div>
          <div className="demo-actionsheet__cell">示例菜单</div>
          <div className="demo-actionsheet__cell">示例菜单</div>
          <div className="demo-actionsheet__cell">示例菜单</div>
        </div>
        <div className="demo-actionsheet__action">
          <div className="demo-actionsheet__cell" onClick={M7.hidePicker}>取消</div>
        </div>
      </div>
    });
  };

  render() {
    return <div>
      <Header title="ActionSheet" desc="过程交互 - 弹出式菜单"/>
      <div style={{ padding: "30px 15px 40px 15px" }}>
        <M7.Button title="To ActionSheet" type="default" onClick={this.handleSubmit}/>
      </div>
    </div>;
  }
}