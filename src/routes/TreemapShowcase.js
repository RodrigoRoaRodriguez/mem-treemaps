import React, { Component } from 'react';
import styled from 'styled-components';
import * as d3 from 'd3';
import * as treemapTilings from '../economic-metaphor-treemap-tilings/index';
import * as pdfs from '../statistical-distributions/index';
import { range, combinations } from '../statistical-distributions/jsutils/index';
import Treemap from '../components/Treemap';

const count = 25;
const xs = range(count).map(n => n + 1);

const distroArgs = {
  zipf: { count, scale: 'log' },
  uniform: { count, scale: 'index' },
  normal: { count, variance: count / 4, mean: count / 2, scale: 'linear' },
  lognormal: { count, variance: count / 2, mean: count / 2, scale: 'linear' },
  // normal: { count, variance: Math.sqrt(2), mean: 1, scale: 'linear' }, // The singularity
};

const RATIO = 1.5;

const tilingAlgorithms = {
  // Slice: d3.treemapSlice,
  // Dice: d3.treemapDice,
  // 'Slice and Dice': d3.treemapSliceDice,
  // Binary: d3.treemapBinary,
  // Squarify: d3.treemapSquarify.ratio(RATIO),
  // 'Eat the Poor': treemapTilings.eatThePoor.ratio(RATIO),
  // 'Eat the Rich': treemapTilings.eatTheRich.ratio(RATIO),
  // Welfare: treemapTilings.welfare.ratio(RATIO),
  Subsidy: treemapTilings.subsidy.ratio(RATIO),
};

const algorithms = [
  // 'Slice',
  // 'Dice',
  'Slice and Dice',
  'Squarify',
  'Binary',
  'Eat the Poor',
  'Eat the Rich',
  'Subsidy',
  'Welfare',
];
const distributions = [
  'zipf',
  'uniform',
  'normal',
];


function formatData([distro, tilingName], ratio = 1) {
  const distribution = pdfs[distro](distroArgs[distro]);
  const data = xs.map(x => distribution(x));
  return ({ tilingName,
    distro,
    ratio,
    data,
    tile: tilingAlgorithms[tilingName],
    scale: distroArgs[distro].scale,
  });
}

const GRANULARITY = 100;
const Title = styled.h1`margin: 3em 0 .5em 0`;
const Container = styled.figure`padding: 0 10%`;

class Showcase extends Component {
  render() {
    // const { ratio } = this.props;
    return (<Container>
      {
        combinations([distributions, algorithms])
        .map(d => formatData(d, RATIO))
        .map(({ tilingName, distro, ratio, ...rest }) =>
          (<div key={tilingName + distro + ratio.toFixed(2)}>
            <Title> {tilingName} {distro} {ratio.toFixed(2)} </Title>
            <Treemap
              height={'40wh'}
              className={`${tilingName}-${distro}`}
              ratio={ratio}
              treemapArgs={rest}
            />
          </div>),
          )
        }
    </Container>
    );
  }
}


export default Showcase;
