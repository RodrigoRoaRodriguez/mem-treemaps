import React, { Component } from 'react';
import logo from './logo.svg';
import Chart from './Chart/Chart';
import { range } from './utils/Utils';
import pdfs from './utils/Distributions';

import './App.css';





const count = 100;
const xs = range(count);
function getPdfArgs(pdf) {
  switch (pdf) {
    case 'normal': return { count, xs, mean: 50, variance: 20 };
    case 'logNormal': return { count, xs, mean: 0, variance: 20 };
    default: return { count, xs, mean: 25, variance: 20 };
  }
}
const samples = Object.keys(pdfs).map(pdf => ({
  key: pdf,
  x: xs,
  y: xs.map(x => pdfs[pdf](getPdfArgs(pdf))(x)),
}));


class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Statistical Probability Distributions</h2>
        </header>
        <main className="App-content">
          { samples.map(({ key, x, y }) => <Chart
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
