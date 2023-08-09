import React, { Component, useState } from 'react';
import GraphPage from './GraphPage';
import PieChart from '../Components/PieChart';
import { getRecentEditsWithSize } from '../Backend/APIWrapper';
import FeedData from '../Backend/FeedData';
import axios from 'axios';

export const RecentEditSizeSettings = {
  getData: async () => {
    let id = "Q13442814"
    if (localStorage.getItem("idSearch") != null) {
      id = localStorage.getItem("idSearch")
    }
    const data = await getRecentEditsWithSize(id);
    data.forEach(item => {
      item.id = item.revid.toString();
      item.value = Math.abs(item.newlen - item.oldlen);
      item.label = item.title;
    });
    return data;
  },
  // kenapa double kek yg diatas?
  refreshTime: 2000,
  refreshMethod: async () => {
    let id = "Q13442814"
    if (localStorage.getItem("idSearch") != null) {
      id = localStorage.getItem("idSearch")
    }
    const data = await getRecentEditsWithSize(id);
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
      feedData: new FeedData(30),
      idSearch: "",
      counter: 0,
      recentChanges: [],
      label: "",
      recentSettings: RecentEditSizeSettings
    };
  }

  handlePause = event => {
    const paused = this.state.paused;
    this.setState({ paused: !paused });
  };
  async bandingQID(qid) {
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
    // return data.results.bindings[0]?.itemDescription?.value
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
  componentDidUpdate(prevProps, prevState, snapshot) {
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
      this.state.recentSettings.getData = async () => {
        recentChanges.forEach(item => {
          item.id = item.revid.toString()
          item.value = Math.abs(item.newlen - item.oldlen)
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
                <input type="search" id="search" className='input' name="search"  placeholder='Cari Item ID..'
                onChange={(e) => this.setState({idSearch: e.target.value})}
                />
              <h5 className='text-blue text-left'>
              {this.state.label}
              </h5>
              </label>
            </form>
            {'30 suntingan terakhir. Angka di setiap bagian mewakili ukuran suntingan dalam byte.'}
            
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
        name="Jumlah Edit Terbaru"
      />
    );
  }
}
export default RecentEditSize;
