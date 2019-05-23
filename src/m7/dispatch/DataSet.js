/**
 * Created by XLBerry on 2019/5/5
 */

/*
const DSK = Symbol("DataSetKey");

export default function DataSet(data = {}) {
  if (typeof data !== "object") {
    throw new Error("初始化DataSet参数非object类型");
  }
  this[DSK] = JSON.parse(JSON.stringify(data));
}

function checkKey(key) {
  if (typeof key !== "string") {
    throw new Error("设置DataSet的key非string类型");
  }
}

DataSet.prototype = {
  get: function get(key) {
    if (!key) {
      return this[DSK];
    }
    checkKey(key);
    let keys = key.split("."), length = keys.length - 1, pData = this[DSK];
    for (let i = 0; i < length; i++) {
      if (keys[i] !== "") {
        pData = pData[keys[i]];
      }
      if (typeof pData !== "object") {
        break;
      }
    }
    return typeof pData !== "object" ? null : pData[keys[length]];
  },
  set: function set(key, value) {
    if (typeof key === "object") {
      this[DSK] = key;
      return this;
    }
    checkKey(key);
    let keys = key.split("."), length = keys.length - 1, pData = this[DSK];
    for (let i = 0; i < length; i++) {
      if (keys[i] !== "") {
        if (typeof pData[keys[i]] === "object" && !Array.isArray(pData[keys[i]])) {
          // 保留
        } else {
          pData[keys[i]] = {};
        }
        pData = pData[keys[i]];
      }
    }
    pData[keys[length]] = value;
    return this;
  }
};*/
