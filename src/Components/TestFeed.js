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
        <h3 className="text-blue">Recent Activities</h3>
        <ul className="list-group">
          <li className="list-group-item list-group-item">
          User 1 (created 5 minutes ago) edited TCD page 10 seconds ago time item username
          </li>
        </ul>
      </>
    );
  }
}

export default Feed;
