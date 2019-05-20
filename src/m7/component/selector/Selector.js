/**
 * Created by XLBerry on 2019/5/16
 */
import React from "react";
import PropTypes from "prop-types";
import Datetime from "./Datetime";

export default class Selector extends React.PureComponent {
  render() {
    const { type } = this.props;
    if (type === "dict") {
      // 字典
    } else if (type === "datetime") {
      return <Datetime {...this.props}/>;
    }
    return null;
  }
}

Selector.propTypes = {
  ...Selector.propTypes,
  type: PropTypes.oneOf([
    "dict", "datetime"
  ]).isRequired, // 选择器类型
};