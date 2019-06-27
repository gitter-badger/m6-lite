/**
 * Created by XLBerry on 2019/5/23
 */
import React from "react";
import PropTypes from "prop-types";
import create from "../../hoc/WrapComponent";
import PullToRefresh from "./PullToRefresh";

@create({ type: "element" })
export default class List extends React.PureComponent {

  state = {
    userAction: false, // 内部行为，事件消耗
    data: []
  };

  static getDerivedStateFromProps(props, state) {
    const { viewProxy, id, subclass, data } = props;
    if (subclass) {
      return { ...state, data };
    } else if (id && !state.userAction) {
      return { ...state, data: viewProxy.get()[id] };
    } else {
      return { ...state, userAction: false };
    }
  }

  componentDidMount() {
    const { opts, onReLoad, onLoad } = this.props;
    this.pullToRefresh = new PullToRefresh({
      target: this.getRef("list"),
      onReLoad, onLoad,
      ...opts
    });
  }

  componentDidUpdate(/*prevProps, prevState, snapshot*/) {
    const { opts: { canDown, canUp } } = this.props;
    this.pullToRefresh.canDown(canDown);
    this.pullToRefresh.canUp(canUp);
  }

  componentWillUnmount() {
    this.pullToRefresh.destroy();
  }

  onClick = (e) => {
    const { onClick } = this.props;
    typeof onClick == "function" && onClick({ ...e, data: this.state.data[e.target.dataset.index] });
  };

  render() {
    const { itemRender } = this.props;
    return <div>
      <div ref={this.setRef("list")} className="m7-list" onClick={this.onClick}>
        <div>
          {
            this.state.data.map((d, i) => itemRender(d, i))
          }
        </div>
      </div>
    </div>;
  }
}

List.propTypes = {
  ...List.propTypes,
  itemRender: PropTypes.func.isRequired,
  opts: PropTypes.object, // 上拉下拉配置
  onReLoad: PropTypes.func, // 顶部下拉，触发重置刷新
  onLoad: PropTypes.func, // 底部上推，触发加载更多
  onClick: PropTypes.func, // 点击事件
};