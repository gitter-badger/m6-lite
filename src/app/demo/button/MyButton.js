/**
 * Created by XLBerry on 2019/6/6
 */
import React from "react";
import M7 from "m7";
import Header from "../component/Header";

@M7.create()
export default class MyButton extends React.Component {
  render() {
    return <div>
      <Header title="Button" desc="按钮"/>
      <div style={{padding: "15px"}}>
        <M7.Button title="页面主操作" type="primary"/>
        <div className="m7-btns">
          <M7.Button title="页面主操作" type="primary" status="loading"/>
          <M7.Button title="页面主操作" type="primary" status="disabled"/>
        </div>
        <M7.Button title="页面次要操作" type="default"/>
        <M7.Button title="页面次要操作" type="default" status="loading"/>
        <M7.Button title="页面次要操作" type="default" status="disabled"/>
        <M7.Button title="警告类操作" type="warn"/>
        <M7.Button title="警告类操作" type="warn" status="loading"/>
        <M7.Button title="警告类操作" type="warn" status="disabled"/>

        <M7.Button title="页面主操作" type="primary" style={{ width: "auto" }}/>
        <M7.Button title="页面次要操作" type="default" style={{ width: "auto" }} status="loading"/>
        <M7.Button title="警告类操作" type="warn" style={{ width: "auto" }} status="disabled"/>
      </div>
    </div>;
  }
}