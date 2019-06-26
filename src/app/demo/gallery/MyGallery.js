/**
 * Created by XLBerry on 2019/6/24
 */
import React from "react";
import M7 from "m7";
import Header from "../component/Header";

@M7.create()
export default class MyGallery extends React.Component {
  state = {
    hidden: true
  };

  /** 显示 */
  handleSubmit = () => {
    this.setState({ hidden: false, src: "./image/pic_article.png" });
  };

  /** 隐藏 */
  handleGalleryHide = () => {
    this.setState({ hidden: true, src: "" });
  };

  /** 删除预览图片触发 */
  handleDelete = () => {
  };

  render() {
    return <div>
      <Header title="Gallery" desc="图片预览，具备手势缩放"/>
      <M7.Gallery hidden={this.state.hidden} src={this.state.src} onHide={this.handleGalleryHide} onDelete={this.handleDelete}/>
      <div style={{ padding: "30px 15px 40px 15px" }}>
        <M7.Button title="预览" type="default" onClick={this.handleSubmit}/>
      </div>
    </div>;
  }
}