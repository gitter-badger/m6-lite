/**
 * Created by XLBerry on 2019/6/24
 */
import React from "react";
import M7 from "m7";
import Header from "../component/Header";

export default class MyToast extends React.Component {
  handleSubmit = (e) => {
    if (e.target.dataset.action === "loading") {
      M7.showLoading({
        icon: e.target.dataset.icon,
        title: "努力加载中",
      });
      setTimeout(() => {
        M7.hideLoading();
      }, 3000);
    } else {
      M7.showToast({
        icon: e.target.dataset.icon,
        title: "提示点什么东西",
        mask: false,
        duration: 1500
      });
    }
  };

  render() {
    return <div>
      <Header title="Loading" desc="过程交互 - 弹出Toast框"/>
      <div style={{ padding: "30px 15px 40px 15px" }}>
        <M7.Button title="To Loading" type="default" data-action="loading" data-icon="loading" onClick={this.handleSubmit}/>
        <M7.Button title="To Toast" type="default" data-action="toast" data-icon="waiting" onClick={this.handleSubmit}/>
      </div>
    </div>;
  }
}