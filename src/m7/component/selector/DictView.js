/**
 * Created by XLBerry on 2019/5/21
 */
import React from "react";
import create from "../../hoc/WrapComponent";
import Search from "../form/Search";
import List from "../list/List";

@create({ type: "element-view" })
export default class DictView extends React.Component {
  state = {
    searchDisabled: true, // 设置搜索框是否可搜索
    dictData: [],
    currentLabel: [].concat(this.props.dataLabel[this.props.dataLabel.length - 1] || []), // 当前选中的多标签模式下标签集
    checkedLabel: [].concat(this.props.dataLabel), // 多标签模式选中的下标签集
    checkedData: [].concat(this.props.data),
  };
  itemClickLock = false; // 点击标记，防止过度刷新
  canUp = true; // 即时控制是否加载更多

  async componentDidMount() {
    return this.handleSearch({ data: null });
  }

  itemRender = (itemData, index) => {
    const { code, detail } = itemData,
      checked = this.state.checkedData.some(({ code: checkedCode }) => code === checkedCode);
    return <div key={code} className="m7-cell m7-dict__bd__list__item" data-index={index} data-checked={~~checked}>
      <div className="m7-cell__bd m7-pointer-events--none">{detail}</div>
      <div className="m7-cell__ft">
        <span className={`weui-icon-checked${checked ? " m7-dict__bd__list__item--checked" : ""}`}/>
      </div>
    </div>;
  };

  /** 列表点击 */
  handleItemClick = async ({ /*target,*/ dataset, data }) => {
    if (this.itemClickLock) return;
    this.itemClickLock = true;
    if (this.props.cascade) {
      // 级联字典模式
      let nFlag = this.props.dataFor.hasNext(data), toNext;
      if (nFlag instanceof Promise) {
        toNext = await nFlag;
      } else {
        toNext = nFlag;
      }
      if (toNext) {
        // 存在下一级
        this.state.currentLabel.push(data);
        await this.handleReLoad();
        this.itemClickLock = false; // 解锁快速点击
      } else {
        await this.handleItemCheck({ dataset, data }); // 当前级别已经是最后一级
      }
    } else {
      await this.handleItemCheck({ dataset, data });
    }
  };

  /** 列表选中逻辑处理 */
  handleItemCheck = async ({ dataset, data }) => {
    if (dataset.checked === "1") {
      // 取消选择
      let idx = this.state.checkedData.findIndex((item) => item.code === data.code);
      this.state.checkedData.splice(idx, 1);
      if (this.props.cascade) {
        this.state.checkedLabel.splice(idx, 1);
      }
    } else {
      // 确认选择
      if (!this.props.multiple) {
        this.state.checkedData.splice(0, 1, data); // 单选
        if (this.props.cascade) {
          this.state.checkedLabel.splice(0, 1, [].concat(this.state.currentLabel));
        }
      } else {
        this.state.checkedData.push(data); // 多选
        if (this.props.cascade) {
          this.state.checkedLabel.push([].concat(this.state.currentLabel));
        }
      }
    }
    await this.setState({ checkedData: this.state.checkedData });
    this.props.onChange({ checked: this.state.checkedData, checkedLabel: this.state.checkedLabel });
    this.itemClickLock = false; // 解锁快速点击
  };

  /** 重置列表 */
  handleReLoad = async () => {
    await this.setState({ searchDisabled: true, dictData: [] });
    const { dataFor: { onReLoad } } = this.props;
    let { total = 0, list = [] } = await onReLoad({
      filter: this.state.searchText, from: 0,
      superData: this.state.currentLabel[this.state.currentLabel.length - 1]
    });  // 这里限制载入返回数据key格式
    this.canUp = list.length < total;
    await this.setState({ total, searchDisabled: false, dictData: list });
  };

  /** 加载更多 */
  handleLoad = async () => {
    await this.setState({ searchDisabled: true });
    const { dataFor: { onLoad } } = this.props, from = this.state.dictData.length;
    let { total = 0, list = [] } = await onLoad({
      filter: null, from, total: this.state.total,
      superData: this.state.currentLabel[this.state.currentLabel.length - 1]
    }); // 这里限制载入返回数据key格式
    this.canUp = from + list.length < total;
    await this.setState({ total, searchDisabled: false, dictData: this.state.dictData.concat(list) });
  };

  /** 点击多标签 */
  handleLabelClick = async (e) => {
    if (this.itemClickLock) return;
    const labelData = JSON.parse(e.target.dataset.more || "{}");
    let total = this.state.currentLabel.length, index = total - 1;
    for (; index >= 0; index--) {
      if (this.state.currentLabel[index].code === labelData.code) {
        break;
      }
    }
    if (index === 0 || total - 1 !== index) {
      this.itemClickLock = true;
      // 触发点击的标签内容过滤查询
      if (index === 0) {
        this.state.currentLabel = [];
      } else {
        this.state.currentLabel.splice(index + 1, total - index - 1);
      }
      await this.setState({ currentLabel: this.state.currentLabel });
      await this.handleReLoad();
      this.itemClickLock = false;
    }
  };

  /** 处理搜索 */
  handleSearch = async ({ data }) => {
    await this.setState({ searchText: data });
    this.getRef("dictList").pullToRefresh.toLoad(true);
    await this.handleReLoad();
    this.getRef("dictList").pullToRefresh && this.getRef("dictList").pullToRefresh.toLoad(false);
  };

  render() {
    const { cascade, searchable, dataFor: { onReLoad, onLoad } } = this.props;
    const listCls = `m7-dict__bd__list ${cascade ? "label" : ""} ${searchable ? "search" : ""}`;
    const canDown = typeof onReLoad === "function", canUp = this.canUp && typeof onLoad === "function";
    return <div>
      {cascade ? <div className="m7-dict__label" onClick={this.handleLabelClick}>
        {this.state.currentLabel.map(({ code, detail, ...others }) => <label key={code} data-more={JSON.stringify({
          code,
          detail, ...others
        })}>{detail}</label>)}
      </div> : null}
      {searchable ? <Search disabled={this.state.searchDisabled} onChange={this.handleSearch}/> : null}
      <div className={listCls}>
        <List ref={this.setRef("dictList")} itemRender={this.itemRender} onReLoad={this.handleReLoad}
              onLoad={this.handleLoad} onClick={this.handleItemClick}
              subclass data={this.state.dictData} opts={{ scrollNodeCls: "m7-dict__bd__list", canDown, canUp }}/>
      </div>
    </div>;
  }
}