import React, { Component } from 'react';
import styled from 'styled-components';
import * as pdfs from '../statistical-distributions/index';
import { range, combinations, decamelize, normalize, percentalize, mean, weightedMean } from '../jsutils/index';
import { calculateTreemap } from '../utils/simpleTreemap';
import { aspectRatio, oaar, foaar, offsetFactor, offsetQuotient, orientation, weightedMean as rootWeightedMean } from '../utils/treemapMetrics';
import Treemap from '../components/Treemap';
import colorScale from '../utils/colorScale';
import { font as fontFamily } from '../theme';
import Chart from '../components/Chart';
import Table from '../components/SimpleTable';
import tilingAlgorithms from '../utils/tilingsIndex';
import { aggregateMetrics, metricCols } from '../utils/columns';
import contourColorScale from '../utils/contourColorScale.json';
import * as d3 from 'd3';


const Body = styled.main`
  flex-grow: 1;
  margin: 0 10vw;
  *:first-child{ margin-top: 2em; }
`;
const Container = styled.figure`
  *:first-child{ margin-top: 0em; }
  & > h1+h2 { margin-top: 0em; }
`;
const Title = styled.h1`margin: 4em 0 .5em 0;`;
const Heading = styled.h2`margin: 3em 0 .5em 0; color: #888;`;
const Sub = styled.h3`margin-bottom: .5em; color: #AAA;`;

const font = { family: fontFamily.heading, size: 16 };
const height = 600;

const toLatex = rows => `${rows.map(row => row.join(' & ')).join(' \\\\\n')}`;

function thesisTable(root, ratio) {
  const metrics = { aspectRatio, oaar, foaar, offsetFactor, offsetQuotient };
  const aggregates = { mean, weightedMean };
  const formatNumber = n => n === undefined ? 'undefined' : n.toPrecision(2);

  const rows = combinations([Object.keys(aggregates), Object.keys(metrics)])
    .map(([aggregate, metric]) => [
      decamelize(aggregate),
      decamelize(metric),
      formatNumber(
        aggregates[aggregate](
          root.children,
          n => metrics[metric](n, ratio),
          n => n.value,
        ))]);

  const result = toLatex(rows);
  console.log(result);
}

export const Experiment1 = () => {
  const count = 20;
  const xs = range(count);
  const distribution = pdfs.normal({ variance: count / 4, mean: count / 2 });
  const data = xs.map(distribution);
  const color = colorScale(data, 'linear');
  const id = 'Experiment 1';
  const RATIO = 1;
  const layout = {
    font,
    height,
    yaxis: {
      ticksuffix: '%',
      title: 'Portion of total density',
    },
    xaxis: {
      title: 'Index',
    },
  };
  return (<Container>
    <Title>Experiment 1: Aspect Ratio Aggregates</Title>
    <Heading>Distribution: Normal (variance: {count / 4}, mean: {count / 2})</Heading>
    <Chart
      data={[{ x: xs, y: data.map(n => n * 100), type: 'bar', marker: { color: data.map(color) } }]}
      layout={layout}
    />
    {[
      'Slice',
      'Dice',
    ].map((tilingName) => {
      const root = calculateTreemap({
        data,
        tile: tilingAlgorithms[tilingName],
        granularity: 100,
        ratio: RATIO,
      });
      aggregateMetrics(root, RATIO);
      const aspectRatios = root.children.map(aspectRatio);
      const arColor = colorScale(aspectRatios, 'log');

      return (<div key={tilingName + id}>
        <Heading> {tilingName} treemap of {id} distribution, aspect ratio {RATIO}:1 </Heading>

        <Treemap
          className={`${tilingName}-${id}`}
          height="60vh"
          ratio={RATIO}
          granularity={100}
          treemapArgs={{
            data,
            scale: 'linear',
            root,
          }}
        />
        <Heading>Aspect ratio distribution ({ tilingName })</Heading>
        <Chart
          data={[{ x: xs, y: aspectRatios, type: 'bar', marker: { color: aspectRatios.map(arColor) } }]}
          layout={Object.assign({}, layout, {
            yaxis: {
              type: 'log',
              title: 'Aspect Ratio',
            },
            xaxis: {
              title: 'Lowest to highest value',
            },
          })}
        />
        <Heading>Metrics </Heading>
        <Table data={aggregateMetrics(root, 1)} columns={metricCols} />
      </div>);
    })}
  </Container>
  );
};

export const Experiment2 = () => {
  const count = 100;
  const xs = range(count);
  const distribution = pdfs.zipf();
  const data = normalize(xs.map(distribution));
  const color = colorScale(data, 'log');
  const id = 'Experiment 2';
  const tilingName = 'Squarify';
  const ratio = 3 / 2;
  const root = calculateTreemap({
    data,
    tile: tilingAlgorithms[tilingName].ratio(ratio),
    granularity: 100,
    ratio,
  });
  const aspectRatios = root.children.map(aspectRatio).sort((a, b) => b - a);
  const arColor = colorScale(aspectRatios, 'log');
  const multimodalApprox = xs.map(pdfs.uniformRegularMultimodal({ count: 100, modes: [mean(aspectRatios.slice(0, 50)), mean(aspectRatios.slice(50))] }));
  const layout = {
    font,
    height,
    yaxis: { ticksuffix: '%', title: 'Portion of total density' },
    xaxis: { title: 'Index' },
  };


  return (<Container>
    <Title>Experiment 2</Title>
    <Heading>Distribution: Normal (variance: {count / 4}, mean: {count / 2})</Heading>
    <Chart
      data={[{ x: xs, y: data.map(n => n * 100), type: 'bar', marker: { color: data.map(color) } }]}
      layout={layout}
    />
    <Heading> {tilingName} treemap of {id} distribution, aspect ratio {ratio}:1, target {ratio}:1 </Heading>

    <Treemap
      className={`${tilingName}-${id}`}
      height="60vh"
      ratio={ratio}
      granularity={100}
      treemapArgs={{
        data,
        scale: 'log',
        root,
      }}
    />
    <Heading>Aspect ratio distribution</Heading>
    <Chart
      data={[{ x: xs, y: aspectRatios, type: 'bar', marker: { color: aspectRatios.map(arColor) } }]}
      layout={Object.assign({}, layout, {
        yaxis: {
          type: 'linear',
          title: 'Aspect Ratio',
        },

      })}
    />
    <Heading>Bimodal distribution for comparizon </Heading>
    <Sub>(Modes are the mean values of the 50 first and last elements)</Sub>
    <Chart
      data={[{ x: xs, y: multimodalApprox, type: 'bar', marker: { color: multimodalApprox.map(arColor) } }]}
      layout={Object.assign({}, layout, {
        yaxis: {
          type: 'linear',
          title: 'Aspect Ratio',
          range: [0, 3],
        },
        xaxis: {
          title: 'Descending by value',
        },
      })}
    />
    <Heading>Metrics </Heading>
    <Table data={aggregateMetrics(root, ratio)} columns={metricCols} />
  </Container>
  );
};

export const Experiment3 = () => {
  const xs = range(50);
  // const means = range(50);
  const means = range(50);
  // const means = range(50).map(n => n/10);
  const expIncrement = i => (i - 4) / 2
  const variances = range(31).map(n => 2 ** (expIncrement(n)));
  const distroMatrix =
  variances.map(variance => means.map(mean => pdfs.normal({ mean, variance },
  )));

  // console.log('arMatrix', arMatrix);
  const varIncrements = variances.map(variance => pdfs.normal({ variance, mean: 25 }));
  const meanIncrements = means.map(mean => pdfs.normal({ mean, variance: 25 }));
  let steps = 8;

  return (<Container>
    <Title>Distribution Matrix</Title>
    <Heading>Normal distribution with exponential variance increments (μ = 25) </Heading>
    <Chart
      data={varIncrements.map((pdf, i) => ({
        type: 'line',
        name: `𝜎 = 2^${expIncrement(i)}`,
        x: xs,
        y: percentalize(xs.map(n => pdf(n))),
      }))}
      layout={{
        margin: { t: 6 },
        yaxis: { ticksuffix: '%', title: 'Portion of total density' },
      }}
    />
    <Heading>Normal distribution with linear mean increments (𝜎² = 25) </Heading>
    <Chart
      data={meanIncrements.map((pdf, i) => ({
        type: 'line',
        name: `μ = ${i}`,
        x: xs,
        y: percentalize(xs.map(n => pdf(n))),
      }))}
      layout={{
        margin: { t: 6 },
        yaxis: { ticksuffix: '%', title: 'Portion of total density' },
      }}
    />
    <Title>
      Comparizon of Squarify and the Macro-Economic Metaphor algorithms
      </Title>
    {[
      'Squarify',
      'Eat the Poor',
      'Eat the Rich',
      'Subsidy',
      'Welfare',
    ].map(tilingName => {
      const treemapMatrix = distroMatrix.map(row => row.map(distro => (
        calculateTreemap({ tile: tilingAlgorithms['Eat the Rich'].ratio(1.5), data: xs.map(x => distro(x)) })
      )));
      const arMatrix = treemapMatrix.map(row => row.map(treemap => (
        // mean(treemap, foaar)
        1 / rootWeightedMean(treemap, n => offsetQuotient(n, 1.5))
      )));
      const orientationMatrix = treemapMatrix.map(row => row.map(treemap => (
        // mean(treemap, foaar)
        weightedMean(treemap.children, orientation, n => n.value)
      )));

      return <div key={tilingName}>
        <Heading>{tilingName}</Heading>
        <Sub>Weighted mean of inverse offset quotient for aspect ratio</Sub>
        <Chart
          data={[{
            type: 'contour',
            x: means,
            y: variances,
            z: arMatrix,
            zmin: 1,
            zmax: 2,
            colorscale: contourColorScale,
          }]}
          layout={{
            height: 900,
            margin: { t: 6 },
            yaxis: {
              mirror: true,
              tickvals: variances,
              ticktext: variances.map((_, i) => `2^${expIncrement(i)}`),
              type: 'log',
              title: 'Variance',
            },
          }}
        />
        <Sub>Weighted mean of orientation</Sub>
        <Chart
          data={[{
            type: 'contour',
            x: means,
            y: variances,
            z: orientationMatrix,
            zmin: 0,
            zmax: 1,
            colorscale: contourColorScale,
            reversescale: true,
          }]}
          layout={{
            height: 900,
            margin: { t:6 },
            yaxis: {
              mirror: true,
              tickvals: variances,
              ticktext: variances.map((_, i) => `2^${expIncrement(i)}`),
              type: 'log',
              title: 'Variance'
            },
          }}
        />
      </div>


      })
    }

  </Container>
  );
};


const allExperiments = () => (<Body>
   <Experiment1 />
   <Experiment2 />
  <Experiment3 />
</Body>);

export default allExperiments;
