import _ from 'lodash';
import React, { Component } from 'react';

import BtcTotals from './components/BtcTotals';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      pairs: false,
    }

  }

  componentDidMount() {
      fetch('/api/exchangePairs')
      .then(res => res.json())
      .then((result) => {

        const groupedExchangePairs = _.groupBy(result, 'name');

        this.setState({ pairs: groupedExchangePairs });
      });
  }

  render() {
    const { pairs } = this.state;
    return (
      <div className="container-fluid">
        <div className='row'>
          <div className="col">
            <BtcTotals />
          </div>
        </div>
        <div className='row'>
          <div className="col">
            <h3>Wallets</h3>
          </div>
        </div>
        <div className='row'>
          <div className="col">
            <h3>Logs</h3>
          </div>
        </div>
        <div className='row'>
          <div className="col">
            <h3>Bot preferences</h3>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
