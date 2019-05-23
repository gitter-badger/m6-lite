/**
 * Created by XLBerry on 2019/5/5
 */
import React from "react";
import enhance, { setRef, getRef, mTimeout } from "./Enhance";
import ProcessUtils from "../component/process/index";

export const { Provider, Consumer } = React.createContext({});

const GlobalState = {}; // 全局view层数据

export default function View(opts = {}) {
  const { cache = true, namespace } = opts;

  return function wrapWithConnect(WrapperComponent) {

    class HocView extends WrapperComponent {

      state = { ...this["state"], ...GlobalState[cache && namespace] }; // 从调度获取当前namespace数据

      componentDidMount = () => {
        typeof super.componentDidMount === "function" && super.componentDidMount();
        document.documentElement.scrollTop = this.state.lastScrollTop;
      };

      componentWillUnmount = () => {
        this.setState = function () {}; // 关闭组件销毁后设置state方法
        const action = this.props.history.action;
        if (cache && namespace) {
          this.state.lastScrollTop = ~~document.documentElement.scrollTop;
          if (action === "POP") {
            this.state = {}; // 移除历史栈state
          }
          GlobalState[namespace] = this.state; // 当前state备份至调度
        }
        typeof super.componentWillUnmount === "function" && super.componentWillUnmount();
      };

      setState = (state = {}) => {
        return new Promise((resolve) => {
          super.setState(Object.assign(this.state, state), () => resolve(this.state));
        });
      };

      setStateSilence = (key, value) => {
        this.state["setV"](key, value);
      };

      getStateSilence = (key, total = false) => {
        if (key) return this.state["getV"](key);
        else {
          if (total)
            return this.state;
          else return null;
        }
      };

      validate = () => {
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
      };

      render = () => {
        const value = {
          viewProxy: { get: this.getStateSilence, set: this.setStateSilence, validate: this.validate }
        };
        return <Provider value={value}>
          {super.render()}
        </Provider>;
      };
    }

    enhance(HocView.prototype, setRef, getRef, mTimeout); // 组件增强

    return HocView;
  };
}

/** 调用父级函数 */
/*export function superApply(that, Wrapper, key, args) {
  let wrapperPrototype = Reflect.getPrototypeOf(Wrapper.prototype);
  if (Reflect.has(wrapperPrototype, key)) {
    return Reflect.get(wrapperPrototype, key, that).apply(that, args);
  } else {
    return null;
  }
}*/