/**
 * Created by XLBerry on 2019/6/24
 */
import React from "react";
import M7 from "m7";
import Header from "../component/Header";
import "./my-icons.less";

@M7.create()
export default class MyIcons extends React.Component {
  render() {
    return <div>
      <Header title="Icons" desc="weui类图标"/>
      <div className="demo-icon">
        <div className="demo-icon-box">
          <i className="weui-icon-success weui-icon_msg"></i>
          <div className="demo-icon-box__ctn">
            <h3 className="demo-icon-box__title">成功</h3>
            <p className="demo-icon-box__desc">用于表示操作顺利达成</p>
          </div>
        </div>

        <div className="demo-icon-box">
          <i className="weui-icon-info weui-icon_msg"></i>
          <div className="demo-icon-box__ctn">
            <h3 className="demo-icon-box__title">提示</h3>
            <p className="demo-icon-box__desc">用于表示信息提示；也常用于缺乏条件的操作拦截，提示用户所需信息</p>
          </div>
        </div>
        <div className="demo-icon-box">
          <i className="weui-icon-warn weui-icon_msg-primary"></i>
          <div className="demo-icon-box__ctn">
            <h3 className="demo-icon-box__title">普通警告</h3>
            <p className="demo-icon-box__desc">用于表示操作后将引起一定后果的情况</p>
          </div>
        </div>
        <div className="demo-icon-box">
          <i className="weui-icon-warn weui-icon_msg"></i>
          <div className="demo-icon-box__ctn">
            <h3 className="demo-icon-box__title">强烈警告</h3>
            <p className="demo-icon-box__desc">用于表示操作后将引起严重的不可挽回的后果的情况</p>
          </div>
        </div>
        <div className="demo-icon-box">
          <i className="weui-icon-waiting weui-icon_msg"></i>
          <div className="demo-icon-box__ctn">
            <h3 className="demo-icon-box__title">等待</h3>
            <p className="demo-icon-box__desc">用于表示等待</p>
          </div>
        </div>

        <div className="demo-icon_sp_area">
          <i className="weui-icon-success"/>
          <i className="weui-icon-success-no-circle"/>
          <i className="weui-icon-circle"/>
          <i className="weui-icon-warn"/>
          <i className="weui-icon-download"/>
          <i className="weui-icon-info-circle"/>
          <i className="weui-icon-cancel"/>
          <i className="weui-icon-search"/>
        </div>
      </div>
    </div>;
  }
}