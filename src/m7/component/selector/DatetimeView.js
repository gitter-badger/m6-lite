/**
 * Created by XLBerry on 2019/5/16
 */
import React from "react";
import { setRef, getRef } from "../../hoc/Enhance";
import TouchEvent from "../../utils/TouchEvent";

const pickerItemHeight = 34; // 元素高度px

export default class DatetimeView extends React.Component {
  constructor(props) {
    super(props);
    const { format } = props;
    this.yearShow = format.indexOf("yyyy") !== -1;
    this.monthShow = format.indexOf("MM") !== -1;
    this.dayShow = format.indexOf("dd") !== -1;
    this.hourShow = format.indexOf("hh") !== -1;
    this.minuteShow = format.indexOf("mm") !== -1;
    this.secondShow = format.indexOf("ss") !== -1;

    this.state = {
      year: {},
      month: {},
      day: {},
      hour: {},
      minute: {},
      second: {}
    };
    this.init(this.state);
  }

  setRef = setRef.value.bind(this);

  getRef = getRef.value.bind(this);

  init(state) {
    const { sTime = new Date(1900, 0, 1, 0, 0, 0), value } = this.props;
    let maxDay = new Date(value.getFullYear(), value.getMonth() + 1, 0);
    if (this.yearShow) {
      this.initNums(state, "year", sTime.getFullYear(), maxDay.getFullYear() + 10, value.getFullYear());
    }
    if (this.monthShow) {
      this.initNums(state, "month", 0, 12, value.getMonth());
    }
    if (this.dayShow) {
      state.day.tag = `${state.year.value}/${state.month.value}`;
      this.initNums(state, "day", 1, maxDay.getDate(), value.getDate());
    }
    if (this.hourShow) {
      this.initNums(state, "hour", 0, 23, value.getHours());
    }
    if (this.minuteShow) {
      this.initNums(state, "minute", 0, 59, value.getMinutes());
    }
    if (this.secondShow) {
      this.initNums(state, "second", 0, 59, value.getSeconds());
    }
  }

  initNums = (state, type, start, end, value) => {
    state[type].start = start;
    state[type].value = value;
    state[type].count = end;
    state[type].translateY = (value - start) * pickerItemHeight;
    let nums = [];
    for (let i = type === "month" ? start + 1 : start; i <= end; i++) {
      nums.push(<div key={i} className="m7-datetime__item">{i}</div>);
    }
    state[type].nums = <div className="m7-datetime__content"
                            style={{ transform: `translate3d(0px, -${state[type].translateY}px, 0px)` }}>{nums}</div>;
  };

  componentDidMount() {
    this.setTouch("year");
    this.setTouch("month");
    this.setTouch("day");
    this.setTouch("hour");
    this.setTouch("minute");
    this.setTouch("second");
  }

  componentWillUnmount() {
    this.setTouch("year", true);
    this.setTouch("month", true);
    this.setTouch("day", true);
    this.setTouch("hour", true);
    this.setTouch("minute", true);
    this.setTouch("second", true);
  }

  setTouch = (type, unBind = false) => {
    if (!this[`${type}Show`]) return;
    if (unBind) {
      this[`${type}Touch`].unBind();
    } else {
      this[`${type}Touch`] = new TouchEvent({
        container: this.getRef(type), target: this.getRef(type).children[2],
        callback: this.touchCallback.bind(this, type)
      });
    }
  };

  touchCallback = (type, { translateY: x }) => {
    let value = Math.round(Math.abs(x) / pickerItemHeight) + 1, state = this.state;
    this[`${type}Touch`].setTranslate({ translateY: -(value - 1) * pickerItemHeight });
    if (type === "year") {
      state[type].value = state[type].start + value - 1;
    } else if (type === "month") {
      state[type].value = value - 1;
    } else {
      state[type].value = value;
    }
    if (this.dayShow && (type === "year" || type === "month")) {
      // 触发日期天数变动
      let dayTag = state.day.tag;
      state.day.tag = `${state.year.value}/${state.month.value}`;
      if (dayTag !== this.state.day.tag) {
        // 触发天数列渲染
        let d = new Date(state.year.value, state.month.value + 1, 0); // 通过日历自动计算什么闰年什么月份下的天数
        let dayNumSize = d.getDate();
        if (state.day.count !== dayNumSize) {
          this.initNums(state, "day", 1, dayNumSize, state.day.value > dayNumSize ? dayNumSize : state.day.value);
          this.setState(state);
        }
      }
    }

    typeof this.props.onChange === "function" && this.props.onChange({
      year: this.state.year.value,
      month: this.state.month.value,
      day: this.state.day.value,
      hour: this.state.hour.value,
      minute: this.state.minute.value,
      second: this.state.second.value,
    });
  };

  render() {
    return [
      this.yearShow ? <div key="year" className="m7-datetime__group" ref={this.setRef("year")}>
        <div className="m7-datetime__mask"/>
        <div className="m7-datetime__indicator"/>
        {this.state.year.nums}
      </div> : null,
      this.monthShow ? <div key="month" className="m7-datetime__group" ref={this.setRef("month")}>
        <div className="m7-datetime__mask"/>
        <div className="m7-datetime__indicator"/>
        {this.state.month.nums}
      </div> : null,
      this.dayShow ? <div key="day" className="m7-datetime__group" ref={this.setRef("day")}>
        <div className="m7-datetime__mask"/>
        <div className="m7-datetime__indicator"/>
        {this.state.day.nums}
      </div> : null,
      this.hourShow ? <div key="hour" className="m7-datetime__group" ref={this.setRef("hour")}>
        <div className="m7-datetime__mask"/>
        <div className="m7-datetime__indicator"/>
        {this.state.hour.nums}
      </div> : null,
      this.minuteShow ? <div key="minute" className="m7-datetime__group" ref={this.setRef("minute")}>
        <div className="m7-datetime__mask"/>
        <div className="m7-datetime__indicator"/>
        {this.state.minute.nums}
      </div> : null,
      this.secondShow ? <div key="second" className="m7-datetime__group" ref={this.setRef("second")}>
        <div className="m7-datetime__mask"/>
        <div className="m7-datetime__indicator"/>
        {this.state.second.nums}
      </div> : null,
    ];
  }
}
