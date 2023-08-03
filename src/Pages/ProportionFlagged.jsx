import React, { Component } from 'react';
import GraphPage from './GraphPage';
import PieChart from '../Components/PieChart';
import { getRecentEditsWithFlags } from '../Backend/APIWrapper';

export const ProportionFlaggedSettings = {
  getData: getRecentEditsWithFlags,
  refreshTime: 2000,
  refreshMethod: getRecentEditsWithFlags,
  colorFunction: d => d.color,
  name: 'Proporsi suntingan yang ditandai',
};

class ProportionFlagged extends Component {
  constructor(props) {
    super(props);
    this.state = {
      history: this.props.history,
      paused: false,
    };
  }

  handlePause = event => {
    const paused = this.state.paused;
    this.setState({ paused: !paused });
  };

  render() {
    return (
      <GraphPage
        handlePause={this.handlePause}
        paused={this.state.paused}
        explanation="Proporsi dari 50 suntingan terakhir yang ditandai sebagai berpotensi merusak."
        graph={
          <PieChart
            fullGraph={true}
            settings={ProportionFlaggedSettings}
            paused={this.state.paused}
          />
        }
        name={ProportionFlaggedSettings.name}
      />
    );
  }
}
export default ProportionFlagged;
