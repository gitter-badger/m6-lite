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
          content: null
        });
      }, 300);
    }
  }

  onReceive = ({ show = false, content, cancelText, cancel, confirmText, confirm, callback }) => {
    this.setState({
      show,
      content,
      cancelText, cancel,
      confirmText, confirm
    }, callback);
  };

  handleClick = (e) => {
    const action = e.target.dataset["action"];
    if (action === "cancel") {
      this.onReceive({ show: false, callback: this.state.cancel });
    } else if (action === "select") {
      this.onReceive({ show: false, callback: this.state.confirm });
    }
  };

  render() {
    const { show, content, cancelText = "取消", confirmText = "确定" } = this.state;
    let rDisplay, maskCls, pickerCls;
    if (show === 0) {
      rDisplay = "none";
      maskCls = "m7-animate-fade-out";
      pickerCls = "m7-animate-slide-down";
    } else if (typeof show === "boolean") {
      if (show) {
        rDisplay = "block";
        maskCls = "m7-animate-fade-in";
        pickerCls = "m7-animate-slide-up";
      } else {
        rDisplay = "block";
        maskCls = "m7-animate-fade-out";
        pickerCls = "m7-animate-slide-down";
      }
    }

    return <div style={{ display: rDisplay }}>
      <div data-action="cancel" className={`m7-mask ${maskCls}`} onClick={this.handleClick}/>
      <div className={`m7-picker ${pickerCls}`}>
        <div className="m7-picker__hd">
          <a href="javascript:" data-action="cancel" className="m7-picker__action"
             onClick={this.handleClick}>{cancelText}</a>
          <a href="javascript:" data-action="select" className="m7-picker__action"
             onClick={this.handleClick}>{confirmText}</a>
        </div>
        <div className="m7-picker__bd">{content}</div>
      </div>
    </div>;
  }
}

Picker.defaultProps = {
  type: "picker"
};