/**
 * Created by XLBerry on 2019/5/23
 */
import React from "react";
import M7 from "m7";

@M7.create({ namespace: "main-view3" })
export default class MainView3 extends React.Component {

  state = {
    myList: []
  };

  /** 添加数据 */
  addListData = () => {
    let myList = this.state.myList;
    this.setState({ myList: this.state.myList.concat([
      myList.length, myList.length + 1, myList.length + 2, myList.length + 3,
      myList.length + 4, myList.length + 5, myList.length + 6, myList.length + 7,
      myList.length + 8, myList.length + 9, myList.length + 10, myList.length + 11,
      ]) });
  };

  itemRender = (itemData) => {
    return <div key={itemData} style={{background: "#ffffff"}}>测试--{JSON.stringify(itemData)}</div>;
  };

  render() {
    return (
      <div>
        <div>
          <M7.Button title="添加数据" type="primary" onClick={this.addListData} />
        </div>
        <M7.List id="myList" itemRender={this.itemRender}/>
      </div>
    );
  }
}