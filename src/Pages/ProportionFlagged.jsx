import React, { Component } from 'react';
import GraphPage from './GraphPage';
import PieChart from '../Components/PieChart';
import { getRecentEditsWithFlags } from '../Backend/APIWrapper';
import axios from 'axios';

export const ProportionFlaggedSettings = {
  getData: async () => {
    let id = "Q13442814"
    if (localStorage.getItem("idSearch") != null) {
      id = localStorage.getItem("idSearch")
    }
    const data= await getRecentEditsWithFlags(
      new Date().toISOString()
    );
    console.log(data);
    return data;
  },
  refreshTime: 2000,
  refreshMethod: async () => {
    let id = "Q13442814"
    if (localStorage.getItem("idSearch") != null) {
      id = localStorage.getItem("idSearch")
    }
    const data= await getRecentEditsWithFlags(
      new Date().toISOString()
    );
    // console.log(data);
    return data;
  },
  colorFunction: d => d.color,
  name: 'Proportion Of Edits Flagged',
};

class ProportionFlagged extends Component {
  constructor(props) {
    super(props);
    this.state = {
      history: this.props.history,
      paused: false,
      idSearch: '',
      label: "",
    };
  }

  handlePause = event => {
    const paused = this.state.paused;
    this.setState({ paused: !paused });
  };

  async getLabel(qid) {
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

    if (qid && qid.trim() !== "") {
      return data.results.bindings[0]?.label?.value
    }

    return ""
  }
  componentDidMount() {
    if (localStorage.getItem("idSearch")) {
      localStorage.removeItem("idSearch")
    }
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.state.idSearch != prevState.idSearch) {
      localStorage.setItem("idSearch", this.state.idSearch)

      this.getLabel(this.state.idSearch).then(res => {
        this.setState({
          label: res
        })
      })
    }
    if (this.state.idSearch == "") {
      localStorage.removeItem("idSearch")
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
                <input type="search" id="search" className='input' name="search" placeholder=' Item ID..'
                  onChange={(e) => this.setState({ idSearch: e.target.value })}
                />
                <h5 className='text-blue text-left'>
                  {this.state.label}
                </h5>
              </label>
            </form>
            {
              ' The proportion of the last 50 edits that was flagged as potentially damaging. '
            }
          </div>
        }
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
