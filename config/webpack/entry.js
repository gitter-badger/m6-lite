/**
 * Created by XLBerry on 2019/3/13
 */
const toolKit = require("./Toolkit");


function get() {
  let entries = {};
  toolKit.searchApp().forEach(({ application }) => {
    if (application.compiled) {
      entries[application.id] = [application.src];
    }
  });
  return entries;
}

module.exports = {
  get
};