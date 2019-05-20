/**
 * Created by XLBerry on 2019/5/5
 */

import React from "react";
import M7 from "m7";

@M7.View({ namespace: "main-view2" })
export default class MainView extends React.Component {
  constructor(props) {
    super(props);
  }

  myClick = () => {
    this.props.history["go"](-1);
  };

  render() {
    return <div>
      <div>
        Use shouldComponentUpdate() to let React know if a component’s output is not affected by the current change in state or props.
        The default behavior is to re-render on every state change, and in the vast majority of cases you should rely on the default behavior.
      </div>
      <img src="image/test.jpg" onClick={this.myClick}/>
    </div>;
  }
}
