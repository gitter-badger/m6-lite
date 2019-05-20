/**
 * Created by XLBerry on 2019/5/5
 */

export default (function () {
  "use strict";

  function defineProperties(target, props) {
    for (let i = 0; i < props.length; i++) {
      let descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  defineProperties(String.prototype, [
    {
      key: "replaceAll",
      value: function replaceAll(findText, repText) {
        return this.replace(new RegExp(findText, "g"), repText);
      }
    }
  ]);

  /** 时间格式化 */
  defineProperties(Date.prototype, [
    {
      key: "format",
      value: function format(fmt) {
        let o = {
          "M+": this.getMonth() + 1,                 //月份
          "d+": this.getDate(),                    //日
          "h+": this.getHours(),                   //小时
          "m+": this.getMinutes(),                 //分
          "s+": this.getSeconds(),                 //秒
          "q+": Math.floor((this.getMonth() + 3) / 3), //季度
          "S": this.getMilliseconds()             //毫秒
        };
        if (/(y+)/.test(fmt)) {
          fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        Object.keys(o).forEach(k => {
          if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
          }
        });
        return fmt;
      }
    }
  ]);

  defineProperties(Object.prototype, [
    {
      key: "getV",
      value: function getV(key, obj = this) {
        if (!key) {
          return obj;
        }
        if (typeof key !== "string") throw new Error("非法key类型");
        let keys = key.split("."), length = keys.length - 1;
        for (let i = 0; i < length; i++) {
          if (keys[i] !== "") {
            obj = obj[keys[i]];
          }
          if (typeof obj !== "object") {
            break;
          }
        }
        return typeof obj !== "object" ? null : obj[keys[length]];
      }
    },
    {
      key: "setV",
      value: function setV(key, value, obj = this) {
        if (typeof key === "object") {
          obj = key;
          return obj;
        }
        if (typeof key !== "string") throw new Error("非法key类型");
        let keys = key.split("."), length = keys.length - 1;
        for (let i = 0; i < length; i++) {
          if (keys[i] !== "") {
            if (typeof obj[keys[i]] === "object" && !Array.isArray(obj[keys[i]])) {
              // 保留
            } else {
              obj[keys[i]] = {};
            }
            obj = obj[keys[i]];
          }
        }
        obj[keys[length]] = value;
        return obj;
      }
    }
  ]);

})();