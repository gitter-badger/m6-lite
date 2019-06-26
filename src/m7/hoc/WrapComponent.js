/**
 * Created by XLBerry on 2019/6/3
 */

import React from "react";
import PropTypes from "prop-types";
import ProcessUtils from "../component/process";
import ValidType from "../utils/ValidType";

export const { Provider, Consumer } = React.createContext({});

const GlobalState = {}; // 全局view层数据

/** 页面发起全表单校验 */
function validateFromView() {
  return new Promise((resolve) => {
    ProcessUtils.showLoading({ title: "校验中" });
    let keys = Object.keys(this.validate), total = keys.length, current = 0, result = [];

    function callback(str) {
      current += 1;
      str && result.push(str);
      if (total === current) {
        ProcessUtils.hideLoading();
        resolve(result); // 校验结束
      }
    }

    keys.forEach((key) => this.validate[key](callback));
  });
}

/** 表单元素校验 */
async function validateFromElement(callback) {
  const { rules, viewProxy } = this.props;
  let result = null;
  if (typeof rules == "object") {
    let rs = rules;
    if (!Array.isArray(rs)) {
      rs = [rs];
    }
    for (let i = 0, l = rs.length; i < l; i++) {
      const { type: dType, message } = rs[i];
      let type, flag = true;
      if (typeof dType == "string") {
        type = ValidType[dType]; // 预设的校验规则
      } else {
        type = dType;
      }
      if (typeof type == "function") {
        flag = type(this.state.data, viewProxy.get());
        if (flag instanceof Promise) {
          flag = await type(this.state.data, viewProxy.get());
        }
      }
      if (typeof flag == "boolean") {
        if (!flag) {
          result = message;
          break;
        }
      } else if (typeof flag == "string") {
        result = flag;
        break;
      }
    }
  }
  typeof this.onValidate == "function" && this.onValidate(result);
  callback(result);
  return result;
}

export default function wrapper(opts = {}) {
  // type: view element element-view
  const { type: Type = "view", cache: Cache = true, namespace: Namespace, className: ClassName = "m7-page" } = opts; // 静态参数

  /** 从全局view层获取页面数据 */
  function getExtraState() {
    if (Type === "view") {
      return GlobalState[Cache && Namespace];
    } else return {};
  }

  return function wrapWithConnect(WrapComponent) {

    class Hoc extends WrapComponent {
      state = { ...this["state"], ...getExtraState() };

      componentDidMount = () => {
        typeof super.componentDidMount == "function" && super.componentDidMount();
        if (Type === "view") {
          // document.documentElement.scrollTop = this.state.lastScrollTop;
          document.getElementsByClassName("m7-page")[0].scrollTop = this.state.lastScrollTop;
        }
      };

      componentWillUnmount = () => {
        this.setState = function () {}; // 关闭组件销毁后设置state方法
        if (Type === "view") {
          const action = this.props.history.action;
          if (Cache && Namespace) {
            //this.state.lastScrollTop = ~~document.documentElement.scrollTop;
            this.state.lastScrollTop = ~~(document.getElementsByClassName("m7-page")[0].scrollTop);
            if (action === "POP") {
              this.state = {}; // 移除历史栈state
            }
            GlobalState[Namespace] = this.state; // 当前state备份至调度
          }
        }
        typeof super.componentWillUnmount == "function" && super.componentWillUnmount();
      };

      setRef = (name) => {
        if (typeof this.m7Refs != "object") {
          this.m7Refs = {};
        }
        if (typeof name == "string" && !this.m7Refs[name]) {
          this.m7Refs[name] = React.createRef();
        }
        return this.m7Refs[name];
      };

      getRef = (name) => {
        return (this.m7Refs && this.m7Refs[name] && this.m7Refs[name].current) || {};
      };

      setState = (state = {}, callback) => {
        return new Promise((resolve) => {
          super.setState(Object.assign(this.state, state), () => {
            typeof callback == "function" && callback(this.state);
            resolve(this.state);
          });
        });
      };

      getState = () => this.state;

      validate = Type === "view" ? validateFromView.bind(this) : validateFromElement.bind(this);

      setTimeout = (ms) => new Promise(resolve => setTimeout(resolve, ms));

      /** 获取dataset */
      getDatasetProps = (props = this.props) => {
        const datasetProps = {};
        Object.keys(props).forEach((k) => {
          if (k.indexOf("data-") === 0) {
            datasetProps[k] = props[k];
          }
        });
        return datasetProps;
      };

      render = () => {
        if (Type === "view") {
          const value = {
            viewProxy: { get: this.getState, set: this.setState, validate: this.validate }
          };
          return <Provider value={value}>
            <div className={ClassName}>{super.render()}</div>
          </Provider>;
        } else {
          return super.render();
        }
      };

    }

    Hoc.defaultProps = {
      ...Hoc.defaultProps,
      subclass: false,
      className: ""
    };

    Hoc.propTypes = {
      ...Hoc.propTypes,
      subclass: PropTypes.bool,
      id: PropTypes.string, // 数据标识
    };

    const hocForwardRef = React.forwardRef((props, ref) => {
      if (Type === "element") {
        return <Consumer>{
          ({ viewProxy }) => <Hoc {...props} ref={ref} viewProxy={viewProxy}/>
        }</Consumer>;
      } else {
        return <Hoc {...props} ref={ref}/>;
      }
    });

    hocForwardRef.displayName = `withHoc(${WrapComponent.displayName || WrapComponent.name})`;

    return hocForwardRef;
  };
}