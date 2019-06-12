/**
 * TODO 字典翻译
 * Created by XLBerry on 2019/5/21
 */
import React from "react";
import PropTypes from "prop-types";
import create from "../../hoc/WrapComponent";

import Input from "../input/Input";
import ProcessUtils from "../process/index";
import DictView from "./DictView";

@create({ type: "element" })
export default class Dict extends React.PureComponent {

  state = {
    data: [],
    dataLabel: []
  };
  tmpData = []; // 临时数据
  tmpDataLabel = []; // 临时数据标签

  static getDerivedStateFromProps(props, state) {
    if (!state.userAction) {
      const { viewProxy, id, displayRender, splitKey } = props;
      const vData = viewProxy.get()[id];
      if (Array.isArray(vData)) {
        const newState = { ...state, data: vData, dataLabel: viewProxy.get()[`${id}#label`] || [] };
        newState.value = vData.map((v, i) => displayRender({ value: v, label: newState.dataLabel[i] })).join(splitKey);
        return newState;
      } else {
        return { ...state, data: [], dataLabel: [], value: "" }; // 置空
      }
    } else {
      return { ...state, userAction: false };
    }
  }

  componentDidUpdate(/*prevProps, prevState, snapshot*/) {
    // console.log(prevState.data, this.state.data);
  }

  onClick = () => {
    const { multiple, cascade, displayRender, searchable, viewProxy, id, splitKey, dataFor, onChange } = this.props, prevData = this.state.data;
    const setStateData = async ({ checked, checkedLabel }, reset = false) => {
      await this.setState({
        data: checked,
        dataLabel: checkedLabel,
        value: reset ? "" : checked.map((v, i) => displayRender({ value: v, label: checkedLabel[i] })).join(splitKey),
        userAction: true
      });
      if (id) {
        viewProxy.get()[id] = this.state.data;
        if (cascade) {
          viewProxy.get()[`${id}#label`] = this.state.dataLabel;
        }
      }
      // 判断onChange事件
      if (prevData.map((d) => d.code).join("") !== this.state.data.map((d) => d.code).join("")) {
        typeof onChange === "function" && onChange({ id, type: "dict", data: this.state.data });
      }
    };
    ProcessUtils.showPicker({
      content: <DictView data={this.state.data} dataLabel={this.state.dataLabel}
                         multiple={multiple} cascade={cascade} searchable={searchable}
                         onChange={this.handleOnChange} dataFor={dataFor}/>,
      contentCls: "m7-dict__bd",
      cancelText: "清空",
      cancel: () => setStateData({ checked: [], checkedLabel: [] }, true),
      confirm: () => setStateData({ checked: this.tmpData, checkedLabel: this.tmpDataLabel }, false),
    });
  };

  handleOnChange = ({ checked, checkedLabel }) => {
    this.tmpData = checked;
    this.tmpDataLabel = checkedLabel;
  };

  render() {
    const { id, title, placeholder, rules } = this.props;
    return <Input id={id} title={title} placeholder={placeholder} value={this.state.value} rules={rules}
                  onClick={this.onClick} readOnly subclass ft={<i className="m7-datetime__ft"/>}/>;
  }
}

Dict.defaultProps = {
  ...Dict.defaultProps,
  multiple: false,
  cascade: false,
  displayRender: ({ value/*, label*/ }) => value.detail,
  splitKey: "，",
  searchable: false,
  dataFor: {},
};

Dict.propTypes = {
  ...Dict.propTypes,
  title: PropTypes.node,
  multiple: PropTypes.bool,
  cascade: PropTypes.bool, // 级联模式
  splitKey: PropTypes.string, // 字典detail切割符
  displayRender: PropTypes.func, // 显示文字函数处理
  searchable: PropTypes.bool, // 搜索条
  onChange: PropTypes.func,
  dataFor: PropTypes.object, // 数据来源对象
};