import React, { Component } from 'react';
import Navbar from '../Components/Navbar';
import GraphCard from '../Components/GraphCard';
import FeedData from '../Components/Feed';
import CardDeck from 'react-bootstrap/CardDeck';
import 'bootstrap/dist/css/bootstrap.min.css';
import SimpleBarGraph from '../Components/SimpleBarGraph';
import PieChart from '../Components/PieChart';
import { MostActiveUsersGraphSettings } from './MostActiveUsers';
// import { MostActivePagesGraphSettings } from './MostActivePages';
import { LargestRecentEditsSettings } from './LargestRecentEdits';
import { RecentEditSizeSettings } from './RecentEditSize';
import { ProportionFlaggedSettings } from './ProportionFlagged';
import { getMostActivePages } from '../Backend/APIWrapper';

//This is the dashboard page, it shows the feed and all of our graphs
const MostActivePagesGraphSettings = {
  getData: async function() {
    let qid = "Q13442814"
    if (localStorage.getItem("idSearch") != null) {
      qid = localStorage.getItem("idSearch")
    }
    let [data, newTimestamp] = await getMostActivePages(
      new Date().toISOString()
    );
    data = data.slice(0, 50);
    this.setState({
      fullData: data,
      prevTimestamp: newTimestamp,
    });
    return data;
  },
  refreshTime: 2000,
  refreshMethod: async function() {
    let qid = "Q13442814"
    if (localStorage.getItem("idSearch") != null) {
      qid = localStorage.getItem("idSearch")
    }
    let [data, newTimestamp] = await getMostActivePages(
      this.state.prevTimestamp, qid
    );
    this.setState({ prevTimestamp: newTimestamp });
    data = data.slice(0, 50);
    if (this.state.fullData) {
      const fullData = this.state.fullData;
      data.forEach(pageAdditions => {
        let index = -1;
        for (let i = 0; i < fullData.length; i += 1) {
          if (fullData[i].id === pageAdditions.id) {
            index = i;
          }
        }
        if (index !== -1) {
          fullData[index].actions += pageAdditions.actions;
        } else {
          fullData.push(pageAdditions);
        }
      });
      fullData.sort((a, b) => b.actions - a.actions);
      fullData.slice(0, 50);
      const smlData = fullData.slice(0, this.state.fullGraph ? 30 : 10);

      this.setState({ fullData: fullData, data: smlData });
    } else {
      const smlData = data.slice(0, this.state.fullGraph ? 30 : 10);

      this.setState({ data: smlData });
    }
  },
  keys: ['actions'],
  index: 'id',
  xAxis: 'pages',
  yAxis: 'actions',
  colors: 'pastel1',
  onClick: function(click) {
    window.open('https://www.wikidata.org/wiki/' + click.indexValue, '_blank');
  },
  tooltip: function(click) {
    return this.tooltip(click, 'https://www.wikidata.org/wiki/');
  },
};

class HomePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      history: this.props.history
    };
  }

  render() {
    return (
      <div className="HomePage">
        <Navbar />
        <div className="row justify-content-left text-dark">
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-4">
            <div className="feedContainer">
              <FeedData />
            </div>
          </div>
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8">
            <div className="deck-container">
              <CardDeck className="deck">
                <GraphCard
                  title="Recent Edit Size"
                  pageLink="recent-edit-size"
                  history={this.state.history}
                  graph={
                    <PieChart
                      paused={true}
                      fullGraph={false}
                      settings={RecentEditSizeSettings}
                    />
                  }
                />
              </CardDeck>
              
              <CardDeck className="deck">
                <GraphCard
                  title="Most Active Pages"
                  pageLink="most-active-pages"
                  history={this.state.history}
                  graph={
                    <SimpleBarGraph
                      paused={false}
                      fullGraph={false}
                      settings={MostActivePagesGraphSettings}
                    />
                  }
                />
              </CardDeck>

              <CardDeck className='deck'>
              <GraphCard
                  title="Most Active Users"
                  pageLink="most-active-users"
                  history={this.state.history}
                  graph={
                    <SimpleBarGraph
                      paused={false}
                      fullGraph={false}
                      settings={MostActiveUsersGraphSettings}
                    />
                  }
                />
              </CardDeck>
              
              <CardDeck className="deck">
                <GraphCard
                  title="Largest Recent Edits"
                  pageLink="largest-recent-edits"
                  history={this.state.history}
                  graph={
                    <PieChart
                      paused={true}
                      fullGraph={false}
                      settings={LargestRecentEditsSettings}
                    />
                  }
                />
                <GraphCard
                  title={ProportionFlaggedSettings.name}
                  pageLink="proportion-flagged"
                  history={this.state.history}
                  graph={
                    <PieChart
                      paused={false}
                      fullGraph={false}
                      settings={ProportionFlaggedSettings}
                    />
                  }
                />
              </CardDeck>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default HomePage;
