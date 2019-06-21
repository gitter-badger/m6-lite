/**
 * 下拉刷新，上拉加载
 * Created by XLBerry on 2019/5/24
 */

import { setTransformStr, setTransform, getTransform } from "../../css/CSSPrefix";

/** 查找滚动区域父级节点 */
function findOverflowTarget(node, className) {
  if (node.nodeName.toLowerCase() === "body") {
    return node;
  } else if (node.nodeName.toLowerCase() === "div" && (node.classList.contains(className))) {
    return node;
  } else {
    return findOverflowTarget(node.parentNode, className);
  }
}

function createLoadDOM(flag, dist) {
  let container = document.createElement("div");
  container.setAttribute("style", `position: absolute; left: 0; right: 0; z-index: 1; 
    padding: ${dist / 5}px 0;
    text-align: center; color: rgba(0, 0, 0, 0.2); font-size: small; top: ${flag === "down" ? 0 : "auto"}; 
    bottom: ${flag === "down" ? "auto" : 0}; ${setTransformStr("0px", flag === "down" ? "-100%" : "100%")};`);
  let text = document.createElement("p");
  text.innerText = LoadTexts[flag];
  container.appendChild(text);
  return { [`${flag}LoadDOM`]: container, [`${flag}LoadDOMText`]: text };
}

const LoadTexts = {
  down: "下拉刷新",
  downActive: "松开刷新",
  up: "上拉加载",
  upActive: "松开加载",
  loading: "努力加载中"
};

/**
 *
 * @param target
 * @param onReLoad 顶部下拉，触发重置刷新
 * @param onLoad 底部上推，触发加载更多
 * @param distThreshold 触发距离，默认60px
 * @param canDown 初始设置可否下拉
 * @param canUp 初始设置可否上推
 * @param scrollNodeCls 滚动区域节点筛选class
 * @param scrollNode 滚动区域父级节点
 * @return {init}
 */
export default function pullToRefresh({
                                        target, onReLoad, onLoad, distThreshold = 80, canDown = true, canUp = true,
                                        scrollNodeCls = "m7-page", scrollNode = findOverflowTarget(target, scrollNodeCls)
                                      }) {
  if (![1, 9, 11].includes(target.nodeType)) {
    throw "当前dom对象非容器类";
  }
  target.parentNode.style.position = "relative";
  target.parentNode.style.overflow = "hidden";
  setTransform(target);
  const { downLoadDOM, downLoadDOMText } = createLoadDOM("down", distThreshold);
  const { upLoadDOM, upLoadDOMText } = createLoadDOM("up", distThreshold);
  target.insertBefore(downLoadDOM, target.firstChild);
  target.appendChild(upLoadDOM);
  this.props = {
    target, onReLoad, onLoad, distThreshold, scrollNode,
    downLoadDOM, downLoadDOMText, upLoadDOM, upLoadDOMText,
  };
  this.touchData = {
    loading: false, // 异步触发标记符
    loadTextFlag: 0, // 默认状态

    canDown: false, // 下拉
    canDownStatic: canDown, // 外部控制下拉
    canUp: false, // 上推
    canUpStatic: canUp, // 外部控制上推

    startClientY: 0, // 触点开始位置
    endClientY: 0, // 触点结束位置
  };

  target.addEventListener("touchstart", this._touchStart = this.touchStart.bind(this));
  target.addEventListener("touchmove", this._touchMove = this.touchMove.bind(this));
  target.addEventListener("touchend", this._touchEnd = this.touchEnd.bind(this));
}

/**
 * 触摸开始
 * @param e 事件
 */
pullToRefresh.prototype.touchStart = function (e) {
  const { target, scrollNode: { scrollTop, offsetHeight, scrollHeight }, downLoadDOMText, upLoadDOMText } = this.props;
  if (this.touchData.loading) {
    return;
  }
  /*if (document.activeElement && ["input", "textarea", "select"].includes(document.activeElement.nodeName.toLowerCase())) {
    document.activeElement["blur"](); // 移除输入框类型焦点
  }*/
  this.touchData.canDown = this.touchData.canUp = false; // 重置下拉上推标记
  this.touchData.loadTextFlag = 0;
  if (scrollTop === 0) {
    if (this.touchData.canDownStatic && offsetHeight < scrollHeight) {
      this.touchData.canDown = true; // 当前抵达顶部
      downLoadDOMText.innerText = LoadTexts.down;
      target.style.transition = `all 0s linear 0s`;
      this.touchData.startClientY = e.touches[0].clientY;
    }
  } else if (scrollTop > 0) {
    if (this.touchData.canUpStatic && scrollHeight - scrollTop - offsetHeight < 1) {
      this.touchData.canUp = true; // 当前抵达底部
      upLoadDOMText.innerText = LoadTexts.up;
      target.style.transition = `all 0s linear 0s`;
      this.touchData.startClientY = e.touches[0].clientY;
    }
  }
};

/**
 * 触摸过程
 * @param e 事件
 */
pullToRefresh.prototype.touchMove = function (e) {
  if (this.touchData.loading) {
    return;
  }
  if (this.touchData.canDown) {
    // 下拉过程
    this.touchData.endClientY = e.touches[0].clientY;
    this.touchData.endTranslateY = Math.max(this.touchData.endClientY - this.touchData.startClientY, 0) * 0.6;
    this.setTipsText(e, 1, this.props.downLoadDOMText, LoadTexts.down, LoadTexts.downActive);
    setTransform(this.props.target, "0px", `${this.touchData.endTranslateY}px`);
  } else if (this.touchData.canUp) {
    // 上推过程
    this.touchData.endClientY = e.touches[0].clientY;
    this.touchData.endTranslateY = Math.min(this.touchData.endClientY - this.touchData.startClientY, 0) * 0.6;
    this.setTipsText(e, -1, this.props.upLoadDOMText, LoadTexts.up, LoadTexts.upActive);
    setTransform(this.props.target, "0px", `${this.touchData.endTranslateY}px`);
  }
};

/**
 * 触摸结束
 */
pullToRefresh.prototype.touchEnd = async function () {
  if (this.touchData.loading) {
    return;
  }
  const { target, distThreshold, onReLoad, onLoad, downLoadDOM, upLoadDOM } = this.props;
  const shiftY = getTransform(target)[1];
  target.style.transition = `all 0.3s ease-out 0s`;
  if (Math.abs(~~shiftY) > distThreshold) {
    if (this.touchData.canDown || this.touchData.canUp) {
      const loadFunc = this.touchData.canDown ? onReLoad : onLoad;
      const loadEle = this.touchData.canDown ? downLoadDOM : upLoadDOM;
      const diffDist = this.touchData.canDown ? distThreshold : -distThreshold;
      if (typeof loadFunc == "function") {
        let rs = loadFunc();
        if (rs instanceof Promise) {
          await this.wait2Promise(rs, diffDist, loadEle);
        }
      }
    }
  }
  setTransform(target);
};

pullToRefresh.prototype.setTipsText = function (e, origin, tipsEle, text, activeText) {
  if (origin * this.touchData.endTranslateY > 0) {
    e.preventDefault();
    if (origin * this.touchData.endTranslateY >= this.props.distThreshold) {
      if (this.touchData.loadTextFlag === 0) {
        this.touchData.loadTextFlag = 1;
        tipsEle.innerText = activeText;
      }
    } else {
      if (this.touchData.loadTextFlag === 1) {
        this.touchData.loadTextFlag = 0;
        tipsEle.innerText = text;
      }
    }
  }
};

pullToRefresh.prototype.wait2Promise = async function (promise, diffDist, loadEle) {
  this.touchData.loading = true;
  setTransform(this.props.target, "0px", `${diffDist}px`);

  let loadingIcon = document.createElement("i");
  loadingIcon.setAttribute("class", "m7-loading-icon");
  if (this.touchData.canDown) {
    loadEle.insertBefore(loadingIcon, loadEle.firstChild);
  } else {
    loadEle.appendChild(loadingIcon);
  }
  await promise;
  loadEle.removeChild(loadingIcon);
  this.touchData.loading = false;
};

pullToRefresh.prototype.toLoad = function (loading = true) {
  const { target, distThreshold, downLoadDOM, downLoadDOMText } = this.props;
  if (loading) {
    this.touchData.loading = true;
    downLoadDOMText.innerText = LoadTexts.loading;
    this.toLoad.loadingIcon = document.createElement("i");
    this.toLoad.loadingIcon.setAttribute("class", "m7-loading-icon");
    downLoadDOM.insertBefore(this.toLoad.loadingIcon, downLoadDOM.firstChild);
    setTransform(target, "0px", `${distThreshold}px`);
    target.style.minHeight = `${downLoadDOM.clientHeight}px`;
  } else {
    downLoadDOMText.innerText = "";
    setTransform(target);
    delete target.style.minHeight;
    downLoadDOM.removeChild(this.toLoad.loadingIcon);
    this.touchData.loading = false;
  }
};

pullToRefresh.prototype.destroy = function () {
  const { target, downLoadDOM, upLoadDOM } = this.props;
  target.removeChild(downLoadDOM);
  target.removeChild(upLoadDOM);
  target.removeEventListener("touchstart", this._touchStart);
  target.removeEventListener("touchmove", this._touchMove);
  target.removeEventListener("touchend", this._touchEnd);
};

pullToRefresh.prototype.canDown = function (canDown = true) {
  this.touchData.canDownStatic = canDown;
};

pullToRefresh.prototype.canUp = function (canUp = true) {
  this.touchData.canUpStatic = canUp;
};
