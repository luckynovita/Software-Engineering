import React, { Component } from 'react';
import GraphPage from './GraphPage';
import PieChart from '../Components/PieChart';
import { getRecentEditsWithSize } from '../Backend/APIWrapper';

export const RecentEditSizeSettings = {
  getData: async () => {
    const data = await getRecentEditsWithSize();
    data.forEach(item => {
      item.id = item.revid.toString();
      item.value = Math.abs(item.newlen - item.oldlen);
      item.label = item.title;
    });
    return data;
  },
  refreshTime: 2000,
  refreshMethod: async () => {
    const data = await getRecentEditsWithSize();
    data.forEach(item => {
      item.value = Math.abs(item.newlen - item.oldlen);
      item.id = item.revid.toString();
      item.label = item.title;
    });
    return data;
  },
  colorBy: 'type',
  colors: 'set1',
  onClick: function(click) {
    window.open('https://www.wikidata.org/wiki/' + click.label, '_blank');
  },
  tooltip: function(click) {
    return this.tooltip(click, 'https://www.wikidata.org/wiki/');
  },
};

class RecentEditSize extends Component {
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
            {'30 suntingan terakhir. Angka di setiap bagian mewakili ukuran suntingan dalam byte.' +
              ' Arahkan kursor ke bagian untuk mendapatkan pratinjau halaman, atau klik untuk membuka halaman di tab baru.'}
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
            settings={RecentEditSizeSettings}
            paused={this.state.paused}
          />
        }
        name="Jumlah Edit Terbaru"
      />
    );
  }
}
export default RecentEditSize;
