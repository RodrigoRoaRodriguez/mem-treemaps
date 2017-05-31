import React, { Component } from 'react';
import logo from '../images/logo.svg';
import Chart from '../components/Chart';
import { normalize, range, sum } from '../statistical-distributions/jsutils/index';
import * as pdfs from '../statistical-distributions/index';

import './App.css';

const count = 20;
const xs = range(count).map(x => x + 1);
function getPdfArgs(pdf) {
  switch (pdf) {
    // case 'normal': return { count, xs, mean: count / 2, variance: 20 };
    // case 'normal': return { count, variance: Math.sqrt(2), mean: 1 };
    case 'normal': return { variance: count / 4, mean: count / 2 };
    case 'logNormal': return { count, xs, mean: 0, variance: 20 };
    case 'single': return { count, xs, mean: 50, variance: 20 };
    default: return { count, xs, mean: count / 2, variance: count / 4 };
  }
}
const layout = {
  width: 1000,
  height: 500,
  yaxis: {
    ticksuffix: '%',
    title: '$\\text{Total mass}\\quad(\\sum_{n=1}^{100} f(n) = 100\\%)$',
  },
  xaxis: {
    title: '$Index$',
  },
}

class Distributions extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h2>Probability Density Distributions</h2>
        </header>
        <main className="App-content">
          {
            Object.keys(pdfs).map((pdf) => {
              let y = normalize(xs.map(x => pdfs[pdf](getPdfArgs(pdf))(x))).map(n => n * 100);
              return <Chart
              key={pdf}
              className={pdf}
              data={[{ x:xs, y, type: 'bar' }]}
              layout={layout}
            />
            }
            )
          }
        </main>
      </div>
    );
  }
}

export default Distributions;
