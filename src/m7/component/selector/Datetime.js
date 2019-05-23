/**
 * Created by XLBerry on 2019/5/16
 */
import React from "react";
import PropTypes from "prop-types";
import Element from "../../hoc/Element";
import Input from "../input/Input";
import ProcessUtils from "../process/index";
import DatetimeView from "./DatetimeView";

@Element()
export default class Datetime extends React.PureComponent {
  state = {
    userAction: false, // 交互变更，事件消耗
    value: new Date()
  };

  tmpData = new Date(); // 列变动过程变量

  static getDerivedStateFromProps(props, state) {
    if (!state.userAction) {
      const { viewProxy, id, format } = props;
      const vData = viewProxy.get(id);
      if (vData instanceof Date) {
        return { ...state, value: vData, data: vData["format"](format) };
      } else {
        // 置空
        return { ...state, value: new Date(), data: "" };
      }
    } else {
      return { ...state, userAction: false };
    }
  }

  componentDidUpdate(prevProps, prevState/*, snapshot*/) {
    if (prevState.data !== this.state.data) {
      const { id, onChange } = this.props;
      typeof onChange === "function" && onChange({ id, data: this.state.data });
    }
  }

  onClick = () => {
    const setValue = (value, reset = false) => {
      const { viewProxy, id, format } = this.props;
      id && viewProxy.set(id, value);
      this.setState({ value, data: reset ? "" : value["format"](format), userAction: true });
    };

    ProcessUtils.showPicker({
      content: <DatetimeView format={this.props.format} onChange={this.pickOnChange} value={this.state.value}/>,
      contentCls: "m7-datetime__bd",
      cancelText: "清空",
      cancel: () => setValue(new Date(), true),
      confirmText: "确定",
      confirm: () => setValue(this.tmpData, false),
    });
  };

  pickOnChange = ({ year = 0, month = 0, day = 0, hour = 0, minute = 0, second = 0 }) => {
    this.tmpData = new Date(year, month, day, hour, minute, second);
  };

  render() {
    const { id, title, placeholder, rules } = this.props;
    return <Input id={id} title={title} placeholder={placeholder} value={this.state.data} rules={rules}
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