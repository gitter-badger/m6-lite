/**
 * Created by XLBerry on 2019/6/11
 */

import React from "react";
import M7 from "m7";
import Header from "../component/Header";

@M7.create()
export default class MyDetail extends React.Component {
  state = {};

  componentDidMount() {
    this.setState(this.props.location.state && this.props.location.state.info || {});
  }

  render() {
    const { city, wendu, ganmao, forecast = [] } = this.state;

    return <div>
      <Header title="List-Item-Detail" desc="列表元素详情页"/>
      <div className="m7-cells">
        <div className="m7-cell">
          <div className="m7-cell__hd">当前城市</div>
          <div className="m7-cell__bd" style={{ textAlign: "right" }}>{city}</div>
        </div>
        <div className="m7-cell">
          <div className="m7-cell__hd">温度</div>
          <div className="m7-cell__bd" style={{ textAlign: "right" }}>{wendu}℃</div>
        </div>
      </div>
      <div className="m7-cells__title">未来5天</div>
      <div className="m7-cells demo-my-list-item__weathers">{
        forecast.map(({ date, low, high, fengli, fengxiang, type }, i) => {
          return <div key={i} className="demo-my-list-item__weather">
            <div className="demo-my-list-item__weather__hd">
              {date}
              <label className="demo-my-list-item__weather__hd__temperature">{type}</label>
            </div>
            <div className="demo-my-list-item__weather__bd">
              <div>
                <label style={{ display: "inline-block", width: "80px" }}>{fengxiang}</label>
                <label style={{ marginLeft: "20px" }}>{fengli.replace("<![CDATA[", "风力 ").replace("]]>", "")}</label>
              </div>
            </div>
            <div className="demo-my-list-item__weather__bd">
              <div>
                <label style={{ display: "inline-block", width: "80px" }}>气温</label>
                <label style={{ marginLeft: "20px" }}>{low.replace("低温 ", "")} ~ {high.replace("高温 ", "")}</label>
              </div>
            </div>
          </div>;
        })
      }</div>
      <div className="m7-cells__title">建议</div>
      <div className="m7-cells">
        <div className="m7-cell">
          <div className="m7-cell__bd">{ganmao}</div>
        </div>
      </div>
    </div>;
  }
}