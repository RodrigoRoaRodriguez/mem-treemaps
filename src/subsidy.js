import eatThePoorRaw from './eatThePoor';

export default function subsidy(parent, x0, y0, x1, y1, ratio,
  tax, stepSize = 0.1, budget = ratio, misery = ratio) {
  let max = { lastRatio: 0, ratio };
  for (let offset = 0; offset < budget; offset += stepSize) {
    eatThePoorRaw(parent, x0, y0, x1, y1, ratio + offset);
    const last = parent.children[parent.children.length - 1];
    const lastRatio = (last.x1 - last.x0) / (last.y1 - last.y0);
    if (lastRatio >= misery) return;
    if (lastRatio > max.lastRatio) max = { lastRatio, ratio: ratio + offset };
  }
  // Nothing worked, so use max AR
  eatThePoorRaw(parent, x0, y0, x1, y1, max.ratio);
}
