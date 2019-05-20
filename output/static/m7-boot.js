/**
 * M7启动引导文件
 * Created by XLBerry on 2018/10/30
 */

(function () {
  "use strict";

  window.M7SCOPE = {};
  /**
   * 设置M7全局域内容
   * @param key
   * @param value
   * @returns {boolean}
   * @constructor
   */
  window.M7SET = function (key, value) {
    if (!key) return false;
    let target = window.M7SCOPE, nds = key.split("."), length = nds.length;
    for (let i = 0, le = length - 1; i < le; i++) {
      if (!target[nds[i]]) {
        target[nds[i]] = {};
      }
      target = target[nds[i]];
    }
    target[nds[length - 1]] = value;
    return true;
  };

  /**
   * 获取M7全局域内容
   * @param key
   * @param dValue
   * @returns {*}
   * @constructor
   */
  window.M7GET = function (key, dValue) {
    try {
      let r = eval(`window.M7SCOPE.${key}`);
      return r === undefined ? dValue : r;
    } catch (e) {
      return dValue; // void 0;
    }
  };

  /** 空函数 */
  function emptyFn() {
  }

  /**
   * 动态载入js
   * @param obj --> url, type, success, fail
   */
  function addScript(obj) {
    const { url, type = "url", success = emptyFn, fail } = obj;
    let script = document.createElement("script");
    script.type = "text/javascript"; // script.async = 'async';
    if (type === "url") {
      script.src = url;
    } else {
      script.appendChild(document.createTextNode(url));
    }
    document.getElementsByTagName("head")[0].appendChild(script);
    script.addEventListener("error", fail);
    script.addEventListener("load", function () {
      if (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") {
        script.onload = script.onreadystatechange = script.onerror = null;
        success(true);
      }
    });
  }

  let __loadScript = {};

  /** 载入js对象 */
  window.M7SET("loadScript", function (obj = {}) {
    const { url, test, success = emptyFn, fail = emptyFn, delay = 1000 } = obj;

    if (eval(test) !== null) {
      success(true);
    } else {
      if (__loadScript[url]) {
        if (__loadScript[url] >= 30) {
          fail(false); // 尝试超过30次，放弃
        } else {
          setTimeout(function () {
            __loadScript[url] += 1;
            window.M7GET("loadScript")(obj);
          }, delay);
        }
      } else {
        __loadScript[url] = 1;
        addScript({
          ...obj,
          success: function () {
            success(true);
            delete __loadScript[url];
          },
          fail: function () {
            fail(false);
            delete __loadScript[url];
          }
        });
      }
    }
  });

  function contentLoaded() {
    document.removeEventListener("DOMContentLoaded", contentLoaded);
    window.M7SET("env", function () {
      return JSON.parse(document.getElementById("m7-boot-config").innerText || "{}");
    });
    let asyncJS = (window.M7GET("env")()).asyncJS, count = 0, totalCount = asyncJS.length;

    function cb(flag) {
      if (flag === true) {
        count += 1;
        iteration(count);
      } else {
        alert(`载入[${asyncJS[count]}]异常`);
      }
    }

    function iteration(i) {
      if (i === totalCount) {
        return; // 载入完成
      }
      addScript({
        url: asyncJS[i],
        type: "url",
        success: cb,
        fail: cb,
      });
    }

    iteration(count);
  }

  document.addEventListener("DOMContentLoaded", contentLoaded);

})();
