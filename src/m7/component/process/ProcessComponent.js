/**
 * Created by XLBerry on 2019/5/15
 */

import React from "react";
import PropTypes from "prop-types";
import Broadcast from "../../utils/Broadcast";

export default class ProcessComponent extends React.PureComponent {
  componentDidMount() {
    Broadcast.subscribe({
      channel: "M7_PROCESS",
      key: this.props.type,
      listener: this.onReceive
    });
  }

  componentWillUnmount() {
    Broadcast.unSubscribe({
      channel: "M7_PROCESS",
      key: this.props.type
    });
  }
}

ProcessComponent.propTypes = {
  ...ProcessComponent.propTypes,
  type: PropTypes.string
};