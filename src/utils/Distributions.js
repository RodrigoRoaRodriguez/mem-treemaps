import { elementwise, range, sum } from './Utils';

const { sqrt, PI, exp, log } = Math;

export const normal = ({ x, mean = 0, variance = 1 }) =>
  exp(-((x - mean) ** 2) / (2 * variance)) / sqrt(2 * variance * PI);

export const symmetricNormalBimodal = ({ x, xs, mean = 0, variance = 1 }) => (normal({ x, mean, variance }) + normal({ x, mean: xs[xs.length - 1] - mean, variance })) / 2;

export const symmetricNormalTrimodal = ({ x, xs, mean = 0, variance = 1 }) => (normal({ x, mean, variance }) +
  normal({ x, mean: xs[xs.length - 1] / 2, variance }) +
  normal({ x, mean: xs[xs.length - 1] - mean, variance })) / 3
;

export const logNormal = ({ x, mean = 0, variance = 1 }) =>
  exp(-((log(x) - mean) ** 2) / (2 * variance)) / x / sqrt(variance * 2 * PI);

const harmonicNumber = n => range(n).reduce((prev, curr) => prev + 1 / (curr + 1), 0);
export const zipf = ({ x }) => 1 / (x + 1) / harmonicNumber(x + 1);

export const uniform = ({ count }) => 1 / count;

export const uniformBimodal = ({ x, count }) => (x < count / 2 ? 2 : 1) / count;

export const uniformTrimodal = ({ x, count }) => (x < count / 3 ? 3 :
  x < 2 * count / 3 ? 2 : 1) / count;

