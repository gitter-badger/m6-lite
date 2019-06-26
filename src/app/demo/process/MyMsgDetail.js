/**
 * Created by XLBerry on 2019/6/25
 */
import React from "react";
import M7 from "m7";
import "./my-msg.less";

export default class MyMsgDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.props.history.getState() || {};
  }

  getIconCls = (icon) => {
    switch (icon) {
      case "success": return "weui-icon-success";
      case "info": return "weui-icon-info";
      case "warn": return "weui-icon-warn";
      case "waiting": return "weui-icon-waiting";
      default: return null;
    }
  };

  render() {
    const { icon, title, content, primaryText, primaryClick, secondText, secondClick, desc, tips, } = this.state;
    return <div className="demo-msg">
      <div className="demo-msg__icon-area">
        <i className={`weui-icon_msg ${this.getIconCls(icon)}`}/>
      </div>
      <div className="demo-msg__text-area">
        <h2 className="demo-msg__title">{title}</h2>
        <div className="demo-msg__desc">{content}</div>
      </div>
      <div className="demo-msg__tips-area">
        <div className="demo-msg__tips">{desc}</div>
      </div>
      <div className="demo-msg__opr-area">
        <div className="demo-btn-area">
          { primaryText? <M7.Button title={primaryText} type="primary" onClick={primaryClick}/> : null }
          { secondText? <M7.Button title={secondText} type="default" onClick={secondClick}/> : null }
        </div>
      </div>
      <div className="demo-msg__tips-area">
        <div className="demo-msg__tips">{tips}</div>
      </div>
    </div>;
  }
}