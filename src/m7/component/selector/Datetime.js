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

  tmpData = new Date();

  static getDerivedStateFromProps(props, state) {
    if (!state.userAction) {
      const { viewProxy, id, format } = props;
      const vData = viewProxy.get(id);
      if (vData instanceof Date) {
        return { ...state, value: vData, data: vData["format"](format) };
      } else {
        return state;
      }
    } else {
      return { ...state, userAction: false };
    }
  }

  onClick = () => {
    ProcessUtils.showPicker({
      content: <DatetimeView format={this.props.format} onChange={this.pickOnChange} value={this.state.value}/>,
      cancelText: "清空",
      cancel: () => {
      },
      confirmText: "确定",
      confirm: () => {
        const { viewProxy, id } = this.props;
        id && viewProxy.set(id, this.tmpData);
        this.setState({ value: this.tmpData, data: this.tmpData["format"](this.props.format), userAction: true });
      },
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
  format: PropTypes.string
};