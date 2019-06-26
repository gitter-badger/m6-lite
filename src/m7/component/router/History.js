/**
 * Created by XLBerry on 2019/5/6
 */

const createHistory = require("history").createHashHistory;

const history = createHistory();
window.M7History = history; // 提升对象

/** 监听路由后退 */
window.addEventListener("popstate", function () {
  const tags = history.frozen.tags;
  if (tags[tags.length - 1] && history.willAddRecord <= 0) {
    window.history.pushState({ tag: tags[tags.length - 1] }, null);
  }
});

/** 路由变化监听（不监听路由state变化）, 控制history.record位置下标 */
history.listen(function (location, action) {
  // location { hash, pathname, search }
  if (history.willAddRecord !== 0) {
    history.record += history.willAddRecord;
  } else {
    // 非受控模式触发路由变更（比如手工点击浏览器前进后退）
    if (action === "PUSH") {
      history.record += 1;
    } else if (action === "POP") {
      history.record -= 1;
    }
  }
  history.willAddRecord = 0; // 重置
});

/** 冻结当前路由状态，禁止返回上页和替换当页 */
history.frozen = function frozen(tag = "") {
  const tags = history.frozen.tags;
  if (tag) {
    if (tags[tags.length - 1] !== tag) {
      tags.push(tag); // 干预标记
      window.history.pushState({ tag }, null);
    }
  } else {
    tags.pop();
    window.history.go(-1);
  }
};
history.frozen.tags = []; // 冻结状态记录

history.willAddRecord = 0; // 栈位变化量记录
history.record = 0; // 记录当前路由栈位下标，前进+1，后退-1

/**
 * 路由跳转
 * @param url 路由地址
 * @param state 状态
 * @param reLaunch 关闭所有页面，打开到应用内的某个页面
 * @param redirect 关闭当前页面，跳转到应用内的某个页面
 * @param delta 关闭当前页面，返回上一页面或多级页面，如果 delta 大于现有页面数，则返回到首页
 * @param outer 是否跳转到外部地址
 */
history.navigate = function ({ url, state, reLaunch = false, redirect = false, delta = 0, outer = false }) {
  if (reLaunch) {
    // 关闭所有页面
    if (!url) url = "/";
    history.willAddRecord = -history.record;
    history.go(-history.record);
    setTimeout(() => {
      history.setState(history.record, state);
      history.replace(url);
    }, 0);
  } else if (url) {
    if (redirect) {
      // 重定向替换 replace
      history.setState(history.record, state);
      history.replace(url);
    } else {
      // 前进
      history.willAddRecord = 1;
      history.setState(history.record + 1, state);
      history.push(url);
    }
  } else if (delta > 0) {
    // 后退
    history.willAddRecord = -1 * delta;
    history.go(-1 * delta);
  } else if (outer) {
    // 外部跳转
    let params = Object.keys(state).map(key => `${key}=${state[key]}`);
    window.location.href = `${url}${params.length > 0 ? `?${params.join("&")}` : ""}`;
  }
};

/** 设置当前路由位置状态 */
history.setState = function (record, state) {
  history.setState.state = history.setState.state || {};
  history.setState.state[record] = state;
};

/** 获取当前路由位置状态 */
history.getState = function () {
  return history.setState.state && history.setState.state[history.record];
};

export default history;