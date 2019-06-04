/**
 * Created by XLBerry on 2019/5/16
 */
import React from "react";
import create from "../../hoc/WrapComponent";
import TransformTouch from "./TransformTouch";
import { setTransform, setTransformMap } from "../../css/CSSPrefix";

@create({ type: "element-view" })
export default class DatetimeView extends React.Component {
  constructor(props) {
    super(props);
    const { format, sTime = new Date(1900, 0, 1, 0, 0, 0), data } = props,
      maxDay = new Date(data.getFullYear(), data.getMonth() + 1, 0);
    this.state = {};
    if (format.indexOf("yyyy") !== -1) {
      this.state.year = {};
      this.initNums(this.state, "year", sTime.getFullYear(), maxDay.getFullYear() + 10, data.getFullYear());
    }
    if (format.indexOf("MM") !== -1) {
      this.state.month = {};
      this.initNums(this.state, "month", 0, 12, data.getMonth());
    }
    if (format.indexOf("dd") !== -1) {
      this.state.day = {};
      this.state.day.tag = `${this.state.year.value}/${this.state.month.value}`;
      this.initNums(this.state, "day", 1, maxDay.getDate(), data.getDate());
    }
    if (format.indexOf("hh") !== -1) {
      this.state.hour = {};
      this.initNums(this.state, "hour", 0, 23, data.getHours());
    }
    if (format.indexOf("mm") !== -1) {
      this.state.minute = {};
      this.initNums(this.state, "minute", 0, 59, data.getMinutes());
    }
    if (format.indexOf("ss") !== -1) {
      this.state.second = {};
      this.initNums(this.state, "second", 0, 59, data.getSeconds());
    }
  }

  /** 设置列显示内容 */
  initNums = (state, type, start, end, value) => {
    state[type].start = start;
    state[type].value = value;
    state[type].count = end;
    state[type].translateY = (value - start) * this.itemHeight;
    state[type].nums = [];
    for (let i = type === "month" ? start + 1 : start; i <= end; i++) {
      state[type].nums.push(<div key={i} className="m7-datetime__item">{i}</div>);
    }
  };

  itemHeight = 0; // 元素高度px

  componentDidMount() {
    let state = this.state;
    Object.keys(state).forEach((type) => {
      this.itemHeight = this.itemHeight || this.getRef(type).children[0].clientHeight;
      state[type].translateY = (state[type].value - state[type].start) * this.itemHeight;
      this[`${type}Touch`] = new TransformTouch({
        target: this.getRef(type),
        callback: this.touchCallback.bind(this, type)
      });
    });
    this.setState(state);
  }

  componentWillUnmount() {
    Object.keys(this.state).forEach((type) => this[`${type}Touch`].unBind());
  }

  touchCallback = (type, { clickNode, translateY: x }) => {
    let state = this.state;
    if (clickNode) {
      // 点击事件，先执行滚动定位
      x += (state[type].value - (~~clickNode.innerText) + (type === "month" ? 1 : 0)) * this.itemHeight;
      this[`${type}Touch`].setTranslate({ translateY: ~~x });
    }
    let value = Math.round(Math.abs(x) / this.itemHeight) + 1;
    this[`${type}Touch`].setTranslate({ translateY: -(value - 1) * this.itemHeight }); // 嵌入
    state[type].value = state[type].start + value - 1;
    if (this.state.day && (type === "year" || type === "month")) {
      let dayTag = state.day.tag; // 触发日期天数变动
      state.day.tag = `${state.year.value}/${state.month.value}`;
      if (dayTag !== this.state.day.tag) {
        // 触发天数列渲染
        let d = new Date(state.year.value, state.month.value + 1, 0); // 通过日历自动计算什么闰年什么月份下的天数
        let dayNumSize = d.getDate();
        if (state.day.count !== dayNumSize) {
          this.initNums(state, "day", 1, dayNumSize, state.day.value > dayNumSize ? dayNumSize : state.day.value);
          this.setState(state, () => {
            setTransform(this.getRef("day"), "0px", `-${this.state.day.translateY}px`);
          });
        }
      }
    }
    let result = {};
    Object.keys(this.state).forEach((type) => result[type] = this.state[type].value);
    typeof this.props.onChange === "function" && this.props.onChange(result);
  };

  render() {
    return Object.keys(this.state).map((type) => {
      return <div key={type} className="m7-datetime__group">
        <div className="m7-datetime__mask"/>
        <div className="m7-datetime__indicator"/>
        <div ref={this.setRef(type)} className="m7-datetime__content"
             style={setTransformMap("0px", `-${this.state[type].translateY}px`)}>
          {this.state[type].nums}
        </div>
      </div>;
    });
  }
}
