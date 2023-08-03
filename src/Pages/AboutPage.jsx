import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from '../Components/Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

class AboutPage extends Component {
  constructor(props) {
    super(props);

    this.state = { history: this.props.history };
  }

  render() {
    return (
      <div className="aboutPageContainer">
        <Navbar history={this.state.history} />
        <div className=" text-left">
          <div className="row">
            <div className="col-lg-6 col-sm-12  aboutPageContent">
              <div className="explainContainer text-left">
                <h3 className="text-blue">Projek Wikidata Live</h3>
                <p>
                Sebuah situs web yang akan memvisualisasikan berbagai perubahan pada Wikidata secara kuasi-real-time. Pengguna yang ditargetkan adalah para peneliti dan harus memudahkan untuk mengidentifikasi spam dan suntingan yang salah atau berbahaya pada Wikidata.
                </p>
              </div>
             
              <div className=" licenseContainer text-left">
                <h3 className="text-blue">Lisensi</h3>
                <p>
                Kami telah mengasuransikan semua pustaka dan semua lisensi dependensi proyek mencakup penggunaan aplikasi web kami.
                </p>
                <p>
                  Kami telah memutuskan untuk menggunakan{' '}
                  <a href="https://opensource.org/licenses/MIT">lisensi MIT</a>{' '}
                  untuk projek ini.
                </p>
              </div>

              <div className=" licenseContainer text-left">
                <h3 className="text-green">Kontribusi</h3>
                <p>
                Kontribusi yang penulis lakukan adalah menambahkan fitur yang memfokuskan pengguna untuk fokus pada topik spesifik tertentu, dalam hal ini penulis memfokuskan pada Artikel Ilmiah yang merupakan entitas di Wikidata. Pengguna juga dapat mencari Item ID / entitas lain selain Artikel Ilmiah pada Dashbor Wikidata Live ini.
                </p>
              </div>
            </div>
            <div className="col-lg-6 col-sm-12 profiles">
              <h3 className="text-red">Mahasiswa</h3>
              <div className="card-deck  text-center">
                <div className="card card-profile">
                  <div className="card-body">
                    <h5 className="card-title text-center">
                      Brian
                      <br /> Lynch
                    </h5>
                    <p className="card-text">
                      <b>Tahun Ke-3 CS</b>
                      <br />
                      Tim Frontend
                    </p>
                    <div className="text-center">
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        className="GH aBlack"
                        href="https://github.com/brianlunch"
                      >
                        <FontAwesomeIcon icon={faGithub} />
                      </a>
                    </div>
                  </div>
                </div>
                <div className="card card-profile">
                  <div className="card-body">
                    <h5 className="card-title text-center">
                      Isobel
                      <br /> Mahon
                    </h5>
                    <p className="card-text">
                      <b>Tahun Ke-3 CS</b>
                      <br />
                      Tim Frontend
                    </p>
                    <div className="text-center">
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        className="GH aBlack"
                        href="https://github.com/isobelm"
                      >
                        <FontAwesomeIcon icon={faGithub} />
                      </a>
                    </div>
                  </div>
                </div>
                <div className="card card-profile">
                  <div className="card-body">
                    <h5 className="card-title text-center">
                      Odhran
                      <br /> Mullen
                    </h5>
                    <p className="card-text">
                      <b>Tahun Ke-3 CSB</b>
                      <br />
                      Tim Backend
                    </p>
                    <div className="text-center">
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        className="GH aBlack"
                        href="https://github.com/omullan"
                      >
                        <FontAwesomeIcon icon={faGithub} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-deck text-center">
                <div className="card card-profile">
                  <div className="card-body">
                    <h5 className="card-title text-center">
                      Alex
                      <br /> Mahon
                    </h5>
                    <p className="card-text">
                      <b>Tahun Ke-2 CS</b>
                      <br />
                      Tim Frontend
                    </p>
                    <div className="text-center">
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        className="GH aBlack"
                        href="https://github.com/Juuiko"
                      >
                        <FontAwesomeIcon icon={faGithub} />
                      </a>
                    </div>
                  </div>
                </div>
                <div className="card card-profile">
                  <div className="card-body">
                    <h5 className="card-title text-center">
                      Flora
                      <br /> Molnar
                    </h5>
                    <p className="card-text">
                      <b>Tahun Ke-2 CSB</b>
                      <br />
                      Tim Frontend
                    </p>
                    <div className="text-center">
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        className="GH aBlack"
                        href="https://github.com/flora-m"
                      >
                        <FontAwesomeIcon icon={faGithub} />
                      </a>
                    </div>
                  </div>
                </div>
                <div className="card card-profile">
                  <div className="card-body">
                    <h5 className="card-title text-center">
                      Lexes
                      <br /> Mantiquilla
                    </h5>
                    <p className="card-text">
                      <b>Tahun Ke-2 CS</b>
                      <br />
                      Tim Backend
                    </p>
                    <div className="text-center">
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        className="GH aBlack"
                        href="https://github.com/lexesjan"
                      >
                        <FontAwesomeIcon icon={faGithub} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <br />
              <div className="contributor">
                <h3 className="text-red">Kontributor</h3>
                <div className="card-deck">
                  <div className="card card-profile">
                    <div className="card-body">
                      <h5 className="card-title text-center ">Lucky Novita</h5>
                      <p className='card-text text-center'>
                        <b>POLINDRA</b>
                      </p>
                      <div className="text-center">
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          className="GH aBlack"
                          href="https://github.com/luckynovita"
                        >
                           <FontAwesomeIcon icon={faGithub} />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div> 
          </div>
        </div>
      </div>
    );
  }
}

export default AboutPage;
