/**
 * Created by XLBerry on 2019/5/14
 */
import React from "react";
import ProcessComponent from "./ProcessComponent";

export default class Loading extends ProcessComponent {

  state = {};

  onReceive = ({ show = false, mask = true, title, icon, duration, complete }) => {
    let lastComplete;
    if (!show) {
      lastComplete = this.state.complete;
    }
    this.setState({
      show, mask, title, icon, complete
    }, () => {
      typeof lastComplete == "function" && lastComplete();
      duration && setTimeout(() => {
        this.setState({
          show: false, title: null, icon: null, complete: null,
        });
      }, duration);
    });

  };

  getIconCls = (icon) => {
    switch (icon) {
      case "loading": return "m7-icon-loading";
      case "success": return "weui-icon-success-no-circle";
      case "info": return "weui-icon-info";
      case "warn": return "weui-icon-warn";
      case "waiting": return "weui-icon-waiting";
      default: return null;
    }
  };

  render() {
    const { show, mask, title, icon } = this.state, iconCls = this.getIconCls(icon);
    return <div style={{ display: show ? "block" : "none" }}>
      { mask ? <div className="m7-mask_transparent"/> : null }
      <div className={`m7-loading-toast ${iconCls ? "" : "m7-loading-toast--noicon"}`}>
        { iconCls ? <i className={`m7-loading__icon ${iconCls}`}/> : null }
        <div className="m7-loading-toast__content">{title}</div>
      </div>
    </div>;
  }
}

Loading.defaultProps = {
  type: "loading"
};
