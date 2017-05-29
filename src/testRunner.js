import * as d3 from 'd3';
import { eatThePoor, eatTheRich, welfare, subsidy } from '../tiling/index';
import pdfs from '../../scripts/utils/distributions';
import { range, map2d, sum } from '../../scripts/utils/Utils';

const tilingAlgorithms = {
  Binary: d3.treemapBinary,
  Squarify: d3.treemapSquarify,
  'Eat the Poor': eatThePoor,
  'Eat the Rich': eatTheRich,
  Welfare: welfare,
  Subsidy: subsidy,
};

const distroParams = {
  normal: { mean: range(100), variance: range(10).map(n => 2 ** (n - 2)) },
};

function combinations(arg) {
  const keys = Object.keys(arg);
  const values = keys.map(key => arg[key]);

  return values[0].map(a => values[1].map(b => ({ [keys[0]]: a, [keys[1]]: b })));
}


const filterZero = array => array.filter(n => n.value > 1/1000);
// const filterZero = array => array.filter(n => (n.x1 - n.x0) >= 1/7680 || (n.y1 - n.y0) >= 1/4320);
const aspectRatio = n => (n.x1 - n.x0) / (n.y1 - n.y0);
const oaar = n => Math.max((n.x1 - n.x0) / (n.y1 - n.y0), (n.y1 - n.y0) / (n.x1 - n.x0));

const PHI = (1 + Math.sqrt(5)) / 2;
const count = 100;
const xs = range(count);

const ratio = PHI;


[
  // ['zipf', data, 'Binary', d3.treemapBinary],
  // ['normal', 'Squarify'],
  // ['normal', 'Eat the Poor'],
  ['normal', 'Eat the Rich'],
].forEach(([distro, tiling]) => runTests(distro, tiling));

function toTreemap(data, tiling) {
  // The lines below make structured data into a hierachical datatype
  const root = { key: 'root', children: data };
  const hierarchicalData = d3.hierarchy(root).sum(d => d).sort((a, b) => b.value - a.value);

  // The layout adds the info necessary to draw the treemap
  const makeTreemap = d3.treemap().size([ratio, 1]).padding([0]).tile(tilingAlgorithms[tiling]);

  const treemapRoot = makeTreemap(hierarchicalData, d => d);
  return treemapRoot.children;
}


function runTests(distro, tiling) {
  const distros = map2d(combinations(distroParams.normal), args => pdfs.normal(args));

  const valueMatrix = map2d(distros, (distro) => {
    let ys = xs.map(x => distro(x));
    ys = ys.map(n => n / sum(ys));
    return ys;
  });

  const treemapMatrix = map2d(valueMatrix, data => toTreemap(data, tiling));

  const stats = {
    algorithm: tiling,
    distribution: distro,
    idealRatio: ratio,
    offsetRatio: map2d(treemapMatrix, children => d3.mean(filterZero(children), n => aspectRatio(n) > ratio ? aspectRatio(n) / ratio : ratio / aspectRatio(n))),
    // offsetRatio: map2d(treemapMatrix, children => d3.mean(filterZero(children), n => aspectRatio(n) > ratio ? aspectRatio(n) / ratio : ratio / aspectRatio(n))),
    // meanAR: map2d(treemapMatrix, children => d3.mean(filterZero(children), n => aspectRatio(n)))
    // meanARSqDiff: map2d(treemapMatrix, children => d3.mean(filterZero(children), n => (aspectRatio(n) - ratio) ** 2)),
    // posSumARdiff: map2d(treemapMatrix, children => d3.sum(filterZero(children), n => (aspectRatio(n) - ratio) > 0 ? (aspectRatio(n) - ratio) : 0 )),
    // negSumARdiff: map2d(treemapMatrix, children => d3.sum(filterZero(children), n => (aspectRatio(n) - ratio) < 0 ? (aspectRatio(n) - ratio) : 0 )),
    // sumARdiff: map2d(treemapMatrix, children => d3.mean(filterZero(children), n => (aspectRatio(n) - ratio) ** 2)),
    // meanAR: d3.mean(children, n => aspectRatio(n)),
    // meanOAAR: d3.mean(children, n => oaar(n)),
    // stdOAAR: d3.deviation(children, n => oaar(n)),
    // meanOAARSqDiff: d3.mean(children, n => (oaar(n) - ratio) ** 2),
    // stdOAARSqDiff: d3.deviation(children, n => (oaar(n) - ratio) ** 2),
    // meanOrientation: d3.mean(children, n => (n.x1 - n.x0) / (n.y1 - n.y0) >= 1 ? 1 : 0),
    // stdOrientation: d3.deviation(children, n => (n.x1 - n.x0) / (n.y1 - n.y0) >= 1 ? 1 : 0),
  };
  console.log(JSON.stringify(stats, null, 2));
}

