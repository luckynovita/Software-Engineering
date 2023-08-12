import React, { Component } from 'react';
import GraphPage from './GraphPage';
import PieChart from '../Components/PieChart';
import { getRecentLargestEdits } from '../Backend/APIWrapper';
import FeedData from '../Backend/FeedData';
import axios from 'axios';

export const LargestRecentEditsSettings = {
  getData: async() => {
    let id = "Q13442814"
    if (localStorage.getItem("idSearch") != null){
      id = localStorage.getItem("idSearch")
    }
    const data = await getRecentLargestEdits();
    data.forEach(item => {
      item.value = Math.abs(item.newlen - item.oldlen);
      item.id = item.revid.toString();
      item.label = item.title;
    });
    return data;
  },
  refreshTime: 2000,
  refreshMethod: async() => {
    let id = "Q13442814"
    if (localStorage.getItem("idSearch") != null) {
      id = localStorage.getItem("idSearch")
    }
    const data = await getRecentLargestEdits(id);
    data.forEach(item => {
      item.value = Math.abs(item.newlen - item.oldlen);
      item.id = item.revid.toString();
      item.label = item.title;
    });
    return data;
  },
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
      counter: 0,
      paused: false,
      feedData: new FeedData(30),
      idSearch: "",
      label: "",
      recentSettings: LargestRecentEditsSettings,
    };
  }

  handlePause = event => {
    const paused = this.state.paused;
    this.setState({ paused: !paused });
  };

  async bandingQID(qid){
    const wdk = require('wikidata-sdk')
    const searchqid = this.state.idSearch ? this.state.idSearch.toString() : "Q13442814" // id yang ditentukan (artikel ilmiah)
    const sparql = `
        ASK { wd:${qid} wdt:P31 wd:${searchqid} . }
    `
    const [url, body] = wdk.sparqlQuery(sparql).split('?')
    const { data } = await axios.post(url, body); 
    // console.log('getDescription',data);
    // ketika memangging sparql nilainya dimasukan ke variabel data
  
    return data.boolean;
  }
  async getLabel (qid) {
    const wdk = require('wikidata-sdk')
    const sparql = `
      SELECT  *
      WHERE {
              wd:${qid} rdfs:label ?label .
              FILTER (langMatches( lang(?label), "EN" ) )
            } 
      LIMIT 1
    `
    const [url, body] = wdk.sparqlQuery(sparql).split('?')
    const { data } = await axios.post(url, body) 

    if(qid && qid.trim() !== ""){
      return data.results.bindings[0]?.label?.value
    }
  
    return ""
  }
  componentDidMount(){
    setInterval(() => {
      this.setState({
        counter: this.state.counter + 1
      })
    }, 2000);
  }
  componentDidUpdate(prevProps, prevState, snapshot){
    if (this.state.idSearch != prevState.idSearch) {
      this.getLabel(this.state.idSearch).then(res => {
        this.setState({
          label: res
        })
      })
    }
    if (this.state.counter != prevState.counter) {
      this.state.feedData.refresh()
      this.state.feedData.changes.forEach(item => {
        this.bandingQID(item?.title).then(res => {
          item.banding = res
        })
      });
      const recentChanges = this.state.feedData.changes.filter((item) => item.banding)
      // this.state.recentSettings.getData().then(res => {
      //   console.log(res);
      // })
      this.state.recentSettings.getData = async () => {
        recentChanges.forEach(item => {
          item.value = Math.abs(item.newlen - item.oldlen)
          item.id = item.revid.toString()
          item.label = item.title
        });
        return recentChanges
      }
    }
  }

  render() {
    return (
      <GraphPage
        handlePause={this.handlePause}
        paused={this.state.paused}
        explanation={
          <div>
            <form className='search text-center p-2'>
              <label htmlFor="" type="text">
                <input type="search" id="search" className='input' name="search"  placeholder=' Item ID..'
                onChange={(e) => this.setState({idSearch: e.target.value})}
                />
              <h5 className='text-blue text-left'>
              {this.state.label}
              </h5>
              </label>
            </form>
            {' The largest of the last 500 edits. The number in each of the sections represents the size of the edit in bytes.'}
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
            settings={this.state.recentSettings}
            paused={this.state.paused}
          />
        }
        name="Largest Recent Edits"
      />
    );
  }
}
export default LargestRecentEdits;
