import React, { Component } from 'react';
import styled from 'styled-components';
import * as d3 from 'd3';
import * as treemapTilings from '../economic-metaphor-treemap-tilings/index';
import * as pdfs from '../statistical-distributions/index';
import { range, combinations } from '../statistical-distributions/jsutils/index';
import { drawTreemap } from '../utils/simpleTreemap';
import { aspectRatio, oaar, foaar, offsetFactor, offsetQuotient, mean, weightedMean } from '../utils/treemapMetrics';
import Treemap from '../components/Treemap';

// const count = 100;
const count = 20;
const xs = range(count);
const RATIO = 1;

const distroArgs = {
  normal: { count, variance: count / 4, mean: count / 2, scale: 'linear' },
};

const tilingAlgorithms = {
  Slice: d3.treemapSlice,
  Dice: d3.treemapDice,
};

const Title = styled.h1`margin: 3em 0 .5em 0;`;
const Container = styled.figure`margin: 10%;`;
class Showcase extends Component {
  render() {
    return (<Container>
      {
        [
          ['Slice', 'normal'],
          ['Dice', 'normal'],
        ].map(([tilingName, distro]) => {
            const distribution = pdfs[distro](distroArgs[distro]);
            return (<div key={tilingName + distro}>
              <Title> {tilingName} {distro} {RATIO.toFixed(2)} </Title>
              <Treemap
                className={`${tilingName}-${distro}`}
                height="60vh"
                ratio={RATIO}
                treemapArgs={{
                  data: xs.map(distribution),
                  tile: tilingAlgorithms[tilingName],
                  scale: distroArgs[distro].scale,
                }}
                granularity={100000}
                callback={results => test(results.root, { tilingName, distro, RATIO })}
              />
            </div>);
          })

      }
    </Container>
    );
  }
}

function test(root, { tilingName, distro, ratio }) {
  const metrics = { aspectRatio, oaar, foaar, offsetFactor, offsetQuotient };
  const aggregates = { mean, weightedMean };
  const formatNumber = n => n === undefined ? 'undefined' : n.toFixed(2);

  let result = `
  \\begin{tabular}{llr}
  \\toprule
  \\multicolumn{2}{c}{Parameters} \\\\
  \\cmidrule(r){1-2}
  Aggregate & Mean & Value \\\\
  \\midrule
  `;
  const rows = [];
  Object.keys(aggregates).map(aggregate =>
    Object.keys(metrics).map(metric => rows.push([aggregate, metric,
      formatNumber(
        aggregates[aggregate](
          root.children,
          n => metrics[metric](n, RATIO),
          n => n.value,
        ))])));

  result += `${rows.map(str => str.join(' & ')).join(' \\\\\n')}\n\\end{tabular}`;
  console.log(result);
}

export default Showcase;
