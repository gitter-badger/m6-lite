/**
 * Created by XLBerry on 2019/5/6
 */

const createHistory = require("history").createHashHistory;

const history = createHistory();

window.M7History = history;

export { history };