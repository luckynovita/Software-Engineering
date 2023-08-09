import React, { Component } from 'react';
import GraphPage from './GraphPage';
import SimpleBarGraph from '../Components/SimpleBarGraph';
import { getMostActivePages } from '../Backend/APIWrapper';
import axios from 'axios';

export const MostActivePagesGraphSettings = {
  getData: async function() {
    let qid = "Q13442814"
    if (localStorage.getItem("idSearch") != null) {
      qid = localStorage.getItem("idSearch")
    }
    let [data, newTimestamp] = await getMostActivePages(
      new Date().toISOString(), qid
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

class MostActivePages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      history: this.props.history,
      paused: false,
      idSearch: '',
      label: "",
      fullData: [],
      prevTimestamp: new Date().toISOString(),
      counter: 0,
      graphSettings: MostActivePagesGraphSettings
    };
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

  handlePause = event => {
    const paused = this.state.paused;
    this.setState({ paused: !paused });
  };
  componentDidMount(){
    setInterval(() => {
      this.setState({
        counter: this.state.counter + 1
      })
    }, 2000);
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
    if (this.state.counter != prevState.counter) {
      this.state.graphSettings.getData = async() => {
        let qid = this.state.idSearch ? this.state.idSearch.toString() : "Q13442814"
        
        let [data, newTimestamp] = await getMostActivePages(
          new Date().toISOString(), qid
        );

        data = data.slice(0, 50);
        this.setState({
          fullData: data,
          prevTimestamp: newTimestamp,
        });
        return data;
      }

      this.state.graphSettings.refreshMethod = async () => {
        let qid = this.state.idSearch ? this.state.idSearch.toString() : "Q13442814"
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
            {
            ' Tampilan langsung dari halaman yang sedang diedit sekarang. Grafik menunjukkan halaman yang diedit sejak halaman ini dimuat.' 
            }
          </div>
        }
        graph={
          <SimpleBarGraph
            fullGraph={true}
            settings={this.state.graphSettings}
            paused={this.state.paused}
          />
        }
        name="Halaman Paling Aktif"
      />
    );
  }
}
export default MostActivePages;
