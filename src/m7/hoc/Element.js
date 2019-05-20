/**
 * Created by XLBerry on 2019/5/6
 */
import React from "react";
import enhance, { setRef, getRef, validate } from "./Enhance";
import PropTypes from "prop-types";
import { Consumer } from "./View";

export default function Element() {
  return function wrapWithConnect(WrapperComponent) {

    enhance(WrapperComponent.prototype, setRef, getRef, validate); // 组件增强

    function HocElement(props) {
      return <Consumer>{
        ({ viewProxy }) => <WrapperComponent {...props} viewProxy={viewProxy}/>
      }</Consumer>;
    }

    HocElement.defaultProps = {
      ...HocElement.defaultProps,
      subclass: false,
      className: ""
    };

    HocElement.propTypes = {
      ...HocElement.propTypes,
      subclass: PropTypes.bool,
      id: PropTypes.string, // 数据标识
      ft: PropTypes.node, // 补充
      rules: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.object
      ])
    };

    return HocElement;
  };
}
