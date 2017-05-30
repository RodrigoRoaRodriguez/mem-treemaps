import React, { Component } from 'react';
import * as d3 from 'd3';
import * as treemapTilings from '../economic-metaphor-treemap-tilings/index';
import pdfs from '../statistical-distributions/index';
import { range, combinations } from '../statistical-distributions/jsutils/index';
import { drawTreemap } from '../utils/simpleTreemap';
import { aspectRatio, oaar, foaar, offsetFactor, offsetQuotient, mean, weightedMean } from '../utils/treemapMetrics';
import { GRANULARITY } from '../constants';

const metrics = { aspectRatio, oaar, foaar, offsetFactor, offsetQuotient };
export const aggregates = { mean, weightedMean };

const formatNumber = n => n.toFixed(2)
// const formatNumber = n => n.toExponential(2)

function test(root, { tilingName, distro, ratio }) {
  let result = `
  \\begin{tabular}{llr}
  \\toprule
  \\multicolumn{2}{c}{Parameters} \\\\
  \\cmidrule(r){1-2}
  Aggregate    & Mean & Value \\\\
  \\midrule
  `

  // console.log('metrics', Object.keys(aggregates), Object.keys(metrics));
  let rows = [];
  Object.keys(aggregates).map(aggregate =>
    Object.keys(metrics).map(metric => rows.push([aggregate, metric,
      formatNumber(
        aggregates[aggregate](
          root.children,
          n => metrics[metric](n, ratio),
          n => n.value
        ))])));

  result += rows.map(str => str.join(' & ')).join(' \\\\\n') + '\n\\end{tabular}'
  console.log(result)
}

const PHI = (1 + Math.sqrt(5)) / 2;
// const count = 100;
const count = 20;
const xs = range(count);

const distroArgs = {
  // zipf: { count, s:5, scale: 'log' },
  uniform: { count, scale: 'index' },
  // normal: { count, variance: count / 4, mean: count / 2, scale: 'linear' },
  lognormal: { count, variance: count / 2, mean: count / 2, scale: 'linear' },
  normal: { count, variance: count / 4, mean: count / 2, scale: 'linear' }, // Experiment 1
  // normal: { count, variance: Math.sqrt(2), mean: 1, scale: 'linear' }, // The singularity
};

// const RATIO = 1.5;
const RATIO = 1;

const tilingAlgorithms = {
  Slice: d3.treemapSlice,
  Dice: d3.treemapDice,
  'Slice and Dice': d3.treemapSliceDice,
  Binary: d3.treemapBinary,
  Squarify: d3.treemapSquarify.ratio(RATIO),
  'Eat the Poor': treemapTilings.eatThePoor.ratio(RATIO),
  'Eat the Rich': treemapTilings.eatTheRich.ratio(RATIO),
  Welfare: treemapTilings.welfare.ratio(RATIO),
  Subsidy: treemapTilings.subsidy.ratio(RATIO),
};

const algorithms = [
  'Slice',
  'Dice',
  // 'Slice and Dice',
  // 'Squarify',
  // 'Binary',
  // 'Eat the Poor',
  // 'Eat the Rich',
  // 'Subsidy',
  // 'Welfare',
];
const distributions = [
  'normal',
  // 'uniform',
  // 'zipf',
];

console.log('combinations', combinations([algorithms, distributions]));

function formatData([distro, tilingName], ratio = PHI) {
  const distribution = pdfs[distro](distroArgs[distro]);
  const data = xs.map(x => distribution(x));
  return ({
    tilingName,
    distro,
    ratio,
    data,
    tile: tilingAlgorithms[tilingName],
    scale: distroArgs[distro].scale,
  });
}

class Showcase extends Component {
  render() {
    // const { ratio } = this.props;
    return (<div className="test" style={{ padding: '10%' }}>
      {
        combinations([distributions, algorithms]).map(d => formatData(d, 1)).map(({ tilingName, distro, ratio, ...rest }) => <div key={tilingName + distro + ratio.toFixed(2)}>
          <h1> {tilingName} {distro} {ratio.toFixed(2)} </h1>
          <svg
            id={`${tilingName} ${distro}`}
            height="80vh"
            width="100%"
            viewBox={`0 0 ${ratio * GRANULARITY} ${ratio * GRANULARITY}`}
            ref={svg => test(drawTreemap({ svg, ratio, ...rest }).root, { tilingName, distro, ratio })}
          />
        </div>,
        )
      }
    </div>
    );
  }
}


export default Showcase;
