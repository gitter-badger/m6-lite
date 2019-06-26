/**
 * Created by XLBerry on 2019/6/24
 */
import React from "react";
import Header from "../component/Header";
import M7 from "m7";

export default class MyModal extends React.Component {

  handleSubmit = () => {
    M7.showModal({
      title: "弹窗标题",
      content: "弹窗内容，告知当前状态、信息和解决方法，描述文字尽量控制在三行内",
      cancelText: "辅助操作",
      confirmText: "主操作"
    });
  };

  render() {
    return <div>
      <Header title="Modal" desc="过程交互 - 对话框"/>
      <div style={{ padding: "30px 15px 40px 15px" }}>
        <M7.Button title="To Modal" type="default" onClick={this.handleSubmit}/>
      </div>
    </div>;
  }
}