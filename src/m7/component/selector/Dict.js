/**
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
    data: []
  };
  tmpData = []; // 临时数据

  static getDerivedStateFromProps(props, state) {
    if (!state.userAction) {
      const { viewProxy, id, splitKey } = props;
      const vData = viewProxy.get(id);
      if (Array.isArray(vData)) {
        return { ...state, data: vData, value: vData.map(v => v.detail).join(splitKey) };
      } else {
        return { ...state, data: [], value: "" }; // 置空
      }
    } else {
      return { ...state, userAction: false };
    }
  }

  componentDidUpdate(prevProps, prevState/*, snapshot*/) {
    if (prevState.value !== this.state.value) {
      const { id, onChange } = this.props;
      typeof onChange === "function" && onChange({ id, type: "dict", data: this.state.data });
    }
  }

  onClick = () => {
    const { mode, searchable, viewProxy, id, splitKey, dataFor } = this.props;
    const setStateData = (data, reset = false) => {
      this.setState({
        data,
        value: reset ? "" : data.map(v => v.detail).join(splitKey),
        userAction: true
      }, () => {
        id && viewProxy.set(id, this.state.data);
      });
    };
    ProcessUtils.showPicker({
      content: <DictView data={this.state.data} mode={mode} searchable={searchable} onChange={this.handleOnChange} dataFor={dataFor}/>,
      contentCls: "m7-dict__bd",
      cancelText: "清空",
      cancel: () => setStateData([], true),
      confirm: () => setStateData(this.tmpData, false),
    });
  };

  handleOnChange = (checkedData) => {
    console.log(checkedData);
    this.tmpData = [].concat(checkedData);
  };

  render() {
    const { id, title, placeholder, rules } = this.props;
    return <Input id={id} title={title} placeholder={placeholder} value={this.state.value} rules={rules}
                  onClick={this.onClick} readOnly subclass ft={<i className="m7-datetime__ft"/>}/>;
  }
}

Dict.defaultProps = {
  ...Dict.defaultProps,
  mode: "single",
  cascade: false,
  splitKey: "，",
  searchable: false,
  dataFor: {},
};

Dict.propTypes = {
  ...Dict.propTypes,
  title: PropTypes.node,
  mode: PropTypes.oneOf(["single", "multiple"]).isRequired,
  cascade: PropTypes.bool, // 级联模式
  splitKey: PropTypes.string, // 字典detail切割符
  searchable: PropTypes.bool, // 搜索条
  onChange: PropTypes.func,
  dataFor: PropTypes.object, // 数据来源对象
};