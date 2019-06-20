/**
 * Created by XLBerry on 2019/6/12
 */
import React from "react";
import PropTypes from "prop-types";

export default class PreImage extends React.PureComponent {

  getStatusView() {
    const { status, onDownload, onFail, on404, progress } = this.props;
    let _progress = !progress ? Math.ceil(Math.random() * 99) : progress; // 模拟随机数
    let mySView = null;
    switch (status) {
      case "process":
        mySView = <label>{_progress}%</label>;
        break;
      case "uploading":
        mySView = <label>{_progress}%</label>;
        break;
      case "downloading":
        mySView = <label>{_progress}%</label>;
        break;
      case "download":
        mySView = <i className="weui-icon-download" onClick={onDownload}/>;
        break;
      case "fail":
        mySView = <label onClick={onFail}>重试</label>;
        break;
      case "404":
        mySView = <i className="weui-icon-info" onClick={on404}/>;
        break;
      case "original":
        break;
      case "success":
        break;
      default:
        break;
    }
    return mySView;
  }

  render() {
    const statusView = this.getStatusView(), { className, style, onClick, src = "" } = this.props;
    return (<li className={`m7-pre-image ${statusView ? "m7-pre-image__status" : ""} ${className}`} style={{ ...style, backgroundImage: `url(${src})` }} onClick={onClick}>
      <div className={`m7-pre-image__ft`}>{statusView}</div>
    </li>);
  }
}

PreImage.defaultProps = {
  className: "",
  style: {},
  status: "original"
};
PreImage.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  onClick: PropTypes.func,

  src: PropTypes.string, // 显示对象
  status: PropTypes.oneOf(["original", "process", "uploading", "downloading", "download", "success", "fail", "404"]), // 当前预览对象状态
  progress: PropTypes.number, // 进度
  data: PropTypes.object,

  onFail: PropTypes.func, // 状态fail失败时点击
  on404: PropTypes.func, // 状态404找不到时点击
  onDownload: PropTypes.func // 状态404找不到时点击
};