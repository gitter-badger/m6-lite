/**
 * Created by XLBerry on 2019/5/15
 */
import React from "react";
import ProcessComponent from "./ProcessComponent";

export default class Notice extends ProcessComponent {
  state = {};

  onReceive = ({ title, className, type, duration }) => {
    this.setState({ title, className, type, duration }, () => {
      duration && setTimeout(() => {
        this.setState({ type: null, title: null, className: null, duration: null });
      }, duration);
    });
  };

  handleClick = (e) => {
    e.preventDefault();
    this.setState({ type: null, title: null, className: null, duration: null });
  };

  render() {
    const { title, className, type, duration } = this.state;
    return <div className={`m7-toptips m7-toptips--${type} ${className}`}>
      <p className="m7-toptips__title">{title}</p>
      {
        duration ? null : <div><i className="m7-toptips__ft weui-icon-clear" onClick={this.handleClick}/></div>
      }
    </div>;
  }
}

Notice.defaultProps = {
  type: "notice"
};