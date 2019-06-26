/**
 * Created by XLBerry on 2019/6/17
 */
import React from "react";
import PropTypes from "prop-types";
import history from "../router/History";
import ScaleElement from "./ScaleElement";

export default class Gallery extends React.PureComponent {
  state = {
    hidden: !!this.props.hidden,
  };

  constructor(props) {
    super(props);
    this.imageDOM = React.createRef();
  }

  componentDidMount() {
    this.scaleElement = new ScaleElement({ element: () => this.imageDOM.current });
  }

  componentDidUpdate(prevProps/*, prevState, snapshot*/) {
    const pHidden = this.props.hidden;
    if (pHidden !== prevProps.hidden && pHidden !== this.state.hidden) {
      this.handleDisplay(pHidden);
      this.setState({ hidden: pHidden });
    }
  }

  /** 显示/隐藏预览图片 */
  handleDisplay = (hidden) => {
    this.scaleElement.initVariable();
    this.scaleElement.toAnimation();
    history.frozen(hidden ? "" : "gallery");
    if (!hidden) {
      this.scaleElement.setImageElementSize(this.props.src);
    }
  };

  /** 触发隐藏 */
  handleHide = (e) => {
    e.stopPropagation();
    this.setState({ hidden: true });
    this.handleDisplay(true);
    typeof this.props.onHide == "function" && this.props.onHide();
    return false;
  };

  /** 触发删除 */
  handleDelete = () => {
    typeof this.props.onDelete == "function" && this.props.onDelete();
  };

  render() {
    return <div className="m7-gallery" onClick={this.handleHide} style={{ display: this.state.hidden ? "none" : "flex" }}>
      <div ref={this.imageDOM} className="m7-gallery__img" style={{ backgroundImage: this.state.hidden ? null : `url(${this.props.src})` }}/>
      {
        this.props.onDelete ? <div className="m7-gallery__opr">
          <a className="m7-gallery__opr__bd" href="javascript:">
            <i className="weui-icon-delete" onClick={this.handleDelete}/>
          </a>
        </div> : null
      }
    </div>;
  }
}

Gallery.propTypes = {
  src: PropTypes.string, // 图片
  hidden: PropTypes.bool, // 样式显示
  onHide: PropTypes.func, // 隐藏
  onDelete: PropTypes.func // 删除
};