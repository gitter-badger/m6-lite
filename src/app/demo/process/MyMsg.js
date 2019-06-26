/**
 * Created by XLBerry on 2019/6/25
 */
import React from "react";
import Header from "../component/Header";
import M7 from "m7";

export default class MyMsg extends React.Component {

  componentDidMount() {
    console.log(this.props.history.getState());
  }

  handleSubmit = (e) => {
    const type = e.target.dataset.type;
    if (type === "success") {
      M7.navigate({
        url: "/process/msg/detail",
        state: {
          icon: "success",
          title: "操作成功",
          content: <div className="demo-msg__desc">内容详情，可根据实际需要安排，如果换行则不超过规定长度，居中展现<a href="javascript:void(0);">文字链接</a></div>,
          primaryText: "推荐操作",
          primaryClick: function () {
            console.log("当前点击了推荐操作");
          },
          secondText: "辅助操作",
          secondClick: function () {
            console.log("当前点击了辅助操作");
          },
          tips: "提示详情，可根据实际需要安排，如果换行则不超过规定长度，居中展现"
        }
      });
    } else if (type === "warn") {
      M7.navigate({
        url: "/process/msg/detail",
        state: {
          icon: "warn",
          title: "操作失败",
          content: "内容详情，可根据实际需要安排，如果换行则不超过规定长度，居中展现",
          secondText: "辅助操作",
          secondClick: function () {
            console.log("当前点击了辅助操作");
            M7.navigate({
              delta: 2
            });
          },
          desc: "提示详情，可根据实际需要安排，如果换行则不超过规定长度，居中展现"
        }
      });
    }
  };

  render() {
    return <div>
      <Header title="Msg" desc="提示页"/>
      <div style={{ padding: "30px 15px 40px 15px" }}>
        <M7.Button title="成功提示页" type="default" data-type="success" onClick={this.handleSubmit}/>
        <M7.Button title="失败提示页" type="default" data-type="warn" onClick={this.handleSubmit}/>
      </div>
    </div>;
  }
}