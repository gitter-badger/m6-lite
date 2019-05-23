/**
 * Created by XLBerry on 2019/5/21
 */
import React from "react";
import PropTypes from "prop-types";
import Element from "../../hoc/Element";
import Input from "../input/Input";
import ProcessUtils from "../process/index";
import DictView from "./DictView";

@Element()
export default class Dict extends React.PureComponent {

  state = {};

  onClick = () => {
    ProcessUtils.showPicker({
      content: <DictView/>,
      contentCls: "m7-dict__bd",
    });
  };

  render() {
    const { id, title, placeholder, rules } = this.props;
    return <Input id={id} title={title} placeholder={placeholder} value={this.state.data} rules={rules}
                  onClick={this.onClick} readOnly subclass ft={<i className="m7-datetime__ft"/>}/>;
  }
}

Dict.defaultProps = {
  ...Dict.defaultProps,
  searchable: false,
};

Dict.propTypes = {
  ...Dict.propTypes,
  title: PropTypes.node,
  searchable: PropTypes.bool, // 搜索条
};