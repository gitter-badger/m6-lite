/**
 * Created by XLBerry on 2019/6/25
 */
import React from "react";
import M7 from "m7";
import Header from "../component/Header";

export default class MyNotification extends React.Component {
  handleSubmit = (e) => {
    M7.showNotification({
      type: e.target.dataset.type,
      title: `通知提醒消息(${e.target.dataset.duration ? "自动消失" : "不消失"})`,
      duration: ~~e.target.dataset.duration
    });
  };

  render() {
    return <div>
      <Header title="Modal" desc="过程交互 - 通知栏组"/>
      <div className="m7-btns" style={{ padding: "30px 15px 40px 15px" }}>
        <M7.Button title="显示(自动消失)" type="default" data-type="info" data-duration="2000" onClick={this.handleSubmit}/>
        <M7.Button title="显示" type="default" data-type="warn" onClick={this.handleSubmit}/>
      </div>
    </div>;
  }
}