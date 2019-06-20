/**
 * Created by XLBerry on 2019/5/5
 */

require("./Image"); // 扩展Image对象，添加压缩静态方法

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
    },
    {
      key: "urlValid",
      /**
       * 判断链接有效性
       * @param timeout 超时时间
       * @param fileType 文件类型，例如：image/jpeg, image/png
       * @param resType 返回类型，例如：string, blob
       * @return {Promise<boolean>}
       */
      value: function urlValid({ timeout = 2000, fileType, resType = "blob" }) {
        return new Promise((resolve) => {
          if (!this) {
            resolve(false);
          }
          let xmlHttp = new XMLHttpRequest();
          xmlHttp.timeout = timeout; // 超时时间判定

          function stateChange() {
            if (xmlHttp.readyState === 4) {
              if (xmlHttp.status === 200) {
                xmlHttp = null;
                resolve(fileType ? new Blob([xmlHttp.response], { type: fileType }) : true);
              } else {
                xmlHttp = null;
                resolve(false);
              }
            }
          }

          xmlHttp.onreadystatechange = stateChange;
          xmlHttp.open("Get", this, true);
          xmlHttp.responseType = resType;
          xmlHttp.send(null);
        });
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

})();