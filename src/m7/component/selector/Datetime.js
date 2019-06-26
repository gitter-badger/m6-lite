/**
 * Created by XLBerry on 2019/5/16
 */
import React from "react";
import PropTypes from "prop-types";
import create from "../../hoc/WrapComponent";
import Input from "../input/Input";
import ProcessUtils from "../process/index";
import DatetimeView from "./DatetimeView";

@create({ type: "element" })
export default class Datetime extends React.PureComponent {
  state = {
    userAction: false, // 交互变更，事件消耗
    data: null
  };

  tmpData = null; // 列变动过程变量

  static getDerivedStateFromProps(props, state) {
    if (!state.userAction) {
      const { viewProxy, id, format } = props;
      const vData = viewProxy.get()[id];
      if (vData instanceof Date) {
        return { ...state, data: vData, value: vData["format"](format) };
      } else {
        // 置空
        return { ...state, data: null, value: "" };
      }
    } else {
      return { ...state, userAction: false };
    }
  }

  componentDidUpdate(prevProps, prevState/*, snapshot*/) {
    if (prevState.data !== this.state.data) {
      const { id, onChange } = this.props;
      typeof onChange == "function" && onChange({ id, type: "datetime", data: this.state.data });
    }
  }

  onClick = () => {
    const setStateData = async (data, reset = false) => {
      const { viewProxy, id, format } = this.props;
      this.tmpData = data;
      await this.setState({
        data,
        value: reset ? "" : data["format"](format),
        userAction: true
      });
      if (id) {
        viewProxy.get()[id] = data;
      }
    };

    let data; // 巧妙的空值获取当前最新时间
    if (this.state.data === null) {
      data = this.tmpData = new Date();
    } else {
      data = this.state.data;
    }
    ProcessUtils.showPicker({
      content: <DatetimeView format={this.props.format} onChange={this.handleOnChange} data={data}/>,
      contentCls: "m7-datetime__bd",
      cancelText: "清空",
      fail: () => setStateData(null, true),
      confirmText: "确定",
      success: () => setStateData(this.tmpData, false),
    });
  };

  handleOnChange = ({ year = 0, month = 0, day = 0, hour = 0, minute = 0, second = 0 }) => {
    this.tmpData = new Date(year, month, day, hour, minute, second);
  };

  render() {
    const { id, title, placeholder, rules } = this.props;
    return <Input id={id} title={title} placeholder={placeholder} value={this.state.value} rules={rules}
                  onClick={this.onClick} readOnly subclass ft={<i className="m7-datetime__ft"/>}/>;
  }
}

Datetime.defaultProps = {
  ...Datetime.defaultProps,
  format: "yyyy/MM/dd hh:mm:ss"
};

Datetime.propTypes = {
  ...Datetime.propTypes,
  title: PropTypes.node,
  format: PropTypes.string,
  onChange: PropTypes.func
};