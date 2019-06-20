/**
 * Created by XLBerry on 2019/5/6
 */

const createHistory = require("history").createHashHistory;

const history = createHistory();

let historyInterveneTag = ""; // 干预标记

window.addEventListener("popstate", function() {
  if (historyInterveneTag) {
    window.history.pushState({ intervene: historyInterveneTag }, null);
  }
});

/** 提供弹窗组类干预history栈 */
history.interveneState = function interveneState(tag = "") {
  if (tag) {
    if (!window.history.state || window.history.state.intervene !== tag)
      window.history.pushState({ intervene: tag }, null);
    historyInterveneTag = tag;
  } else {
    historyInterveneTag = "";
    window.history.go(-1);
  }
};

window.M7History = history;

export { history };