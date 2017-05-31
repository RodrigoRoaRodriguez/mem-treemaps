import slice from './src/slice';
import dice from './src/dice';
import eatThePoorRaw from './src/eatThePoor';
import eatTheRichRaw from './src/eatTheRich';
import welfareRaw from './src/welfare';
import subsidyRaw from './src/subsidy';

export const phi = (1 + Math.sqrt(5)) / 2;

function ratioCustomizer(algorithm, ratio = phi) {
  function tilingFormat(parent, x0, y0, x1, y1) {
    algorithm(parent, x0, y0, x1, y1, ratio);
  }
  tilingFormat.ratio = function (customRatio) {
    return ratioCustomizer(algorithm, customRatio);
  };
  return tilingFormat;
}

function thirdOrderCustomizer(algorithm, _ratio = phi, _budget, _misery, _step) {
  function tilingFormat(parent, x0, y0, x1, y1) {
    algorithm(parent, x0, y0, x1, y1, _ratio);
  }
  tilingFormat.ratio = function setRatio(ratio) {
    return thirdOrderCustomizer(algorithm, ratio, _budget, _misery, _step);
  };
  tilingFormat.budget = function setBudget(budget) {
    return thirdOrderCustomizer(algorithm, _ratio, budget, _misery, _step);
  };
  tilingFormat.misery = function setMisery(misery) {
    return thirdOrderCustomizer(algorithm, _ratio, _budget, misery, _step);
  };
  tilingFormat.step = function setStep(step) {
    return thirdOrderCustomizer(algorithm, _ratio, _budget, _misery, step);
  };

  return tilingFormat;
}


// First order
export { slice, dice };
// Second order
export const eatThePoor = ratioCustomizer(eatThePoorRaw);
export const eatTheRich = ratioCustomizer(eatTheRichRaw);
// Third order
export const subsidy = thirdOrderCustomizer(subsidyRaw);
export const welfare = thirdOrderCustomizer(welfareRaw);
