/**
 * Created by XLBerry on 2019/6/14
 */
import React from "react";
import M7 from "m7";
import Header from "../component/Header";
import * as MyRequest from "./MyRequest";

@M7.create({ namespace: "uploader" })
export default class MyUploader extends React.Component {

  state = {
    gallery: {
      hidden: true
    },
    myUploader: [
      {
        id: `0-0`,
        status: "success",
        data: { id: "4028c2af6b69b18d016b69ebc8670031" },
        src: "blob:http://localhost:8888/2d7b748e-7734-4c5b-91a6-26c6ed6efbdc",
      },
      {
        id: `0-1`,
        status: "success",
        data: { id: "4028c2af6b69b18d016b69ec189b0033" },
        src: "blob:http://localhost:8888/2d7b748e-7734-4c5b-91a6-26c6ed6efbdc",
      },
      {
        id: `0-2`,
        status: "success",
        data: { id: "4028c2af6b6d2f66016b6e7e4e2e00a1" },
        src: "blob:http://localhost:8888/2d7b748e-7734-4c5b-91a6-26c6ed6efbdc",
      },
      {
        id: `0-3`,
        status: "success",
        data: { id: "4028c2af6b6d2f66016b6e7e554400a3" },
        src: "blob:http://localhost:8888/2d7b748e-7734-4c5b-91a6-26c6ed6efbdc",
      },
      {
        id: `0-4`,
        status: "success",
        data: { id: "4028c2af6b6d2f66016b6e7e591a00a5" },
        src: "blob:http://localhost:8888/2d7b748e-7734-4c5b-91a6-26c6ed6efbdc",
      },
      /*{
        id: `0-5`,
        status: "success",
        data: { id: "4028c2af6b6d2f66016b6e7e5cc300a9" },
        src: "blob:http://localhost:8888/2d7b748e-7734-4c5b-91a6-26c6ed6efbdc",
      },*/
      {
        id: `0-6`,
        status: "success",
        data: { id: "4028c2af6b6ed929016b702266fb0069" },
      },
      {
        id: `0-7`,
        status: "original",
        src: "https://h1.ioliu.cn/bing/PantheraLeoDad_ZH-CN9580668524_1920x1080.jpg",
      }
    ]
  };

  handleGalleryShow = () => {
    this.setState({
      gallery: { hidden: false, src: "./image/pic_article.png" }
    });
  };

  handleGalleryHide = () => {
    this.setState({
      gallery: { hidden: true, src: "" }
    });
  };

  /** 上传图片 */
  handleUpload = async ({ data, success, fail }) => {
    const id = await MyRequest.upload({ data }, "string"); // blob
    console.log(id);
    if (id) {
      success({ id });
    } else {
      fail();
    }
  };

  /** 下载图片 */
  handleDownload = async ({ data, success, fail }) => {
    const { base64 } = await MyRequest.download({ data });
    if (base64) {
      success({ base64 });
    } else {
      fail();
    }
  };

  handleSubmit = () => {
    console.log(this.state);
  };

  render() {
    return <div>
      <Header title="Uploader" desc={<span>上传组件，一般配合组件 <span style={{ color: "#576B95" }} onClick={this.handleGalleryShow}>Gallery</span> 来使用。</span>}/>
      <M7.Gallery hidden={this.state.gallery.hidden} src={this.state.gallery.src} onHide={this.handleGalleryHide}/>
      <div className="m7-cells__title">图片栏目</div>
      <div className="m7-cells">
        <M7.Uploader id="myUploader" title="图片上传" upload={this.handleUpload} download={this.handleDownload} autoOriginal/>
      </div>
      <div style={{ padding: "30px 15px 40px 15px" }}>
        <M7.Button title="页面数据" type="primary" display="block" onClick={this.handleSubmit}/>
      </div>
    </div>;
  }
}