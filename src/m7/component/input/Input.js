/**
 * Created by XLBerry on 2019/5/6
 */

import React from "react";
import PropTypes from "prop-types";
import Element from "../../hoc/Element";

@Element()
export default class Input extends React.Component {

  state = {
    data: this.props.viewProxy.get(this.props.id),
    userAction: false // 交互变更，事件消耗
  };

  static getDerivedStateFromProps(props, state) {
    const { viewProxy, id, subclass, value = "" } = props;
    if (subclass) {
      return { ...state, data: value };
    } else {
      const vData = viewProxy.get(id), { data, userAction } = state;
      if (vData !== data) {
        if (userAction) {
          viewProxy.set(id, data); // 告知页面数据，交互变更当前数据
          return { data, userAction: false }; // 交互变更，比如手动输入
        } else {
          return { data: vData }; // 页面数据行为
        }
      } else {
        return null;
      }
    }
  }

  componentDidMount() {
    // 注册校验事件
    const { viewProxy, id } = this.props, { validate } = viewProxy;
    if (id) {
      validate[id] = this.validate.bind(this);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.subclass || nextState.data !== this.state.data;
  }

  componentDidUpdate(/*prevProps, prevState, snapshot*/) {
    const { id, onChange } = this.props, text = this.state.data;
    this["getRef"]("input").value = text;
    typeof onChange === "function" && onChange({ id, data: text });
  }

  /** 校验回调 */
  onValidate = (errText) => {
    let parent = this["getRef"]("input").parentNode.parentNode,
      fts = parent.getElementsByClassName("m7-cell__ft")[0].children, icon = fts[0];
    if (errText) {
      parent.classList.add("m7-cell_warn");
      icon.classList.add("weui-icon-warn");
      fts.length > 1 && (fts[1].style.display = "none");
    } else {
      parent["classList"].remove("m7-cell_warn");
      icon.classList.remove("weui-icon-warn");
      fts.length > 1 && (fts[1].style.display = "block");
    }
  };

  onClick = (e) => typeof this.props.onClick === "function" && this.props.onClick(e);

  onFocus = (e) => typeof this.props.onFocus === "function" && this.props.onFocus(e);

  onBlur = (e) => {
    const value = e.target.value;
    if ((this.state.data || "") !== value) {
      this.setState({ data: value, userAction: true });
    }
  };

  render() {
    const { className, title, placeholder, type, disabled, readOnly, onInput, ft, value } = this.props;
    return <div className="m7-cell">
      {title ? <div className="m7-cell__hd">
        <label className="m7-label">{title}</label>
      </div> : null}
      <div className="m7-cell__bd">
        <input ref={this["setRef"]("input")} className={`m7-input ${className}`} placeholder={placeholder} type={type}
               onClick={this.onClick} onFocus={this.onFocus} onInput={onInput} onBlur={this.onBlur}
               disabled={disabled} readOnly={readOnly} defaultValue={this.state.data || value}/>
      </div>
      <div className="m7-cell__ft">
        <i rel="icon"/>
        {ft}
      </div>
    </div>;
  }
}

Input.defaultProps = {
  ...Input.defaultProps,
  type: "text"
};

Input.propTypes = {
  ...Input.propTypes,
  title: PropTypes.node,
  type: PropTypes.string,

  onClick: PropTypes.func,
  onFocus: PropTypes.func,
  onInput: PropTypes.func,
  onBlur: PropTypes.func,
  onChange: PropTypes.func
};