import { range } from './Utils';

const { sqrt, PI, exp, log } = Math;
const harmonicNumber = n => range(n).reduce((prev, curr) => prev + 1 / (curr + 1), 0);

const PDFS = {
  normal: ({ mean = 0, variance = 1 }) => function normal(x) {
    return exp(-((x - mean) ** 2) / (2 * variance)) / sqrt(2 * variance * PI);
  },
  symmetricNormalBimodal: ({ xs, mean = 0, variance = 1 }) => function symmetricNormalBimodal(x) {
    return (
      PDFS.normal({ mean, variance })(x) +
      PDFS.normal({ mean: xs[xs.length - 1] - mean, variance })(x)
    ) / 2;
  },
  symmetricNormalTrimodal: ({ xs, mean = 0, variance = 1 }) => function symmetricNormalTrimodal(x) {
    return (
      PDFS.normal({ mean, variance })(x) +
      PDFS.normal({ mean: xs[xs.length - 1] / 2, variance })(x) +
      PDFS.normal({ mean: xs[xs.length - 1] - mean, variance })(x)
    ) / 3;
  },
  logNormal: ({ mean = 0, variance = 1 }) => function logNormal(x) {
    return exp(-((log(x) - mean) ** 2) / (2 * variance)) / x / sqrt(variance * 2 * PI);
  },

  zipf: ({ x }) => function zipf(x) {
    return 1 / (x + 1) / harmonicNumber(x + 1);
  },
  uniform: ({ count }) => function uniform(x) {
    return 1 / count;
  },
  uniformBimodal: ({ count }) => function uniformBimodal(x) {
    return (x < count / 2 ? 2 : 1) / count;
  },
  uniformTrimodal: ({ count }) => function uniformTrimodal(x) {
    return (x < count / 3 ? 3 : x < 2 * count / 3 ? 2 : 1) / count;
  },
};

export default PDFS;

