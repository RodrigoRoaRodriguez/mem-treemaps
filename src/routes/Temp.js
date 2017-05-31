import React, { Component } from 'react';
import { range, sum } from '../statistical-distributions/jsutils/index';
import * as pdfs from '../statistical-distributions/index';
import Chart from '../components/Chart';
import Treemap from '../components/Treemap';

const distros = [
  pdfs.normal({ variance: count / 4, mean: count / 2 }),
  pdfs.zipf(),
];

// Object.keys(pdfs)
const samples = distros.map((pdf) => {
  let ys = xs.map(x => pdf(x));
  ys = ys.map(n => n / sum(ys));

  return ({
    key: pdf,
    x: xs,
    y: ys,
  })
;
});

const count = 20;
const xs = range(count).map(x => x + 1);
let ys = xs.map(x => pdf(x));
ys = ys.map(n => n / sum(ys));

class Temp extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h2>Probability Density Distributions</h2>
        </header>
        <main className="App-content">
         <Treemap

         /> 
        </main>
      </div>
    );
  }
}


export default Temp;
