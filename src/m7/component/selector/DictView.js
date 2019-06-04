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
    checkedData: [].concat(this.props.data)
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
    if (dataset.checked === "1") {
      // 取消选择
      let idx = this.state.checkedData.findIndex((item) => item.code === data.code);
      this.state.checkedData.splice(idx, 1);
    } else {
      // 确认选择
      if (this.props.mode === "single") {
        this.state.checkedData.splice(0, 1, data); // 单选
      } else {
        this.state.checkedData.push(data); // 多选
      }
    }
    await this.setState({ checkedData: this.state.checkedData });
    this.props.onChange(this.state.checkedData);
    this.itemClickLock = false; // 解锁快速点击
  };

  /** 重置列表 */
  handleReLoad = async () => {
    await this.setState({ searchDisabled: true });
    const { dataFor: { onReLoad } } = this.props;
    let { total = 0, list = [] } = await onReLoad({ filter: this.state.searchText, from: 0 });  // 这里限制载入返回数据key格式
    this.canUp = list.length < total;
    await this.setState({ total, searchDisabled: false, dictData: list });
  };

  /** 加载更多 */
  handleLoad = async () => {
    await this.setState({ searchDisabled: true });
    const { dataFor: { onLoad } } = this.props, from = this.state.dictData.length;
    let { total = 0, list = [] } = await onLoad({ filter: null, from, total: this.state.total }); // 这里限制载入返回数据key格式
    this.canUp = from + list.length < total;
    await this.setState({ total, searchDisabled: false, dictData: this.state.dictData.concat(list) });
  };

  handleSearch = async ({ data }) => {
    await this.setState({ searchText: data });
    this.getRef("dictList").pullToRefresh.toLoad(true);
    await this.handleReLoad();
    this.getRef("dictList").pullToRefresh && this.getRef("dictList").pullToRefresh.toLoad(false);
  };

  render() {
    const { searchable, dataFor: { onReLoad, onLoad } } = this.props;
    const listCls = `m7-dict__bd__list${searchable ? "--search" : ""}`;
    const canDown = typeof onReLoad === "function", canUp = this.canUp && typeof onLoad === "function";
    return <div>
      {searchable ? <Search disabled={this.state.searchDisabled} onChange={this.handleSearch}/> : null}
      <div className={listCls}>
        <List ref={this.setRef("dictList")} itemRender={this.itemRender} onReLoad={this.handleReLoad}
              onLoad={this.handleLoad} onClick={this.handleItemClick}
              subclass data={this.state.dictData} opts={{ scrollNodeCls: listCls, canDown, canUp }}/>
      </div>
    </div>;
  }
}