import * as Distributions from './Distributions';

const { sqrt, PI, exp, log } = Math;
function range(count) { return Array(count).fill().map((_, i) => i); }

export function getDistro(distro, { count, ...rest }) {
  const x = range(count);
  Distributions[distro]({ x, count, ...rest });
}

export function getDistroArray({ count = 100, ...rest } = {}) {
  // Create a common x parameter for all distributions
  const x = range(count);
  console.log(Object.keys(Distributions).map(key => ({
    key,
    x,
    y: x.map((x, i, xs) => Distributions[key]({ x, i, xs, count, ...rest })),
  })))
  return Object.keys(Distributions).map(key => ({
    key,
    x,
    y: x.map((x, i, xs) => Distributions[key]({ x, i, xs, count, ...rest })),
  }));
}
