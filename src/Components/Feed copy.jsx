import React, { useState, useEffect } from 'react';
import FeedData from '../Backend/FeedData';
import Navbar from '../Components/Navbar';
// eslint-disable-next-line
import style from '../style.css'


//Creates the feed shown on the dashboard, it updates in real time and highlights suspicious changes in red
import axios from 'axios';

// fungsi mengambil label dari butir data
async function getLabel (qid) {
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

  // ketika memangging sparql nilainya dimasukan ke variabel data
  
  // return console.log(data.results.bindings[0].label.value);

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
  const sparql = `
    ASK { wd:${qid} wdt:P31 wd:Q13442814 . }
  `
  const [url, body] = wdk.sparqlQuery(sparql).split('?')
  const { data } = await axios.post(url, body) 
  // console.log('getDescription',data);
  // ketika memangging sparql nilainya dimasukan ke variabel data

  return data.boolean;
  // return data.results.bindings[0]?.itemDescription?.value
}

function Feed() {
  const [feedData] = useState(new FeedData(30));
  const [isPaused, setPaused] = useState(false);
  const [recentChanges, setRecentChanges] = useState({
    items: [],
  });

  useEffect(() => {
    const refresh = 
      setInterval(() => {
        if (isPaused === false) {
          feedData.refresh();
        }
        feedData.changes.forEach(item => {
          // buat nampilin si title yang dimana title adalah QID
          // console.log(item.title);

          // Buat bandingkan Qid/item.title dengan Qid yang ditentukan 
          bandingQID(item.title).then(res => {
            // res adalah hasil dari perbandingan tersebut
            
            // res tadi yakni hasil dari perbandingan tadi dimasukan kedalam variabel item.banding
            item.banding = res
            // item.banding bernilai true atau false
            // console.log(item.banding);
          }) 

          // item.banding adalah hasil pengecekan qid yang tampil di bandingkan dengan qid yang ditentukan
          // if (item.banding === false ) {
          // } else if (item.banding == null) {
          // } else {
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
  }, [feedData, isPaused]);

  function togglePause(){
    setPaused(isPaused => !isPaused);
  }
  // nampilin value bandingQID
  return (
    <div>
      <h3 className="text-blue text-left"> Aktivitas Terbaru</h3>
      <button onClick={togglePause}>
        {isPaused ? "Mulai" : "Jeda"}
      </button>
    
      <ul className="list-group">
        {recentChanges.items.map((item, index) => {
          // if (item.banding === false ) {
          // } else if (item.banding == null) {
          // } else { 
          //     if (item.label != null) {
          //       if (item.description != null) {
          //         return (
          //           <li className="list-group-item text-left" key={index}>
          //             <div
          //               className={
          //                 item.scores?.damaging?.score?.prediction ? 'text-red' : ''
          //               }
          //             >
          //               {`Pengguna ${item.user} aksi ${item.type} pada ${getTimeDifference(item.timestamp)} detik yang lalu`}
          //               <br />
          //               {'\nQid = '} {item.title}
                        
          //               {item.label && (
          //                 <>
          //                   <br /> 
          //                   Judul = {item.label}
          //                 </>
          //               )}
          //               {item.description &&  (
          //                 <>
          //                   <br />
          //                   Deskripsi = {item.description}
          //                 </>
          //               )}
          //             </div>
          //           </li>
          //         )
          //       }
          //     }
          //   }
          // console.log(item.banding);
          if (item.banding && item.label && item.description) {
            return (
              <li className="list-group-item text-left" key={index}>
                <div
                  className={
                    item.scores?.damaging?.score?.prediction ? 'text-red' : ''
                  }
                >
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
    Math.abs(new Date().getTime() - new Date(toCompare).getTime()) / 1000
  );

export default Feed;
