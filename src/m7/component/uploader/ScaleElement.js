/**
 * 基于hammer.js库缩放元素函数
 * Created by XLBerry on 2019/6/20
 */

function ScaleElement(props) {
  if (typeof props.element !== "function") throw "element对象应为函数";
  this.props = props; // 函数配置
  this.lock = false; // 标记锁，用于缩放移动控制
  this.initVariable(); // 初始化过程对象

  window.M7GET("loadScript")({
    url: "./js/hammer.min.js",
    type: "url",
    test: () => window["Hammer"] && window["Hammer"].Manager,
    success: () => this.init(window["Hammer"]),
    fail: () => {
      throw "环境缺失Hammer.js库插件";
    }
  });
}

ScaleElement.prototype.init = function (Hammer) {
  this.hammerTime = new Hammer.Manager(this.props.element());
  this.hammerTime.add(new Hammer.Pan({ threshold: 0, pointers: 0 }));
  this.hammerTime.add(new Hammer.Pinch({ threshold: 0 }))["recognizeWith"](this.hammerTime.get("pan"));
  this.hammerTime.on("panstart panmove panend", (e) => {
    e.srcEvent.stopPropagation();
    if (this.lock) return;
    if (e.type === "panstart") {
      this.process.startTranslate = this.process.translate;
    }
    let newXX = this.process.startTranslate.x + e.deltaX, newXY = this.process.startTranslate.y + e.deltaY;
    if (Math.abs(newXX) >= this.process.driftXMax) {
      newXX = this.process.driftXMax * (newXX > 0 ? 1 : -1);
    }
    if (Math.abs(newXY) >= this.process.driftYMax) {
      newXY = this.process.driftYMax * (newXY > 0 ? 1 : -1);
    }
    this.process.translate = { x: newXX, y: newXY };
    this.toAnimation();
  });
  this.hammerTime.on("pinchstart pinchmove pinchend", (e) => {
    e.srcEvent.stopPropagation();
    if (this.lock) return;
    if (e.type === "pinchstart") {
      this.process.startScale = this.process.scale;
    }
    this.process.scale = this.process.startScale * e.scale;
    if (this.process.scale > this.process.maxScale) {
      this.process.scale = this.process.maxScale;
    } else if (this.process.scale < this.process.minScale) {
      this.process.scale = this.process.minScale;
    }
    this.process.driftXMax = ~~Math.abs((this.process.clientWidth - (this.process.eleWidth * this.process.scale)) * 0.5);
    this.process.driftYMax = ~~Math.abs((this.process.clientHeight - (this.process.eleHeight * this.process.scale)) * 0.5);
    this.toAnimation();
  });
};

/** 重置函数过程参数 */
ScaleElement.prototype.initVariable = function () {
  const { clientWidth, clientHeight } = this.props.element();
  this.process = {
    minScale: this.props.minScale || 1, // 最小形变
    maxScale: this.props.maxScale || 3, // 最大形变
    startScale: 1, // 形变初始
    scale: 1, // 形变过程
    startTranslate: {}, // 位移初始
    translate: { x: 0, y: 0 }, // 位移过程
    eleWidth: clientWidth, // 内容宽度，例如图片宽度
    eleHeight: clientHeight, // 内容高度，例如图片高度
    clientWidth: clientWidth, // 容器宽度
    clientHeight: clientHeight, // 容器高度
    driftXMax: 0, // 最大拖拽x轴位移
    driftYMax: 0, // 最大拖拽y轴位移
  };
};

/** css位移缩放 */
ScaleElement.prototype.toAnimation = function (opt = this.process) {
  const { translate: { x, y }, scale } = opt;
  let value = `translate3d(${x}px, ${y}px, 0px)scale(${scale})`;
  this.props.element().style.webkitTransform = value;
  this.props.element().style.mozTransform = value;
  this.props.element().style.transform = value;
};

/** 添加图片，获取图片尺寸比率缩放 */
ScaleElement.prototype.setImageElementSize = function (src) {
  this.lock = true;
  let tmpImage = new Image(); // 获取图片尺寸
  tmpImage.onload = () => {
    const { clientWidth, clientHeight } = this.props.element();
    this.process.clientWidth = clientWidth;
    this.process.clientHeight = clientHeight;
    const { width, height } = tmpImage;
    if (width >= height) {
      // 宽屏图片
      this.process.eleWidth = clientWidth;
      this.process.eleHeight = ~~((this.process.eleWidth / width) * height);
    } else {
      // 竖屏图片
      this.process.eleHeight = clientHeight;
      this.process.eleWidth = ~~((this.process.eleHeight / height) * width);
    }
    this.process.driftXMax = ~~Math.abs((clientWidth - (this.process.eleWidth * this.process.scale)) * 0.5);
    this.process.driftYMax = ~~Math.abs((clientHeight - (this.process.eleHeight * this.process.scale)) * 0.5);
    this.lock = false;
    tmpImage = null;
  };
  tmpImage.onerror = () => {
    this.lock = false;
  };
  tmpImage.src = src;
};

export default ScaleElement;