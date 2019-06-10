/**
 * Created by XLBerry on 2019/6/6
 */
import React from "react";
import PropTypes from "prop-types";
import "./header.less";

export default function Header(props) {
  const { title, desc, onBack = () => window.M7History.go(-1) } = props;
  return (<div>
    <i className="weui-icon-back page-back" onClick={onBack}/>
    <div className="page-hd">
      <div className="bee-bg" style={{ backgroundImage: "url(./image/bee_bg.png)" }}/>
      <h1 className="page-title">{title}</h1>
      <div className="page-desc">{desc}</div>
    </div>
  </div>);
}

Header.propTypes = {
  title: PropTypes.node,
  desc: PropTypes.node,
  onBack: PropTypes.func,
};