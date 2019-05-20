/**
 * Created by XLBerry on 2019/5/16
 */

export default class TouchEvent {

  state = {
    startTranslateY: 0, // 动作开始，当前布局对象位移Y
    endTranslateY: 0, // 动作过程，当前布局对象位移Y（直接滚动位置结果）
    maxTranslateY: 0, // 当前布局对象最大位移差
    startTime: 0, // 动作开始，时间戳

    startClientY: 0, // 触点开始位置
    endClientY: 0, // 触点结束位置
  };

  constructor({ container, target, callback }) {
    this.container = container;
    this.target = target;
    this.callback = typeof callback === "function" ? callback : () => {};
    if (this.container && typeof this.container.addEventListener === "function") {
      this.container.addEventListener("touchstart", this.touchStart, false);
      this.container.addEventListener("touchmove", this.touchMove, false);
      this.container.addEventListener("touchend", this.touchEnd, false);

      if (this.target.style.transform.indexOf("translate3d") !== -1) {
        let initTranslate = this.target.style.transform.replace("translate3d(", "").replace(")", "").replaceAll("px", "").split(", ");
        this.state.endTranslateY = ~~initTranslate[1];
      }
    }
  }

  unBind() {
    if (this.container && typeof this.container.addEventListener === "function") {
      this.container.removeEventListener("touchstart", this.touchStart);
      this.container.removeEventListener("touchmove", this.touchMove);
      this.container.removeEventListener("touchend", this.touchEnd);
    }
  }

  touchStart = (e) => {
    e.preventDefault();
    const { clientY } = e.touches[0];
    this.state.startClientY = clientY;
    this.state.startTranslateY = this.state.endTranslateY;
    this.target.style.transition = `all 0s linear 0s`;
    this.state.maxTranslateY = this.target.clientHeight - this.container.clientHeight;
    this.state.startTime = Date.now();
  };

  touchMove = (e) => {
    e.preventDefault();
    this.state.endClientY = e.touches[0].clientY;
    this.state.endTranslateY = this.state.endClientY - this.state.startClientY + this.state.startTranslateY;
    this.target.style.transform = `translate3d(0px, ${this.state.endTranslateY}px, 0px)`;
  };

  touchEnd = (e) => {
    e.preventDefault();
    this.target.style.transition = `all 0.3s ease-out 0s`;

    if (this.state.maxTranslateY < 0) {
      // 内容比容器高度小
      // 回归到顶部原始位置
      this.target.style.transform = `translate3d(0px, 0px, 0px)`;
      this.state.endTranslateY = 0;
    } else {
      if (this.state.endTranslateY > 0) {
        // 回归到顶部原始位置
        this.target.style.transform = `translate3d(0px, 0px, 0px)`;
        this.state.endTranslateY = 0;
      } else if (this.state.endTranslateY < -this.state.maxTranslateY) {
        // 回归到底部位置
        this.target.style.transform = `translate3d(0px, ${-this.state.maxTranslateY}px, 0px)`;
        this.state.endTranslateY = -this.state.maxTranslateY;
      } else {
        // 内容滚动，触发惯性滚动
        let diffMS = Date.now() - this.state.startTime, diffClientY = this.state.endClientY - this.state.startClientY;
        if (diffMS < 300) {
          let speed = Math.abs(diffClientY) / diffMS; // 手势速度
          let inertiaHeight = speed * 100; // 惯性滑动距离
          if (diffClientY > 0) {
            // 下拉
            if (this.state.endTranslateY + inertiaHeight > 0) {
              inertiaHeight = 0;
            } else {
              inertiaHeight = this.state.endTranslateY + inertiaHeight;
            }
          } else {
            // 上拉
            if (this.state.endTranslateY - inertiaHeight < -this.state.maxTranslateY) {
              inertiaHeight = -this.state.maxTranslateY;
            }else {
              inertiaHeight = this.state.endTranslateY - inertiaHeight;
            }
          }
          this.state.endTranslateY = inertiaHeight;
          this.target.style.transform = `translate3d(0px, ${this.state.endTranslateY}px, 0px)`;
        }
      }
    }

    this.callback({ translateY: this.state.endTranslateY });
  };

  setTranslate = ({ translateX = 0, translateY, translateZ = 0 }) => {
    this.state.endTranslateY = translateY;
    this.target.style.transform = `translate3d(${translateX}px, ${translateY}px, ${translateZ}px)`;
  }
}