/**
 * Created by XLBerry on 2019/6/12
 */
import React from "react";
import PropTypes from "prop-types";
import create from "../../hoc/WrapComponent";
import PreImage from "./PreImage";
import Gallery from "./Gallery";
import { debounce } from "../../hoc/Boost";
import ProcessUtils from "../process/index";

@create({ type: "element" })
export default class Uploader extends React.Component {

  state = {
    gallery: { id: "", hidden: true, src: "" },
    data: []
  };

  static getDerivedStateFromProps(props, state) {
    if (!state.userAction) {
      const { viewProxy, id } = props;
      const vData = viewProxy.get()[id] || [];
      return { ...state, data: vData };
    } else {
      return { ...state, userAction: false };
    }
  }

  /** 触发上传逻辑 */
  handleUpload = (item) => {
    const { upload, beforeUpload, afterUpload } = this.props;
    if (typeof upload === "function") {
      typeof beforeUpload === "function" && new Promise((resolve) => resolve()).then(() => beforeUpload(item)); // 开启微任务，避免render过程执行
      upload({
        data: item,
        success: data => {
          item.status = "success";
          item.action = "download"; // 将上传状态修改为下载状态
          item.data = data;
          item.compressed = false;
          delete item.file;
          this.refreshFileItem(item, afterUpload);
        },
        fail: () => {
          item.status = "fail";
          delete item.data;
          this.refreshFileItem(item, afterUpload);
        }
      });
    }
  };

  /** 触发下载逻辑 */
  handleDownload = (item, callback) => {
    const { download, beforeDownload, afterDownload } = this.props, compressed = item.compressed;
    if (typeof download === "function") {
      typeof beforeDownload == "function" && new Promise((resolve) => resolve()).then(() => beforeDownload(item)); // 开启微任务，避免render过程执行
      if (!compressed) {
        ProcessUtils.showLoading({
          title: "努力加载中"
        });
      }
      const handleAfterDownload = () => {
        typeof afterDownload === "function" && afterDownload(item);
        typeof callback === "function" && callback(item);
      };
      download({
        data: item,
        success: ({ base64 }) => {
          !compressed && ProcessUtils.hideLoading();
          item.status = "success";
          item.action = "download"; // 下载状态
          item.src = base64;
          item.compressed = compressed;
          this.refreshFileItem(item, handleAfterDownload);
        },
        fail: () => {
          !compressed && ProcessUtils.hideLoading();
          item.status = "download";
          item.compressed = true;
          this.refreshFileItem(item, handleAfterDownload);
        }
      });
    }
  };

  /** 触发自动下载 */
  handleAutoDownload = (item) => {
    let tOutMs = Date.now() - (item.timestamp || 0);
    if (!item.src && item.data) {
      this.toAutoDownload(item);
    } else if ((/^blob:/i).test(item.src) && tOutMs > 1000 * 60 * 3) {
      // 添加判断blob链接，符合blob本地链接，时效超过3分钟
      item.timestamp += tOutMs;
      item.src["urlValid"]({ timeout: 1000 }).then((flag) => {
        if (!flag) {
          this.toAutoDownload(item);
        }
      });
    }
  };

  /** 搭配handleAutoDownload使用 */
  toAutoDownload = (item) => {
    if (this.props.autoDownload) {
      // 自动下载模式
      item.status = "downloading";
      item.compressed = true;
      delete item.random;
    } else {
      item.status = "download";
    }
    if (item.src) {
      window.URL.revokeObjectURL(item.src); // 释放沙盒URL
      item.src = ""; // 移除沙盒URL
    }
    this.refreshFileItem(item);
  };

  /** 图片文件刷新状态，函数防抖避免过度刷新 */
  refreshFileItem = debounce(300)(async (item, callback) => {
    await this.setState({ userAction: true });
    const { viewProxy, id } = this.props;
    viewProxy.get()[id] = this.state.data;
    typeof callback === "function" && callback(item);
  });

  /** 单个文件点击触发 */
  onItemClick = (item, e) => {
    e.stopPropagation();
    if ("process uploading downloading download 404".indexOf(item.status) >= 0) {
      return false; // 过程状态，禁止缩放
    }
    const galleryToShow = (item) => {
      this.setState({
        userAction: true,
        gallery: { hidden: false, src: item.src, id: item.id }
      }); // 触发大图显示
    };
    if (item.compressed && this.props.autoOriginal) { // 触发载入原图
      item.compressed = false;
      this.handleDownload(item, (item) => galleryToShow(item));
    }
    galleryToShow(item);

    return false;
  };

  /** 单个文件失败状态下点击触发 */
  onItemFailClick = (item, e) => {
    e.stopPropagation();
    if (item.status === "fail") {
      if (item.action === "upload") { // 上传失败
        item.status = "uploading"; // 避免重复提交
      } else { // 下载失败
        item.status = "downloading"; // 避免重复提交
        item.compressed = true;
      }
      delete item.random;
      this.refreshFileItem(item);
    }
    return false;
  };

  /** 单个文件点击触发下载获取图片 */
  onItemDownloadClick = (item, e) => {
    e.stopPropagation();
    if (item.status === "download") {
      item.status = "downloading"; // 避免重复提交
      delete item.random;
      item.compressed = true;
      this.refreshFileItem(item);
    }
    return false;
  };

  /** 渲染元素 */
  onFileRender = () => this.state.data.map((item) => {
    if (item.status === "uploading") {
      // 准备触发上传操作
      item.status = "process";
      delete item.random;
      this.handleUpload(item);
    } else if (item.status === "downloading") {
      // 准备触发下载操作
      item.status = "process";
      delete item.random;
      item.compressed = true;
      this.handleDownload(item);
    } else if (item.status === "success") {
      this.handleAutoDownload(item);
    }

    return <PreImage key={item.id} className="m7-uploader__bd__file" data={item} src={item.src} status={item.status} progress={item.random}
                     onClick={this.onItemClick.bind(this, item)} onFail={this.onItemFailClick.bind(this, item)} onDownload={this.onItemDownloadClick.bind(this, item)}/>;
  });

  /** 从相机或者图片库导入图片 */
  handleFileChange = (e) => {
    let src, files = e.target.files;
    let fileItems = this.state.data || [], curLength = fileItems.length, addLength = files.length;
    const { upload, maxSize } = this.props;
    for (let i = 0, len = curLength + addLength > maxSize ? maxSize - curLength : addLength; i < len; ++i) {
      let file = files[i];
      if (window.URL) {
        src = window.URL.createObjectURL(file);
      } else {
        src = e.target.result;
      }
      fileItems.push({
        id: `${curLength + i}-${file.name}-${file.type}-${file.size}-${file.lastModified}`,
        status: upload ? "uploading" : "original",
        action: upload ? "upload" : "download", // 对状态的补充，当前属于上传还是下载
        src, file, fileType: file.type,
        timestamp: Date.now()
      });
    }
    e.target.value = ""; // 支撑上传同一张照片
    this.setState({
      userAction: true,
      data: [].concat(fileItems)
    });
  };

  /** 预览图片触发关闭 */
  handleGalleryHide = () => {
    this.setState({
      userAction: true,
      gallery: { id: "", hidden: true, src: "" }
    });
  };

  /** 删除预览图片，事件冒泡会穿透到执行隐藏Gallery */
  handleDelete = (e) => {
    let fileId = null, delIndex = -1;
    if (typeof e === "string") {
      fileId = e;
    } else {
      fileId = this.state.gallery.id;
    }
    this.state.data.some((item, i) => {
      if (item.id === fileId) {
        delIndex = i;
        return true;
      } else return false;
    });
    if (delIndex >= 0) {
      this.state.data.splice(delIndex, 1);  // 移除对象
      this.refreshFileItem();
    }
    typeof this.props.onDelete == "function" && this.props.onDelete({ id: delIndex >= 0 ? fileId : null });
  };

  render() {
    const { className, style, title, maxSize, slot } = this.props, curSize = this.state.data.length;
    return (<div className={className} style={style}>
      <Gallery hidden={this.state.gallery.hidden} src={this.state.gallery.src} onHide={this.handleGalleryHide} onDelete={this.handleDelete}/>
      <div className="m7-cell m7-cell--noline">
        <div className="m7-uploader">
          {
            !title ? null : <div className="m7-uploader__hd">
              <div className="m7-uploader__hd__title">{title}</div>
              <div className="m7-uploader__hd__ft">{curSize}/{maxSize}</div>
            </div>
          }
          <div className="m7-uploader__bd">
            <ul className="m7-uploader__bd__files">
              {this.onFileRender()}
            </ul>
            <div className="m7-uploader__bd__input" style={{ display: curSize < maxSize ? "block" : "none" }}>
              <input type="file" accept="image/*" multiple onChange={this.handleFileChange}/>
            </div>
          </div>
        </div>
      </div>
      {slot ? <div className={`m7-cell m7-uploader-ft`}>{slot}</div> : null}
    </div>);
  }
}

Uploader.defaultProps = {
  ...Uploader.defaultProps,
  maxSize: 8, // 限制最大数8
  sourceType: "both",
  autoDownload: true,
  autoOriginal: false
};

Uploader.propTypes = {
  ...Uploader.propTypes,
  title: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node
  ]),
  maxSize: PropTypes.number, // 最大个数

  sourceType: PropTypes.oneOf(["album", "camera", "both"]), // 图片来源，相册，相机，都有
  upload: PropTypes.func, // 请求上传函数
  download: PropTypes.func, // 加载显示函数（在file为空的情况下执行加载）

  autoDownload: PropTypes.bool, // 首次主动载入（在file-url无效的情况下执行加载）
  autoOriginal: PropTypes.bool, // 具备原图显示，在预览图片的时候，触发展示原图

  beforeUpload: PropTypes.func, // 上传图片前监听
  afterUpload: PropTypes.func, // 上传图片后监听
  beforeDownload: PropTypes.func, // 下载图片前监听
  afterDownload: PropTypes.func, // 下载图片后监听

  onDelete: PropTypes.func, // 删除图片监听
};