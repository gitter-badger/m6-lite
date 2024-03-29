/**
 * Created by XLBerry on 2019/5/22
 */
import React from "react";
import PropTypes from "prop-types";

export default class Search extends React.Component {

  state = {
    data: "",
    focusing: false
  };

  componentDidUpdate(prevProps, prevState/*, snapshot*/) {
    if (prevState.data !== this.state.data) {
      const { id, onChange } = this.props;
      typeof onChange == "function" && onChange({ id, type: "search", data: this.state.data });
    }
  }

  componentWillUnmount() {
    this.setState = function () {};
  }

  /** 点击取消 */
  handleInputCancel = (e) => {
    if (this.props.disabled) return;
    let inputDOM = e.target.parentNode.children[0].getElementsByTagName("input")[0];
    inputDOM.value = "";
    inputDOM.focus();
    inputDOM.blur();
  };

  /** 输入框焦点离开 */
  handleInputBlur = (e) => {
    if (this.props.disabled) return;
    let inputDOM = e.target;
    setTimeout(() => {
      let value = inputDOM.value, focusing = !!value || !!inputDOM.tag;
      this.setState({ focusing, data: value });
      inputDOM.tag = "";
    }, 0);
  };

  /** 输入框内容文字清除 */
  handleInputClear = (e) => {
    if (this.props.disabled) return;
    let inputDOM = e.target.parentNode.getElementsByTagName("input")[0];
    inputDOM.value = "";
    inputDOM.tag = "clear";
    inputDOM.focus();
  };

  /** 默认标签点击触发 */
  handleLabelClick = (e) => {
    if (this.props.disabled) return;
    e.target.parentNode.children[0].getElementsByTagName("input")[0].focus(); // 焦点聚焦输入框
    this.setState({ focusing: true });
  };

  /** 软键盘触发搜索 */
  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({}, () => {
      document.activeElement.blur();
    });
  };

  render() {
    const { focusing } = this.state;
    return <div className={`m7-search-bar ${focusing ? "m7-search-bar_focusing" : ""}`}>
      <form className="m7-search-bar__form" onSubmit={this.handleSubmit}>
        <div className="m7-search-bar__box">
          <i className="weui-icon-search"/>
          <input type="search" className="m7-search-bar__input" placeholder="搜索" required disabled={this.props.disabled} onBlur={this.handleInputBlur}/>
          <a href="javascript:" className="weui-icon-clear" onClick={this.handleInputClear}/>
        </div>
        <label className="m7-search-bar__label" onClick={this.handleLabelClick}>
          <i className="weui-icon-search"/>
          <span>搜索</span>
        </label>
      </form>
      <a href="javascript:" className="m7-search-bar__cancel-btn" onClick={this.handleInputCancel}>取消</a>
    </div>;
  }
}

Search.propTypes = {
  ...Search.propTypes,
  disabled: PropTypes.bool,
  onChange: PropTypes.func
};