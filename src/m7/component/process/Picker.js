/**
 * Created by XLBerry on 2019/5/15
 */
import React from "react";
import ProcessComponent from "./ProcessComponent";

export default class Picker extends ProcessComponent {

  state = {
    show: 0
  };

  componentDidUpdate(prevProps, prevState, /*snapshot*/) {
    if (prevState.show === true && this.state.show === false) {
      setTimeout(() => {
        this.setState({
          show: 0,
          content: null,
          contentCls: null,
          cancelText: null, fail: null, confirmText: null, success: null, miss: null, callback: null,
        });
      }, 300);
    }
  }

  onReceive = ({ show = false, content, contentCls, cancelText, fail, confirmText, success, miss, callback }, userAction = false) => {
    if (this.state.show !== false) {
      if (!userAction && show === false) {
        callback = this.state.miss;
      }
      this.setState({
        show,
        content: !show ? this.state.content : content,
        contentCls: !show ? this.state.contentCls : contentCls,
        cancelText, fail,
        confirmText, success,
        miss
      }, callback);
    }
  };

  handleClick = (e) => {
    e.preventDefault();
    const action = e.target.dataset["action"];
    action && this.onReceive({ show: false, callback: this.state[action] }, true);
  };

  render() {
    const { show, content, contentCls, cancelText = "取消", confirmText = "确定" } = this.state;
    let display, maskCls, pickerCls;
    if (show === 0) {
      display = "none";
      maskCls = "m7-animate-fade-out";
      pickerCls = "m7-animate-slide-down";
    } else if (typeof show == "boolean") {
      if (show) {
        display = "block";
        maskCls = "m7-animate-fade-in";
        pickerCls = "m7-animate-slide-up";
      } else {
        display = "block";
        maskCls = "m7-animate-fade-out";
        pickerCls = "m7-animate-slide-down";
      }
    }

    return <div style={{ display }}>
      <div className={`m7-mask ${maskCls}`} data-action="miss" onClick={this.handleClick}/>
      <div className={`m7-picker ${pickerCls}`}>
        <div className="m7-picker__hd">
          <a href="javascript:" className="m7-picker__action">
            <span data-action="fail" onClick={this.handleClick}>{cancelText}</span>
          </a>
          <a href="javascript:" className="m7-picker__action">
            <span data-action="success" onClick={this.handleClick}>{confirmText}</span>
          </a>
        </div>
        <div className={`m7-picker__bd ${contentCls}`}>{content}</div>
      </div>
    </div>;
  }
}

Picker.defaultProps = {
  type: "picker"
};