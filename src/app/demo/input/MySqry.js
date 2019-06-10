/**
 * Created by XLBerry on 2019/6/6
 */
import React from "react";
import PropTypes from "prop-types";
import M7 from "m7";

export default class MySqry extends React.Component {

  /** 添加随迁人员 */
  handleAddSqry = () => {
    this.props.data.push({});
    this.setState({});
  };

  handleChange = ({ id, type, data }) => {
    let ids = id.split("-");
    console.log("handleChange", `类型[${type}]，id[${id}]，data`, data);
    if (type === "input") {
      this.props.data[~~ids[0]][ids[1]] = data;
    }
  };

  handleDel = (e) => {
    this.props.data.splice(e.target.dataset.index, 1, null);
    this.setState({});
  };

  renderSqrys = () => {
    return <div>
      <div style={{ display: `${this.props.data.length > 0 ? "block" : "none"}` }}>
        {
          (this.props.data || []).map((sqry, i) => {
            if (sqry) {
              return <div key={i}>
                <div className="m7-cells__title">随迁人员信息[{i+1}]</div>
                <div className="m7-cells">
                  <M7.Input id={`${i}-xm`} title="姓名" placeholder="请输入姓名" onChange={this.handleChange} value={sqry.xm}
                            rules={[{ type: "required", message: "请输入姓名" }, { type: "cnName", message: "请输入正确姓名" }]}/>
                  <M7.Input id={`${i}-gmsfhm`} title="公民身份号码" placeholder="请输入公民身份号码" onChange={this.handleChange} value={sqry.gmsfhm}
                            rules={[{ type: "required", message: "请输入公民身份号码" }]}/>
                  <M7.Selector id={`${i}-yzqrgx`} type="dict" title="与主迁入关系" placeholder="请选择与主迁入关系" onChange={this.handleChange}/>
                  <div className="m7-cell">
                    <div style={{ flex: 1, textAlign: "center", color: "red" }} data-index={i} onClick={this.handleDel}>删除</div>
                  </div>
                </div>
              </div>;
            } else {
              return null;
            }
          })
        }
      </div>
      <div className="m7-cells" style={{ display: `${this.props.data.length >= 8 ? "none" : "block"}` }}>
        <div className="m7-cell" onClick={this.handleAddSqry}>+ 添加随迁人员</div>
      </div>
    </div>;
  };

  render() {
    return <div>{this.renderSqrys()}</div>;
  }
}

MySqry.defaultProps = {
  ...MySqry.defaultProps,
  max: 8,
};

MySqry.protoType = {
  ...MySqry.protoType,
  data: PropTypes.array, // 列表数据
  max: PropTypes.number, // 最大数
};