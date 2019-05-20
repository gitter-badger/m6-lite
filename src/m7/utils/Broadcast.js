/**
 * Created by XLBerry on 2019/5/15
 */

export default class Broadcast {
  /** 订阅事件 */
  static subscribe({ channel, key, listener }) {
    let subscriber = window.M7SCOPE.subscriber = window.M7SCOPE.subscriber || {};
    subscriber[channel] = subscriber[channel] || {};
    delete subscriber[channel][key];
    subscriber[channel][key] = listener;
  }

  /** 发布事件 */
  static publish({ channel, args, range = [] }) {
    let subscriber = window.M7SCOPE.subscriber = window.M7SCOPE.subscriber || {};
    subscriber[channel] = subscriber[channel] || {};
    if (typeof range === "string") {
      range = [range];
    }
    if (range.length > 0) {
      range.forEach((key) => subscriber[channel][key] && subscriber[channel][key](args));
    } else {
      Object.keys(subscriber[channel]).forEach((key) => subscriber[channel][key] && subscriber[channel][key](args));
    }
  }

  /** 取消订阅 */
  static unSubscribe({ channel, key }) {
    let subscriber = window.M7SCOPE.subscriber = window.M7SCOPE.subscriber || {};
    if (key) {
      subscriber[channel] && delete subscriber[channel][key];
    } else {
      delete subscriber[channel];
    }
  }
}