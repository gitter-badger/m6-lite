/**
 * 增强react组件对象
 * Created by XLBerry on 2019/5/10
 */
import React from "react";

export const setRef = {
  enumerable: false,
  configurable: true,
  writable: true,
  key: "setRef",
  value: function setRef(name) {
    if (typeof this.m7Refs !== "object") {
      this.m7Refs = {};
    }
    if (typeof name == "string" && !this.m7Refs[name]) {
      this.m7Refs[name] = React.createRef();
    }
    return this.m7Refs[name];
  }
};

export const getRef = {
  enumerable: false,
  configurable: true,
  writable: true,
  key: "getRef",
  value: function getRef(name) {
    return (this.m7Refs && this.m7Refs[name] && this.m7Refs[name].current) || {};
  }
};

/** 表单校验方法 */
export const validate = {
  enumerable: false,
  configurable: true,
  writable: true,
  key: "validate",
  value: async function validate(callback) {
    const { rules, viewProxy } = this.props;
    let result = null;
    if (typeof rules === "object") {
      let rs = rules;
      if (!Array.isArray(rs)) {
        rs = [rs];
      }
      for (let i = 0, l = rs.length; i < l; i++) {
        const { type, message } = rs[i];
        let flag = true;
        if (typeof type === "string") {
          // 预设的校验规则
        } else if (typeof type === "function") {
          flag = type(this.state.data, viewProxy.get(null, true));
          if (flag instanceof Promise) {
            flag = await type(this.state.data, viewProxy.get(null, true));
          }
        } else if (type instanceof Promise) {
          flag = await type(this.state.data, viewProxy.get(null, true));
        }
        if (typeof flag === "boolean") {
          if (!flag) {
            result = message;
            break;
          }
        } else if (typeof flag === "string") {
          result = flag;
          break;
        }
      }
    }
    typeof this.onValidate === "function" && this.onValidate(result);
    callback(result);
    return result;
  }
};

export const  mTimeout = {
  enumerable: false,
  configurable: true,
  writable: true,
  key: "mTimeout",
  value: async function mTimeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
};

export default function enhance(prototype, ...funcs) {
  funcs.forEach((descriptor) => {
    Object.defineProperty(prototype, descriptor.key, descriptor);
  });
}