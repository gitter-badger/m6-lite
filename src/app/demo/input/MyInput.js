/**
 * Created by XLBerry on 2019/6/6
 */
import React from "react";
import M7 from "m7";
import Header from "../component/Header";
import MySqry from "./MySqry";

@M7.create({ namespace: "input-view" })
export default class MyInput extends React.Component {

  state = {
    checkStatus: null,
    sqrys: []
  };

  /** 密码校验规则 */
  rulePWD = (v) => {
    let vl = v.trim().length;
    return vl >= 6 && vl <= 10;
  };

  /** 验证码校验规则 */
  ruleYZM = async (v) => {
    await this.setTimeout(1000); // 模拟网络请求
    return v % 2 === 0; // 模拟结果
  };

  /** 获取验证码 */
  handleGetYZM = () => {
    M7.showNotification({ type: "info", title: "验证码已发送", autoHidden: true });
  };

  handleChange = ({ id, type, data }) => {
    console.log("handleChange", `类型[${type}]，id[${id}]，data`, data);
  };

  /** 提交 */
  handleSubmit = async () => {
    await this.setState({ checkStatus: "loading" });
    const result = await this.validate();
    if (result.length > 0) {
      M7.showNotification({ type: "warn", title: result[0], autoHidden: true });
    }
    console.log("当前页面表单值", this.state);
    this.setState({ checkStatus: null });
  };

  /** 初始值 */
  handleInit = async () => {
    await this.setState({
      sjhm: "13800138000",
      csrq: new Date(1998, 11, 18),
    });
  };

  render() {
    return <div>
      <Header title="Input" desc="表单输入" onBack={this.goBack}/>
      <div className="m7-cells__title">账号信息</div>
      <div className="m7-cells">
        <M7.Input id="sjhm" title="手机号" type="tel" placeholder="请输入手机号" onChange={this.handleChange}
                  rules={[{ type: "required", message: "请输入手机号" }, { type: "mobile", message: "请输入正确手机号" }]}/>
        <M7.Input id="pwd" title="密码" type="password" placeholder="请输入密码" onChange={this.handleChange}
                  rules={[{ type: "required", message: "请输入密码" }, { type: this.rulePWD, message: "密码长度6-10位" }]}/>
        <M7.Input id="yzm" title="验证码" type="number" disabled={this.state.disabled} placeholder="请输入验证码" onChange={this.handleChange}
                  rules={[{ type: "required", message: "请输入验证码" }, { type: this.ruleYZM, message: "验证码错误" }]}
                  ft={<div style={{ color: "#576B95" }} onClick={this.handleGetYZM}>获取</div>}/>
      </div>
      <div className="m7-cells__title">个人信息</div>
      <div className="m7-cells">
        <M7.Selector id="csrq" title="出生日期" placeholder="请选择出生日期" type="datetime" format="yyyy/MM/dd"
                     rules={[{ type: "required", message: "请选择出生日期" }]} onChange={this.handleChange}/>
        <M7.Selector id="qzsj" title="签注时间" placeholder="请选择签注时间" type="datetime" onChange={this.handleChange}/>
      </div>
      <MySqry data={this.state.sqrys} />
      <div style={{ padding: "30px 15px 40px 15px" }}>
        <M7.Button title="提交" type="primary" display="block" status={this.state.checkStatus} onClick={this.handleSubmit}/>
        <M7.Button title="初始化" type="default" display="block" status={this.state.checkStatus} onClick={this.handleInit}/>
      </div>
    </div>;
  }
}