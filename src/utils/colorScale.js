import * as d3 from 'd3';

const scales = {
  log: { fn: d3.scaleLog, color: d3.interpolateWarm },
  linear: { fn: d3.scaleLinear, color: d3.interpolateCool },
  index: { fn: d3.scaleLinear, color: d3.interpolateViridis },
};

export default function getColorScale(values, type = 'log') {
  const { color, fn } = scales[type];
  const scale = fn().range([1, 0]).domain(
    type === 'index' ? [0, values.length] :
      [Math.max(d3.min(values), 1e-100), d3.max(values)],
  );
  return (value, index) => d3.scaleSequential(color)(scale(type === 'index' ? index : value));
}
