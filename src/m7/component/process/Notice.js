/**
 * Created by XLBerry on 2019/5/15
 */
import React from "react";
import ProcessComponent from "./ProcessComponent";

export default class Notice extends ProcessComponent {
  state = {};

  onReceive = ({ title, className, type, autoHidden = true, delay = 2000 }) => {
    this.setState({ title, className, type }, () => {
      autoHidden && setTimeout(() => {
        this.setState({ type: null, title: null, className: null });
      }, delay);
    });
  };

  render() {
    const { title, className, type } = this.state;
    return <div className={`m7-toptips m7-toptips_${type} ${className}`}>{title}</div>;
  }
}

Notice.defaultProps = {
  className: "",
  type: "notice"
};