import * as d3 from 'd3';
import { GRANULARITY } from './constants';
// import { getOrdinal } from "../utils/Utils";

const parentDatum = fn => function passDatum() { return fn(d3.select(this.parentNode).datum()); };

const scales = {
  log: { fn: d3.scaleLog(), color: d3.interpolateWarm },
  linear: { fn: d3.scaleLinear(), color: d3.interpolateCool },
  index: { fn: d3.scaleLinear(), color: d3.interpolateViridis },
};

function getColorScale(values, type) {
  const { color, fn } = scales[type];
  const scale = fn.range([1, 0]).domain(
    type === 'index' ? [0, values.length] :
    [Math.max(d3.min(values), 1e-10), d3.max(values)],
    );
  return (value, index) => d3.scaleSequential(color)(scale(type === 'index' ? index : value));
}

const ARFormat = number => number >= 0.1 ? number.toPrecision(3) : number.toExponential(1);
const perFormat = number => (number * (number >= 1 / 100 ? 100 : number >= 1 / 1000 ? 1000 : 1e6)).toPrecision(3) + (number >= 1 / 100 ? '%' : number >= 1 / 1000 ? '‰' : 'ppm');

export function calculateTreemap(data, tile, ratio) {
  // The lines below make structured that data into a hierachical datatype
  const root = { key: 'root', children: data };
  // const hierarchicalData = d3.shuffle(d3.hierarchy(root).sum(d => d));
  const hierarchicalData = d3.hierarchy(root).sum(d => d).sort((a, b) => b.value - a.value);


  // The layout adds the info necessary to draw the treemap
  const makeTreemap = d3.treemap().size([ratio * GRANULARITY, 1 * GRANULARITY]).padding(0.25).tile(tile);
  return makeTreemap(hierarchicalData);
}

export function drawTreemap({
  data = [],
  tile = d3.treemapSquarify,
  ratio = 3 / 2,
  scale = 'log',
  root = calculateTreemap(data, tile, ratio),
  svg = document.createElement('svg'),
} = {},
) {
  const perTime = d3.select(svg)
      // HACK : put all styling in svg for the sake of the SVG exporter
      .style('font-family', "'FiraSansCondensed-Regular', 'Fira Sans Condensed', sans-serif")
      .style('fill', 'white')
    .selectAll('g')
      .data(root.leaves())
      .enter().append('g')
      .attr('transform', d => `translate(${d.x0},${d.y0})`);
  perTime.append('rect')
      .attr('id', d => d.data.key)
      .attr('width', d => d.x1 - d.x0)
      .attr('height', d => d.y1 - d.y0)
      // .attr('fill', (_, i) => colorScale(i));
      .attr('fill', (d, i) => getColorScale(data, scale)(d.data, i));

  const fontSize = n => Math.min((n.y1 - n.y0) / 2.3, (n.x1 - n.x0) / 3.5);
  const totalValue = d3.sum(data);
  const labels = perTime.append('text')
      .style('font-size', fontSize);

  labels.selectAll('tspan.time').data((n, i) => [
    `${ARFormat((n.x1 - n.x0) / (n.y1 - n.y0))}:1`,
    `${perFormat(n.value / totalValue)}`,
      // getOrdinal(i),
  ]).enter()
      .append('tspan')
      .attr('class', 'time')
      // .attr('dy', n => Math.min(n.y1 - n.y0, n.x1 - n.x0) / 3)
      // .attr('x', n => Math.min(n.y1 - n.y0, n.x1 - n.x0) / 3)
      .attr('dy', parentDatum(fontSize))
      .attr('x', parentDatum(n => fontSize(n) / 10))
      // .attr('dy', '1em')
      // .attr('x', '0.1em')
      .text(str => str);

      return { data, tile, ratio, scale, root, svg};
}