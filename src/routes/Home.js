import React, { Component } from 'react';
// import styled from 'styled-components';
import * as pdfs from '../statistical-distributions/index';
import { range } from '../statistical-distributions/jsutils/index';
import { eatThePoor } from '../economic-metaphor-treemap-tilings/index';
import Treemap from '../components/Treemap';
import styled from 'styled-components';

const Container = styled.div`
  padding-top: 3em;
  display: flex;
  flex-wrap: wrap; 
  justify-content: space-around;
`;

const count = 31;
const distros = {
  zipf: { scale: 'log' },
  uniform: { scale: 'index' },
  normal: { variance: count / 4, mean: count / 2, scale: 'linear' },
  logNormal: { variance: count / 2, mean: count / 2, scale: 'linear' },
};

const scales = ['log', 'index', 'linear', 'linear'];

const Home = () => {
  const datasets = Object.keys(distros).map(key =>
  range(31)
    .map(n => pdfs[key](distros[key])(n + 1)));

  return (
    <Container>
      {datasets.map((data, i) => <Treemap key={i} height={'40vh'} data={data} scale={scales[i]} />)}
    </Container>
  );
};

export default Home;
