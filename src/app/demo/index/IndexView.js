/**
 * Created by XLBerry on 2019/6/6
 */
import React from "react";
import M7 from "m7";
import Header from "../component/Header";
import "./index.less";

const category = require("./category"); // 首页菜单配置

@M7.create({ namespace: "index-view" })
export default class IndexView extends React.Component {

  state = {
    lastShowIndex: -1
  };

  async componentDidMount() {
    await this.setState({ lisContent: this.getCategory() });
  }

  /** 章节点击 */
  handleCateClick = (e) => {
    e.stopPropagation();
    let showIndex = ~~e.target.dataset.index;
    if (showIndex === this.state.lastShowIndex) {
      return false;
    }
    this.setState({ lastShowIndex: showIndex, lisContent: this.getCategory(showIndex) });
  };

  /** 获取章渲染布局 */
  getCategory = (showIndex) => {
    if (showIndex === undefined) {
      showIndex = this.state.lastShowIndex;
    }
    const lisContent = [];
    category["forEach"]((c, i) => {
      lisContent.push(<li key={i} className={`demo-section ${showIndex === i ? "demo-section--show" : ""}`}>
        <div className="demo-category" data-index={i} onClick={this.handleCateClick}>
          <p className="demo-category__title">{c.title}</p>
          <img className="demo-category__icon" src={c.src} alt=""/>
        </div>
        <div className="demo-category-item">
          <div className="demo-category-item__bd">
            {
              c.sons.map((s, j) => {
                let sOnClick = () => {
                  this.props.history["push"]({ pathname: s.url });
                };
                return (<a key={`${i}-${j}`} className="demo-category-item__bd__i" onClick={sOnClick}>
                  <p>{s.title}</p>
                  <div className={`m7-access-right`}/>
                </a>);
              })
            }
          </div>
        </div>
      </li>);
    });
    return lisContent;
  };

  render() {
    return <div>
      <Header title="M6 Lite" desc={
        <ul>
          <li style={{ paddingBottom: "3px" }}>基于WeUI交互原则设计二次开发</li>
          <li style={{ paddingBottom: "3px" }}>
            简化Component State Flux数据流<label style={{ color: "#aaaaaa" }}>*</label>
          </li>
          <li>细节优化，如请求列队，事件优化等</li>
          <li>推荐ES2015+ Async Functions编码模式</li>
        </ul>
      }/>
      <div className="demo-area">
        <ul>
          {this.state.lisContent}
        </ul>
      </div>
    </div>;
  }
}