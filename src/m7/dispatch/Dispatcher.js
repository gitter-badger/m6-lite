/**
 * 调度中心
 * Created by XLBerry on 2019/5/6
 */
/*
import DataSet from "./DataSet";
import PubSub from "./PubSub";

const DSK = Symbol("DataSet"), PSK = Symbol("PubSub");

export default function Dispatcher(data) {
  this[DSK] = new DataSet(data);
  this[PSK] = new PubSub();
}

Dispatcher.prototype = {
  subscribe: function subscribe(action, handler) {
    this[PSK].subscribe(action, handler);
  },
  remove: function remove(action, handler) {
    this[PSK].remove(action, handler);
  },
  dispatch: function dispatch(action, data) {
    this[PSK].publish(action, data, this.set(action, data).get(action));
  },
  get: function get(action) {
    return this[DSK].get(action);
  },
  set: function set(action, data) {
    return this[DSK].set(action, data);
  }
};

export const instance = new Dispatcher();*/
