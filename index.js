import slice from './src/slice';
import dice from './src/dice';
import eatThePoorRaw from './src/eatThePoor';
import eatTheRichRaw from './src/eatTheRich';
import welfareRaw from './src/welfare';
import subsidyRaw from './src/subsidy';

export const phi = (1 + Math.sqrt(5)) / 2;

function customizer(algorithm, ratio = phi, maxFlexibility = 1) {
  function tilingFormat(parent, x0, y0, x1, y1) {
    algorithm(parent, x0, y0, x1, y1, ratio, maxFlexibility);
  }
  tilingFormat.ratio = function (customRatio) {
    return customizer(algorithm, customRatio, maxFlexibility);
  };
  tilingFormat.tax = function (customTax) {
    return customizer(algorithm, ratio, customTax);
  };
  return tilingFormat;
}
// First order
export { slice, dice };
// Second order
export const eatThePoor = customizer(eatThePoorRaw);
export const eatTheRich = customizer(eatTheRichRaw);
// Third order
export const subsidy = customizer(subsidyRaw);
export const welfare = customizer(welfareRaw);
