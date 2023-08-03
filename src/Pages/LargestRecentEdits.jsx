import React, { Component } from 'react';
import GraphPage from './GraphPage';
import PieChart from '../Components/PieChart';
import { getRecentLargestEdits } from '../Backend/APIWrapper';

export const LargestRecentEditsSettings = {
  getData: getRecentLargestEdits,
  refreshTime: 2000,
  refreshMethod: getRecentLargestEdits,
  colorBy: 'type',
  colors: 'set2',
  onClick: function(click) {
    window.open('https://www.wikidata.org/wiki/' + click.label, '_blank');
  },
  tooltip: function(click) {
    return this.tooltip(click, 'https://www.wikidata.org/wiki/');
  },
};

class LargestRecentEdits extends Component {
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
        explanation={
          <div>
            {' Yang terbesar dari 500 suntingan terakhir. Angka di setiap bagian menunjukkan ukuran suntingan dalam byte.' +
              ' Arahkan kursor ke bagian untuk melihat pratinjau halaman, atau klik untuk membuka halaman di tab baru.'}
            <p>
              <img
                className="legend"
                src={require('../legend.svg')}
                alt="Legend"
              />
            </p>
          </div>
        }
        graph={
          <PieChart
            fullGraph={true}
            settings={LargestRecentEditsSettings}
            paused={this.state.paused}
          />
        }
        name="Suntingan Terbaru Terbesar"
      />
    );
  }
}
export default LargestRecentEdits;
