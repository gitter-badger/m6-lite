/**
 * Created by XLBerry on 2019/5/5
 */

import React from "react";
import M7 from "m7";

@M7.create({ namespace: "main-view" })
export default class MainView extends React.Component {

  state = {
    hx: "河蟹"
  };

  pClick = async () => {
    await this.setState({ disabled: !this.state.disabled });
  };

  bClick = () => {
    console.log(this.state);
    this.props.history["push"]({ pathname: "/dict" });
  };

  /** 设置值 */
  setClick = () => {
    this.setState({ sjhm: "13800138000", date: new Date(2018, 7, 8) });
  };

  /** 清空 */
  clearClick = () => {
    this.setState({ sjhm: '', pwd: '', yzm: '', time: null, date: null });
  };

  gClick = () => {
    console.log(this.state);
    console.log(this.getRef("hello"));
  };

  cClick = async () => {
    await this.setState({ checkStatus: "loading" });
    let result = await this.validate();
    console.log("校验结果", result);
    await this.setState({ checkStatus: null });
    if (result.length > 0) {
      return M7.showNotification({ type: "warn", title: result[0], autoHidden: true });
    }
  };

  onChange = (v) => {
    console.log("onChange-input:", v);
  };

  sjhCheck = (v, formData) => {
    console.log("sjhCheck", v, formData);
    if (v) {
      return true;
    } else return false;
  };

  timeoutX = (ms = 2000) => new Promise(resolve => {
    setTimeout(resolve, ms);
  });

  pwdCheck = async (v) => {
    await this.timeoutX(3000);
    if (v) {
      return true;
    } else {
      return false;
    }
  };

  yzmCheck = async (v) => {
    await this.timeoutX(2000);
    if (v) {
      return true;
    } else {
      return "小鸡吧错误了";
    }
  };

  rqCheck = (v) => {
    console.log("日期校验", v);
    if (v) {
      return true;
    } else {
      return false;
    }
  };

  pickerClick = () => {
    M7.showPicker({});
  };

  render() {
    return <div>
      <p onClick={this.pClick} ref={this.setRef("hello")}>Hello World!~</p>
      <div className="m7-cells__title">表单</div>
      <div className="m7-cells">
        <M7.Input id="sjhm" title="手机号" type="tel" placeholder="请输入手机号" onChange={this.onChange}
                  rules={[{ type: this.sjhCheck, message: "手机号码不正确" }]}/>
        <M7.Input id="pwd" title="密码" type="password" placeholder="请输入密码" onChange={this.onChange}
                  rules={[{ type: this.pwdCheck, message: "密码不正确" }]}/>
        <M7.Input id="yzm" title="验证码" disabled={this.state.disabled} placeholder="请输入验证码" onChange={this.onChange}
                  rules={[{ type: this.yzmCheck, message: "验证码不正确" }]}
                  ft={<div style={{ color: '#576B95' }}>获取验证码</div>}/>
        <M7.Selector id="time" title="时间" placeholder="请选择时间" type="datetime"/>
        <M7.Selector id="date" title="日期" placeholder="请选择日期" type="datetime" format="yyyy/MM/dd"
                     rules={[{ type: this.rqCheck, message: "请选择日期" }]}/>
      </div>
      <M7.Button title="设置" type="primary" onClick={this.setClick}/>
      <M7.Button title="清空" type="default" onClick={this.clearClick}/>
      <M7.Button title="获取输出" type="default" onClick={this.gClick}/>
      <M7.Button title="跳转" type="warn" onClick={this.bClick}/>
      <M7.Button title="校验" type="default" status={this.state.checkStatus} onClick={this.cClick}/>
      <button onClick={this.pickerClick}>显示picker</button>
    </div>;
  }
}
