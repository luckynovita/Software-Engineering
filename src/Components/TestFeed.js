import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

class Feed extends React.Component {
  constructor(props) {
    super(props);
    this.state = { ...props };
  }
  render() {
    return (
      <>
        <h3 className="text-blue">Aktivitas Terbaru</h3>
        <ul className="list-group">
          <li className="list-group-item list-group-item">
            Pengguna 1 (membuat 5 menit yang lalu) halaman TCD yang diedit 10 detik yang lalu item waktu nama pengguna
          </li>
        </ul>
      </>
    );
  }
}

export default Feed;
