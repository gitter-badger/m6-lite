/**
 * Created by XLBerry on 2019/6/6
 */
import M7 from "m7";
import React from "react";
import PropTypes from "prop-types";
import "./header.less";

export default function Header(props) {
  const { title, desc, onBack } = props;
  return (<div>
    <i className="weui-icon-back page-back" onClick={onBack}/>
    <div className="page-hd">
      <div className="bee-bg" style={{ backgroundImage: "url(./image/bee_bg.png)" }}/>
      <h1 className="page-title">{title}</h1>
      <div className="page-desc">{desc}</div>
    </div>
  </div>);
}

Header.defaultProps = {
  onBack: function () {
    return M7.navigate({ delta: 1 });
  }
};

Header.propTypes = {
  title: PropTypes.node,
  desc: PropTypes.node,
  onBack: PropTypes.func,
};