/**
 * Created by XLBerry on 2019/5/20
 */

import React from "react";
import PropTypes from "prop-types";

export default class Button extends React.PureComponent {

  handleClick = (e) => {
    const { status, onClick } = this.props;
    if (status === "loading" || status === "disabled") return false;
    else return typeof onClick === "function" && onClick(e);
  };

  render() {
    const { title, display, type, status, children } = this.props;
    return <a href="javascript:" className={`m7-btn m7-btn_${display} m7-btn_${status} m7-btn_${type}`} onClick={this.handleClick}>
      {status === "loading" ? <i className="m7-loading-icon"/> : null}
      {title}
      {children}
    </a>;
  }

}

Button.propTypes = {
  ...Button.propTypes,
  type: PropTypes.oneOf([
    "primary",
    "default",
    "warn"
  ]).isRequired,
  status: PropTypes.oneOf([
    "disabled",
    "loading"
  ]),
  display: PropTypes.oneOf([
    "block"
  ])
};

/*
function shouldUpdate(/!*prevProps, nextProps*!/) {
  return true;
}

export default React.memo(Button, shouldUpdate);*/
