import React, { useState, useEffect } from 'react';
import FeedData from '../Backend/FeedData';
import Search from './Search';
import Navbar from '../Components/Navbar';
// eslint-disable-next-line
import style from '../style.css'


//Creates the feed shown on the dashboard, it updates in real time and highlights suspicious changes in red
import axios from 'axios';
import { useMemo } from 'react';

function Feed() {
  const [feedData] = useState(new FeedData(30));
  const [paused, setPaused] = useState(false);
  const [idSearch, setIDSearch] = useState("")
  const [label, setLabel] = useState("")
  const [recentChanges, setRecentChanges] = useState({
    items: [],
  });

// fungsi mengambil label dari butir data
async function getLabel (qid) {
  const wdk = require('wikidata-sdk')
  const searchLabelqid = idSearch ? idSearch.toString() : qid
  const sparql = `
    SELECT  *
    WHERE {
            wd:${searchLabelqid} rdfs:label ?label .
            FILTER (langMatches( lang(?label), "EN" ) )
          } 
    LIMIT 1
  `
  const [url, body] = wdk.sparqlQuery(sparql).split('?')
  const { data } = await axios.post(url, body) 

  // ketika memangging sparql nilainya dimasukan ke variabel data
  
  //  console.log(data.results.bindings[0].label.value);

  if(idSearch && idSearch.trim() !== ""){
    setLabel(data.results.bindings[0]?.label?.value)
  }

  return data.results.bindings[0]?.label?.value
}

// fungsi mengambil deskripsi dari butir data
async function getDescription(qid) {
  const wdk = require('wikidata-sdk')
  const sparql = `
  SELECT ?itemLabel ?itemDescription 
  WHERE  { VALUES ?item {wd:${qid}}   
  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". } }
  `
  const [url, body] = wdk.sparqlQuery(sparql).split('?')
  const { data } = await axios.post(url, body) 

  return data.results.bindings[0]?.itemDescription?.value
}


// fungsi membandingkan id yang diedit pengguna dengan id yang ditentukan (filter kategori)
async function bandingQID(qid) {
  const wdk = require('wikidata-sdk')
  const searchqid = idSearch ? idSearch.toString() : "Q13442814" // id yang ditentukan (artikel ilmiah)
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


  useEffect(() => {
    localStorage.setItem("idSearch", idSearch)
    if (idSearch == ""){
      setLabel("")
    }
    const refresh = 
      setInterval(() => {
        if (!paused) {
          feedData.refresh();
        }
        feedData.changes.forEach(item => {
          // Buat bandingkan Qid/item.title dengan Qid yang ditentukan 
          bandingQID(item.title).then(res => {
            // res adalah hasil dari perbandingan tersebut
            // console.log(item)
            // res tadi yakni hasil dari perbandingan tadi dimasukan kedalam variabel item.banding
            item.banding = res
            // item.banding bernilai true atau false
            // console.log(item.banding);
          }) 

            getLabel(item.title).then(res => {
              item.label = res

              // console.log(item.label)
              // label = res
            })
            getDescription(item.title).then(res => {
              item.description = res
              // console.log(item.description);
              // description = res
            })
           
          // }
        });
        setRecentChanges({ items: feedData.changes.filter((item) => item.banding && item.label && item.description) });
      }, 1000);
    return () => clearInterval(refresh);
  }, [feedData, paused, idSearch, label]);

  function togglePause(){
    setPaused(prevPause => !prevPause);
  }

  const renderLabel = useMemo(() => (
    <h5 className='text-blue text-left'>{label}</h5>
  ), [label]);

  // nampilin value bandingQID yang ada di feed dan dashboard sebelah kiri
  return (
    <div>
      <h3 className="text-blue text-left"> Aktivitas Terbaru</h3>
      <form className='search text-left p-2'>
        <label htmlFor="" type="text">
        <input type="search" id="search" className='input' name="search" value={idSearch} onChange={(e) => setIDSearch(e.target.value)} placeholder='Cari Item ID..'/>
        {renderLabel} 
        {/* <h6 className='text-blue text-left'>{label}</h6> */}
        </label>
      </form>
      <form className="text-left p-1" onChange={togglePause}>
        <label>
          <input type="checkbox" /> Jeda
        </label> 
      </form>
      
      <ul className="list-group">
        {recentChanges.items.map((item, index) => {
          if (item.banding && item.label && item.description) {
            return (
              <li className="list-group-item text-left" key={index}>
                <div
                  className={
                    item.scores?.damaging?.score?.prediction ? 'text-red' : ''
                  }>
                  {`Pengguna ${item.user} aksi ${item.type} pada ${getTimeDifference(item.timestamp)} detik yang lalu`}
                  <br />
                  {'\nQid = '} {item.title}
                  <br /> 
                  Judul = {item.label}
                  <br />
                  Deskripsi = {item.description}
                 
                </div>
              </li>
            )
          }
          }
        )
        }
      </ul>
    </div>
  );
}

const getTimeDifference = toCompare =>
  Math.round(
    Math.abs(new Date().getTime() - new Date(toCompare).getTime()) / 500
  );

export default Feed;
