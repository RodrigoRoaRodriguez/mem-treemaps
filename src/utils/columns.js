import { decamelize } from '../jsutils/index';
import { aspectRatio, oaar, foaar, offsetFactor, offsetQuotient } from '../utils/treemapMetrics';
import { combinations, mean, weightedMean } from '../jsutils/index';

export function aggregateMetrics(root, ratio) {
  const metrics = { aspectRatio, oaar, foaar, offsetFactor, offsetQuotient };
  const aggregates = { mean, weightedMean };
  const rows = combinations([Object.keys(aggregates), Object.keys(metrics)])
    .map(([aggregate, metric]) => ({
      aggregate,
      metric,
      ideal: metric.includes('offset') ? 1
        : metric === 'foaar' ? 1 / ratio : ratio,
      value: aggregates[aggregate](
        root.children,
        n => metrics[metric](n, ratio),
        n => n.value,
      ),
    }));

  return rows;
}


export const metricCols = [{
  Header: 'Parameters',
  columns: [{
    Header: 'Aggregate',
    id: 'aggregate',
    accessor: n => decamelize(n.aggregate),
  }, {
    Header: 'Metric',
    id: 'metric',
    accessor: n => n.metric.includes('oaar') ? n.metric.toUpperCase() : decamelize(n.metric),
  }],
}, {
  Header: 'Value',
  columns: [{
    Header: 'Ideal',
    id: 'ideal',
    accessor: n => n.ideal.toPrecision(3),
  }, {
    Header: 'Value',
    id: 'value',
    accessor: n => n.value.toPrecision(3),
  }],
},
];
