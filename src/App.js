import React, { Component } from 'react';
import logo from './logo.svg';
import Chart from './Chart/Chart';
import { getDistroArray } from './utils/DataGenerator';
import './App.css';

const distros = getDistroArray({ count: 100, mean: 25, variance: 10 });

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Statistical Probability Distributions</h2>
        </header>
        <main className="App-content">
          { distros.map(({ key, x, y }) => <Chart
            key={key}
            className={key}
            data={[{ x, y, type: 'bar' }]}
            layout={{
              title: key,
            }}
          />)}
        </main>
      </div>
    );
  }
}

export default App;
