import React, { Component } from 'react';
import styled from 'styled-components';
import logo from '../images/logo.svg';
import Chart from '../components/Chart';
import { normalize, range, sum } from '../statistical-distributions/jsutils/index';
import * as pdfs from '../statistical-distributions/index';


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
  // width: 1000,
  height: 600,
  yaxis: {
    ticksuffix: '%',
    title: '$\\text{Total mass}\\quad(\\sum_{n=1}^{100} f(n) = 100\\%)$',
  },
  xaxis: {
    title: '$Index$',
  },
}

const Title = styled.h1`margin: 1em 0 .5em 0;`;
const Container = styled.h1`margin: 10%;`;
class Distributions extends Component {
  render() {
    return (
      <div className="App">
          {
            Object.keys(pdfs).map((pdf) => {
              let y = normalize(xs.map(x => pdfs[pdf](getPdfArgs(pdf))(x))).map(n => n * 100);
              return <Container>
                <Title>{ pdf }</Title>
                <Chart
                key={pdf}
                className={pdf}
                data={[{ x:xs, y, type: 'bar' }]}
                layout={layout} />
            </Container>
            }
            )
          }
      </div>
    );
  }
}

export default Distributions;
