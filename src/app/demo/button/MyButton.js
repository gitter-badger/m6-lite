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
      <Header title="Button" desc="按钮" onBack={this.goBack}/>
      <div style={{padding: "15px"}}>
        <M7.Button title="页面主操作" type="primary"/>
        <M7.Button title="页面主操作" type="primary" status="loading"/>
        <M7.Button title="页面主操作" type="primary" status="disabled"/>
        <M7.Button title="页面次要操作" type="default"/>
        <M7.Button title="页面次要操作" type="default" status="loading"/>
        <M7.Button title="页面次要操作" type="default" status="disabled"/>
        <M7.Button title="警告类操作" type="warn"/>
        <M7.Button title="警告类操作" type="warn" status="loading"/>
        <M7.Button title="警告类操作" type="warn" status="disabled"/>

        <M7.Button title="页面主操作" type="primary" display="block"/>
        <M7.Button title="页面次要操作" type="default" display="block" status="loading"/>
        <M7.Button title="警告类操作" type="warn" display="block" status="disabled"/>
      </div>
    </div>;
  }
}