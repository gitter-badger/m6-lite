/**
 * 对话框
 * Created by XLBerry on 2019/6/24
 */
import React from "react";
import ProcessComponent from "./ProcessComponent";

export default class Modal extends ProcessComponent {
  state = {};

  onReceive = (opts) => {
    this.setState(opts);
  };

  handleClick = (e) => {
    e.preventDefault();
    const action = e.target.dataset["action"];
    typeof this.state[action] == "function" && this.state[action](e);
    typeof this.state.complete == "function" && this.state.complete(e);
    this.setState({
      show: false,
      title: null, content: null, cancelText: null, cancelColor: null, confirmText: null, confirmColor: null,
      fail: null, success: null, complete: null,
    });
  };

  render() {
    const { show, title, content, cancelText, cancelColor, confirmText, confirmColor } = this.state;
    return <div style={{ display: show ? "block" : "none" }}>
      <div className="m7-mask"/>
      <div className="m7-modal">
        <div className="m7-modal__hd">
          <strong className="m7-modal__title">{title}</strong>
        </div>
        <div className="m7-modal__bd">{content}</div>
        <div className="m7-modal__ft">
          {
            cancelText ?
              <a href="javascript:" className="m7-modal__btn m7-modal__btn--default" data-action="fail"
                 onClick={this.handleClick}
                 style={{ color: cancelColor }}>{cancelText}</a> : null
          }
          <a href="javascript:" className="m7-modal__btn m7-modal__btn--primary" data-action="success"
             onClick={this.handleClick} style={{ color: confirmColor }}>{confirmText}</a>
        </div>
      </div>
    </div>;
  }
}

Modal.defaultProps = {
  type: "modal"
};