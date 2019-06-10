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

  async componentDidMount() {
    await this.setState({ lisContent: this.handleCategory() });
  }

  handleCategory = () => {
    const lisContent = [];
    category["forEach"]((c, i) => {
      let cateOnClick = (e) => {
        let parentNode = e.target.parentNode;
        let cls = parentNode.getAttribute("class") || "";
        if (cls === "page-section-category-inner-show") {
          this.setState({ lastShowIndex: -1 });
          parentNode.removeAttribute("class");
        } else {
          this.setState({ lastShowIndex: i });
          parentNode.setAttribute("class", "page-section-category-inner-show");
        }
        e.stopPropagation();
        this.handleCategory();
      };
      lisContent.push(<li key={i} style={{ marginBottom: "10px", backgroundColor: "#ffffff", overflow: "hidden" }}
                          className={this.state.lastShowIndex === i ? "page-section-category-inner-show" : ""}>
        <div className="page-section-category" onClick={cateOnClick}>
          <p className="page-section-category-title">{c.title}</p>
          <img className="page-section-category-icon" src={c.src} alt=""/>
        </div>
        <div className="page-section-category-inner">
          <div className="page-section-category-inner-content">
            {
              c.sons.map((s, j) => {
                let sOnClick = () => {
                  // M7.navigateTo({ outer: s.outer, url: s.url, state: { index: j } });
                  this.props.history["push"]({ pathname: s.url });
                };
                return (<a key={`${i}-${j}`} className="page-section-category-inner-a" onClick={sOnClick}>
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
          <li style={{ paddingBottom: "3px" }}>简化Component State Flux数据流<label style={{ color: "#aaaaaa" }}>*</label></li>
          <li>细节优化，如请求列队，事件优化等</li>
          <li>推荐ES2015+ Async Functions编码模式</li>
        </ul>
      }/>
      <div style={{ padding: "0 15px" }}>
        <ul style={{ listStyle: "none" }}>
          {this.state.lisContent}
        </ul>
      </div>
    </div>;
  }
}