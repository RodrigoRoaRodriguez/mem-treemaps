import * as d3 from 'd3';
import * as treemapTilings from '../economic-metaphor-treemap-tilings/index';

const tilingAlgorithms = {
  Slice: d3.treemapSlice,
  Dice: d3.treemapDice,
  'Slice and Dice': d3.treemapSliceDice,
  Binary: d3.treemapBinary,
  Squarify: d3.treemapSquarify,
  'Eat the Poor': treemapTilings.eatThePoor,
  'Eat the Rich': treemapTilings.eatTheRich,
  Welfare: treemapTilings.welfare,
  Subsidy: treemapTilings.subsidy,
};

export default tilingAlgorithms;