/**
 * Created by XLBerry on 2019/5/6
 */

import React from "react";
import PropTypes from "prop-types";
import { Router as BasalRouter, Route, Switch } from "react-router-dom";
// import { Transition, TransitionGroup, CSSTransition } from "react-transition-group";
import Notice from "../process/Notice";
import Picker from "../process/Picker";
import Modal from "../process/Modal";
import Loading from "../process/Loading";
import history from "./History";

export default class Re extends React.PureComponent {

  getChildren(children) {
    return React.Children.map(children, (child, i) => {
      if (typeof child == "object" && child["$$typeof"].toString() == "Symbol(react.element)") {
        if (child.props.path) {
          return React["cloneElement"](child, {
            key: i,
          });
        } else if (child.props.children) {
          return this.getChildren(child.props.children);
        } else {
          return null;
        }
      } else {
        return null;
      }
    });
  }

  renderContainer() {
    const { children } = this.props;
    return <BasalRouter history={history}>
      <div>
        <Switch>{this.getChildren(children)}</Switch>
        <div>
          <Notice/>
          <Picker/>
          <Modal/>
          <Loading/>
        </div>
      </div>
    </BasalRouter>;
  }

  renderRoute(Component, otherProps) {
    document.title = otherProps.title || window.M7GET("env").title; // 设置网页标题
    return (props) => <Component {...props} {...otherProps}/>;
  }

  render() {
    const { children, path, component, title } = this.props;
    if (children) {
      return this.renderContainer();
    } else {
      return <Route path={path} exact render={this.renderRoute(component, { path, title })}/>;
    }
  }
}

Re.defaultProps = {
  exact: true,
  title: ""
};

Re.propTypes = {
  ...Re.propTypes,
  path: PropTypes.string,
  exact: PropTypes.bool,

  title: PropTypes.string // 当前地址标题
};