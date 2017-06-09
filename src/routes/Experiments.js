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
import { divergent, positive, negative } from '../utils/contourColorScales';
import * as d3 from 'd3';


const Title = styled.h1`margin: 4em 0 0 0;`;
const Heading = styled.h2`margin: 4em 0 0 0; color: #888;`;
const Sub = styled.h3`margin-bottom: .5em; color: #AAA;`;
const Body = styled.main`
  flex-grow: 1;
`;

const Row = styled.section`
  flex: 1 0 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

const Col = styled.figure`
  flex: 1 0 ${({ width = '42%' }) => width};  
`;

const Container = styled.main`
  text-align: center;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  & > :first-child{ margin-top: 2em; }
  & h1+h2 { margin-top: 1em; }
  & h1,h2 {flex-basis:100%;}
`;

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
  // const distribution = pdfs.normal({ variance: count / 4, mean: count / 2 });
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

      return (<Col key={tilingName + id}>
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
      </Col>);
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
    yaxis: { ticksuffix: '%', title: 'Portion of total density' },
    xaxis: { title: 'Index' },
    margin: { t: 6, l: 75, r: 0 },
  };

  return (<Container>
    <Title>Experiment 2</Title>
    <Row>
  <Col>
    <Heading>Distribution: Zipf (s = 1)</Heading>
    <Chart
      data={[{ x: xs, y: data.map(n => n * 100), type: 'bar', marker: { color: data.map(color) } }]}
      layout={{ height, ...layout }}
    />
  </Col>
  <Col>
  <Heading> {tilingName} treemap of {id} distribution, aspect ratio {ratio}:1, target {ratio}:1 </Heading>

  <Treemap
    className={`${tilingName}-${id}`}
    height={height}
    ratio={ratio}
    granularity={100}
    treemapArgs={{
    data,
    scale: 'log',
    root,
  }}
  />
</Col>

  <Col>
        <Heading>Aspect ratio distribution</Heading>
        <Sub><br /></Sub>
        <Chart
          data={[{ x: xs, y: aspectRatios, type: 'bar', marker: { color: aspectRatios.map(arColor) } }]}
          layout={Object.assign({}, layout, {
            yaxis: {
              type: 'linear',
              title: 'Aspect Ratio',
            },

          })}
        />
      </Col>
  <Col>
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
      </Col>
</Row>
    <Heading>Metrics </Heading>
    <Table data={aggregateMetrics(root, ratio)} columns={metricCols} />
  </Container>
  );
};

export const Experiment3A = () => {
  const xs = range(50);
  // const means = range(50);
  const means = range(50);
  // const means = range(50).map(n => n/10);
  const expIncrement = i => i / 4 - 2;
  const variances = range(50).map(n => 2 ** (expIncrement(n)));
  const distroMatrix =
  variances.map(variance => means.map(mean => pdfs.normal({ mean, variance },
  )));
  const varIncrements = variances.map(variance => pdfs.normal({ variance, mean: 25 }));
  const meanIncrements = means.map(mean => pdfs.normal({ mean, variance: 25 }));
  const steps = 8;

  return (<Container>
    <Title>Distribution Matrix</Title>
    {[
      { title: 'Normal distribution with exponential variance increments (Fixed μ = 25)', getName: i => `𝜎² = ${Math.round(2 ** expIncrement(i) * 100) / 100}`, dataset: varIncrements, xName: 'y' },
      {
        title: 'Normal distribution with linear mean increments (Fixed 𝜎² = 25)', getName: i => `μ = ${i}`, dataset: meanIncrements, xName: 'x' },
    ].map(({ title, getName, dataset, xName }) => (<Col>
      <Heading> {title} </Heading>
      <Chart
        data={dataset.map((pdf, i) => ({
          type: 'line',
          name: getName(i),
          x: xs,
          y: percentalize(xs.map(n => pdf(n))),
        }))}
        layout={{
          xaxis: { title: xName },
          margin: { t: 6, l: 75, r: 0, b: 65 },
          yaxis: { ticksuffix: '%', title: 'Portion of total density' },
        }}
      />
    </Col>))
    }
    <Title>
      Metrics for Squarify and the Macro-Economic Metaphor algorithms
      </Title>
    {[
      'Squarify',
      'Eat the Poor',
      'Eat the Rich',
      'Subsidy',
      'Welfare',
    ].map((tilingName) => {
      const treemapMatrix = distroMatrix.map(row => row.map(distro => (
        calculateTreemap({ tile: tilingAlgorithms[tilingName].ratio(1.5), data: xs.map(x => distro(x)) })
      )));
      const arMatrix = treemapMatrix.map(row => row.map(treemap => (
        1 / rootWeightedMean(treemap, n => offsetQuotient(n, 1.5))
      )));
      const orientationMatrix = treemapMatrix.map(row => row.map(treemap => (
        weightedMean(treemap.children, orientation, n => n.value)
      )));
      const tickvals = variances.filter((_, i) => !(i % 4));
      return (<Row key={tilingName}>
        <Heading>{tilingName}</Heading>
        {
          [
            { sub: 'Weighted mean of inverse offset quotient for aspect ratio', z: arMatrix, zmin: 1, zmax: 2 },
            { sub: 'Weighted mean of orientation', z: orientationMatrix, zmin: 0, zmax: 1, reversescale: true },
          ].map(({ sub, z, zmax, zmin, reversescale }) => (<figure>
            <Sub>{sub}</Sub>
            <Chart
              data={[{
                type: 'contour',
                x: means,
                y: variances,
                z,
                zmin,
                zmax,
                reversescale,
                colorscale: divergent,
                colorbar: { thickness: 12, xpad: 5 },
                line: { width: 0 },
              }]}
              layout={{
                height: 800,
                width: 600,
                margin: { t: 6, l: 75, r: 0 },
                xaxis: { title: 'Mean' },
                yaxis: {
                  mirror: true,
                  tickvals,
                  ticktext: tickvals,
                  type: 'log',
                  title: 'Variance',
                },
              }}
            />
          </figure>),
          )
        }
      </Row>);
    })
    }

  </Container>
  );
};

export const Experiment3C = () => {
  const xs = range(50);
  const means = range(50);
  const expIncrement = i => (i - 8) / 4;
  const variances = range(51).map(n => 2 ** (expIncrement(n)));
  const distroMatrix =
    variances.map(variance => means.map(mean => pdfs.normal({ mean, variance },
    )));

  const squarifyMatrix = distroMatrix.map(row => row.map(distro => (
    calculateTreemap({ tile: tilingAlgorithms.Squarify.ratio(1.5), data: xs.map(x => distro(x)) })
  )));

  const squarifyArMatrix = squarifyMatrix.map(row => row.map(treemap => (
    1 / rootWeightedMean(treemap, n => offsetQuotient(n, 1.5))
  )));

  const squarifyOrMatrix = squarifyMatrix.map(row => row.map(treemap => (
    weightedMean(treemap.children, orientation, n => n.value)
  )));

  return (<Container>
    <Title>
      Comparizon between Squarify and the Macro-Economic Metaphor algorithms
      </Title>
    <Sub>Countour plots are difference images between Squarify and the specified algorithm.</Sub>
    {[
      'Squarify',
      'Eat the Poor',
      'Eat the Rich',
      'Subsidy',
      'Welfare',
    ].map((tilingName) => {
      const treemapMatrix = distroMatrix.map(row => row.map(distro => (
        calculateTreemap({ tile: tilingAlgorithms[tilingName].ratio(1.5), data: xs.map(x => distro(x)) })
      )));

      { /* const arMatrix = treemapMatrix.map(row => row.map(treemap => (
        1 / rootWeightedMean(treemap, n => offsetQuotient(n, 1.5))
      )));*/ }

      const arMatrix = treemapMatrix.map((row, y) => row.map((treemap, x) => (
        1 / rootWeightedMean(treemap, n => offsetQuotient(n, 1.5)) - squarifyArMatrix[y][x]
      )));

      const orientationMatrix = treemapMatrix.map((row, y) => row.map((treemap, x) => (
        weightedMean(treemap.children, orientation, n => n.value)  - squarifyOrMatrix[y][x]
      )));
      const tickvals = variances.filter((_, i) => !(i % 4));
      return (<Row key={tilingName}>
        <Heading>{tilingName}</Heading>
        {
          [
            { sub: 'Weighted mean of inverse offset quotient for aspect ratio', z: arMatrix, zmin: -1, zmax: 0, reversescale: true },
            { sub: 'Weighted mean of orientation', z: orientationMatrix, zmin: 0, zmax: 1 },
          ].map(({ sub, z, zmax, zmin, reversescale }) => (<figure key={sub}>
            <Sub>{sub}</Sub>
            <Chart
              data={[{
                type: 'contour',
                x: means,
                y: variances,
                z,
                zmin: zmin-0.1,
                zmax : zmax+0.1,
                reversescale,
                colorscale: positive,
                colorbar: { thickness: 12, xpad: 5 },
                line: { width: 0 },
              }]}
              layout={{
                height: 750,
                width: 500,
                margin: { t: 6, l: 75, r: 0 },
                xaxis: { title: 'Mean' },
                yaxis: {
                  mirror: true,
                  tickvals,
                  ticktext: tickvals,
                  type: 'log',
                  title: 'Variance',
                },
              }}
            />
          </figure>),
          )
        }
      </Row>);
    })
    }

  </Container>
  );
};

export const Experiment3B = () => {
  const xs = range(50);
  const means = range(50);
  const expIncrement = i => (i - 8) / 4;
  const variances = range(51).map(n => 2 ** (expIncrement(n)));
  const distroMatrix =
    variances.map(variance => means.map(mean => pdfs.normal({ mean, variance },
    )));

  const squarifyMatrix = distroMatrix.map(row => row.map(distro => (
    calculateTreemap({ tile: tilingAlgorithms.Squarify.ratio(1.5), data: xs.map(x => distro(x)) })
  )));

  const squarifyArMatrix = squarifyMatrix.map(row => row.map(treemap => (
    1 / rootWeightedMean(treemap, n => offsetQuotient(n, 1.5))
  )));

  const squarifyOrMatrix = squarifyMatrix.map(row => row.map(treemap => (
    weightedMean(treemap.children, orientation, n => n.value)
  )));

  return (<Container>
    <Title>
      Comparizon between Squarify and the Macro-Economic Metaphor algorithms
      </Title>
    <Sub>Countour plots are difference images between Squarify and the specified algorithm.</Sub>
    {[
      'Squarify',
      'Eat the Poor',
      'Eat the Rich',
      'Subsidy',
      'Welfare',
    ].map((tilingName) => {
      const treemapMatrix = distroMatrix.map(row => row.map(distro => (
        calculateTreemap({ tile: tilingAlgorithms[tilingName].ratio(1.5), data: xs.map(x => distro(x)) })
      )));

      { /* const arMatrix = treemapMatrix.map(row => row.map(treemap => (
        1 / rootWeightedMean(treemap, n => offsetQuotient(n, 1.5))
      )));*/ }

      const arMatrix = treemapMatrix.map((row, y) => row.map((treemap, x) => (
        1 / rootWeightedMean(treemap, n => offsetQuotient(n, 1.5)) - squarifyArMatrix[y][x]
      )));

      const orientationMatrix = treemapMatrix.map((row, y) => row.map((treemap, x) => (
        weightedMean(treemap.children, orientation, n => n.value) - squarifyOrMatrix[y][x]
      )));
      const tickvals = variances.filter((_, i) => !(i % 4));
      return (<Row key={tilingName}>
        <Heading>{tilingName}</Heading>
        {
          [
            { sub: 'Weighted mean of inverse offset quotient for aspect ratio', z: arMatrix, zmin: 0, zmax: 1 },
            { sub: 'Weighted mean of orientation', z: orientationMatrix, zmin: -1, zmax: 0, reversescale:true },
          ].map(({ sub, z, zmax, zmin, reversescale }) => (<figure key={sub}>
            <Sub>{sub}</Sub>
            <Chart
              data={[{
                type: 'contour',
                x: means,
                y: variances,
                z,
                zmin: zmin-0.1,
                zmax : zmax+0.1,
                reversescale,
                colorscale: negative,
                colorbar: { thickness: 12, xpad: 7 },
                line: { width: 0 },
              }]}
              layout={{
                height: 750,
                width: 500,
                margin: { t: 6, l: 75, r: 0 },
                xaxis: { title: 'Mean' },
                yaxis: {
                  mirror: true,
                  tickvals,
                  ticktext: tickvals,
                  type: 'log',
                  title: 'Variance',
                },
              }}
            />
          </figure>),
          )
        }
      </Row>);
    })
    }

  </Container>
  );
};
