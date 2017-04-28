import React, { Component } from 'react';
import logo from './logo.svg';
import Chart from './Chart/Chart';
import { range, sum } from './utils/Utils';
import pdfs from './utils/Distributions';

import './App.css';

const count = 100;
const xs = range(count).map(x => x + 1);
function getPdfArgs(pdf) {
  switch (pdf) {
    case 'normal': return { count, xs, mean: count / 2, variance: 20 };
    case 'logNormal': return { count, xs, mean: 0, variance: 20 };
    default: return { count, xs, mean: 25, variance: 20 };
  }
}

const samples = Object.keys(pdfs).map((pdf) => {
  let ys = xs.map(x => pdfs[pdf](getPdfArgs(pdf))(x));
  ys = ys.map(n => n / sum(ys));

  return ({
    key: pdf,
    x: xs,
    y: ys,
  }) 
;});

const linear = range(16).map((n) => {
  let ys = xs.map(x => pdfs.normal({ count, xs, mean: count / 2, variance: n - 2 })(x));
  ys = ys.map(n => n / (Math.max(...ys) || 1));

  return ({
    name: `$\\sigma = ${n}$`,
    x: xs,
    y: ys,
  });
});

const exponential = range(16).map((n) => {
  let ys = xs.map(x => pdfs.normal({ count, xs, mean: count / 2, variance: 2 ** (n - 2) })(x));
  ys = ys.map(n => n / sum(ys));

  return ({
    name: `$\\sigma = 2^{${(n - 2)}}$`,
    x: xs,
    y: ys,
  })
; });


class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Probability Density Distributions</h2>
        </header>
        <main className="App-content">
          {
            samples.map(({ key, x, y }) => <Chart
              key={key}
              className={key}
              data={[{ x, y: y.map(n => n * 100), type: 'bar' }]}
              layout={{
              title: key,
              yaxis: { 
                ticksuffix: '%', 
                title: '$\\text{Total mass}\\quad(\\sum_{n=1}^{100} f(n) = 100\\%)$' 
                },
              xaxis: { 
                title: '$Index$' 
                },
            }}  
            />)
          }
          {
          [
            {data: linear, title: 'Normal distribution with linear variance increments'},
            { data: exponential, title: 'Normal distribution with exponential variance increments'},
          ].map( sample =>
          <Chart
            className={'variances'}
            data={sample.data.map(args => (Object.assign(args, { type: 'line' })))}
            layout={{
              title: sample.title,
              xaxis: { 
                range: [35, 65],
                title: '$Index$',
                 },
              yaxis: {
                ticksuffix: '%',
                title: '$\\text{Total mass}\\quad(\\sum_{n=1}^{100} f(n) = 100\\%)$',
              },
            }}
          />)
          }
        </main>
      </div>
    );
  }
}

export default App;
