import React, { Component } from 'react';
import Chart from '../components/Chart';
import { range, sum } from '../statistical-distributions/jsutils/index';
import * as pdfs from '../statistical-distributions/index';

const count = 20;
const xs = range(count).map(x => x + 1);

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

/*class Temp extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h2>Probability Density Distributions</h2>
        </header>
        <main className="App-content">
          { <Chart
            key={'distribution'}
            data={[{ x, y: y.map(n => n * 100), type: 'bar' }]}
            layout={{
              width: 1000,
              height: 500,
                // title: key,
              yaxis: {
                ticksuffix: '%',
                title: '$\\text{Total mass}\\quad(\\sum_{n=1}^{100} f(n) = 100\\%)$',
              },
              xaxis: {
                title: '$Index$',
              },
            }}
          />

          }
        </main>
      </div>
    );
  }
}
*/

export default undefined; //Temp;
