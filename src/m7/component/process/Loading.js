/**
 * Created by XLBerry on 2019/5/14
 */
import React from "react";
import ProcessComponent from "./ProcessComponent";

export default class Loading extends ProcessComponent {

  state = {};

  onReceive = ({ show = false, title }) => {
    this.setState({ show, title });
  };

  render() {
    const { title, show } = this.state;
    return <div style={{ display: show ? "block" : "none" }}>
      <div className="m7-mask_transparent"/>
      <div className="m7-loading-toast">
        <i className="m7-loading-icon"/>
        <div className="m7-loading-toast__content">{title}</div>
      </div>
    </div>;
  }
}

Loading.defaultProps = {
  type: "loading"
};
