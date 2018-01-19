import _ from 'lodash';
import React, { Component } from 'react';

import PairChart from './components/PairChart';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      pairs: false,
    }

    this.buildPairCharts = this.buildPairCharts.bind(this);
  }

  componentDidMount() {
      fetch('/api/exchangePairs')
      .then(res => res.json())
      .then((result) => {

        const groupedExchangePairs = _.groupBy(result, 'name');

        this.setState({ pairs: groupedExchangePairs });
      });
  }

  buildPairCharts() {
    const { pairs } = this.state;

    return Object.keys(pairs).map(key => (
      <div className='row'>
        <div className="col">
          <PairChart pair={pairs[key]} />
        </div>
      </div>
    ));    
  }

  render() {
    const { pairs } = this.state;
    return (
      <div className="container-fluid">
        {pairs ? this.buildPairCharts() : 'Loading'}
      </div>
    );
  }
}

export default App;
