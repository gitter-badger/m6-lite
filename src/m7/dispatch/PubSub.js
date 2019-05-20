/**
 * 发布/订阅模式
 * Created by XLBerry on 2019/5/6
 */

const SK = Symbol("Subscriber");

export default function PubSub() {
  this[SK] = {}; // 订阅对象集
}

PubSub.prototype = {
  subscribe: function subscribe(action, handler) {
    if (!this[SK].hasOwnProperty(action)) {
      this[SK][action] = [];
    }
    this[SK][action].push(handler);
    return this;
  },
  remove: function remove(action, handler) {
    if (this[SK].hasOwnProperty(action)) {
      let hs = this[SK][action];
      for (let i = hs.length - 1; i >= 0; i --) {
        if (hs[i] === handler) {
          hs[i].splice(i, 1);
        }
      }
    }
    return this;
  },
  publish: function publish(action) {
    let args = Array.prototype.slice.call(arguments, 1);
    if (this[SK].hasOwnProperty(action)) {
      this[SK][action].forEach(h => h(...args));
    }
    return this;
  }
};