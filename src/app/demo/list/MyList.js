/**
 * Created by XLBerry on 2019/6/11
 */
import React from "react";
import M7 from "m7";
import Header from "../component/Header";
import weatherCity from "./weather-city.json";
import "./my-list.less";

@M7.create({ namespace: "mylist" })
export default class MyList extends React.Component {

  state = {
    myList: [],
    pageSize: 15,
    current: 0,
    total: weatherCity.CityCode.length, // 总城市数
  };

  async componentDidMount() {
    if (this.props.history.action === "PUSH" || this.state.myList.length === 0)
      await this.handleReLoad();
  }

  /** 重载 */
  handleReLoad = async () => {
    await this.setState({ reLoad: true });
    await this.handleLoad();
  };

  /** 加载更多 */
  handleLoad = async () => {
    let { current, myList, pageSize, total, reLoad } = this.state, nextCurrent;
    if (reLoad) {
      myList = [];
      current = 0;
    }
    nextCurrent = current + pageSize - 1;
    if (nextCurrent + 1 >= total) {
      nextCurrent = total - 1;
    }
    for (; current <= nextCurrent; current++) {
      const { name, code } = weatherCity.CityCode[current].cityList[0].countyList[0];
      myList.push({
        name, code, info: null
      });
    }
    this.setState({ current, myList, reLoad: false });
  };

  /** 网络请求查询数据 */
  handleRequestWeatherInfo = (itemData) => {
    M7.request({
      method: "GET",
      url: "/weather_mini",
      data: {
        citykey: itemData.code
      },
      requestType: "json",
      responseType: "json",
      success: (res) => {
        let { data } = res;
        itemData.info = data.data;
        this.refreshWeatherInfo();
      },
      fail: () => {
      }
    });
  };

  /** 防抖刷新列表 */
  refreshWeatherInfo = M7.boost.debounce(500)(() => this.setState({}));

  weatherColor = {
    "晴": "#FAFAD2",
    "多云": "#FFFFFF",
    "阵雨": "#F0FFFF",
    "雷阵雨": "#F0FFFF",
    "小雨": "#E0FFFF",
    "中雨": "#E0EEEE",
    "中到大雨": "#D1EEEE",
    "大雨": "#CCCCCC",
  };

  /** 元素渲染 */
  handleItemRender = (itemData, index) => {
    const { name, code, info } = itemData;
    let currBackgroundImage, nextBackgroundImage;
    const currDate = info && info.forecast && info && info.forecast[0] || { low: "", high: "" };
    const nextDate = info && info.forecast && info && info.forecast[1] || { low: "", high: "" };
    if (!info) {
      itemData.info = {};
      this.handleRequestWeatherInfo(itemData);
    }
    if (currDate.type && currDate.type) {
      currBackgroundImage = `linear-gradient(to right , #FFFFFF, #FFFFFF, ${this.weatherColor[currDate.type] || "#FFFFFF"})`;
    }
    if (nextDate.type && nextDate.type) {
      nextBackgroundImage = `linear-gradient(to right , #FFFFFF, #FFFFFF, ${this.weatherColor[nextDate.type] || "#FFFFFF"})`;
    }

    return <div key={code} className="m7-cells" data-index={index}>
      <div className="m7-cell m7-pointer-events--none" style={{ backgroundImage: currBackgroundImage }}>
        <div className="m7-cell__hd m7-pointer-events--none">
          <label style={{ display: "block", width: "120px" }}>{name}</label>
        </div>
        <div className="m7-cell__bd m7-pointer-events--none" style={{ textAlign: "right", paddingRight: "10px" }}>{info && info.wendu && `${info.wendu}℃`}</div>
        <div className="m7-cell__ft m7-pointer-events--none">{
          currDate.type ? currDate.type : <i className="m7-icon-loading"/>
        }</div>
      </div>
      <div className="m7-cell m7-pointer-events--none" style={{ fontSize: "small", backgroundImage: nextBackgroundImage }}>
        <div className="m7-cell__hd m7-pointer-events--none">
          <label style={{ display: "block", width: "120px" }}>{nextDate.date}</label>
        </div>
        <div className="m7-cell__bd m7-pointer-events--none">{`${nextDate.low} ~ ${nextDate.high}`}</div>
        <div className="m7-cell__ft m7-pointer-events--none">
          <label>{nextDate.fengxiang}</label>
          <label style={{ paddingLeft: "10px" }}>{nextDate.type}</label>
        </div>
      </div>
    </div>;
  };

  /** list-item点击事件 */
  handleItemClick = (e) => {
    if (e.target.dataset.index) {
      let itemState = this.state.myList[~~e.target.dataset.index];
      if (itemState.info && itemState.info.wendu) {
        M7.navigate({ url: "/list-detail", state: itemState });
      }
    }
  };

  render() {
    console.log(Date.now(), this);
    return <div>
      <Header title="List" desc="列表"/>
      <M7.List id="myList" onReLoad={this.handleReLoad} onLoad={this.handleLoad} itemRender={this.handleItemRender} onClick={this.handleItemClick}
               opts={{ canDown: true, canUp: this.state.current != this.state.total }}/>
    </div>;
  }
}