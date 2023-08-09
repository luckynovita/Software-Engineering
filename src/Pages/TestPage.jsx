import React, { Component } from 'react';
import Navbar from '../Components/Navbar';
import GraphCard from '../Components/GraphCard';
import FeedData from '../Components/Feed';
import CardDeck from 'react-bootstrap/CardDeck';
import 'bootstrap/dist/css/bootstrap.min.css';
import SimpleBarGraph from '../Components/SimpleBarGraph';
import PieChart from '../Components/PieChart';
import { MostActiveUsersGraphSettings } from './MostActiveUsers';
import { MostActivePagesGraphSettings } from './MostActivePages';
import { LargestRecentEditsSettings } from './LargestRecentEdits';
import { RecentEditSizeSettings } from './RecentEditSize';
import { ProportionFlaggedSettings } from './ProportionFlagged';

//This is the dashboard page, it shows the feed and all of our graphs

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
                  title="Jumlah Edit Terbaru"
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
                  title="Halaman Paling Aktif"
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
                  title="Pengguna Paling Aktif"
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
                  title="Suntingan Terbaru Terbesar"
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
