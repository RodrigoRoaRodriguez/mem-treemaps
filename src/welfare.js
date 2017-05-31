import eatTheRichRaw from './eatTheRich';

export default function welfare(
  parent, x0, y0, x1, y1,
  ratio = 3 / 2,
  budget = ratio,
  misery = ratio,
  step = 0.1,
  ) {
  let max = { firstRatio: 0, ratio };
  for (let offset = 0; offset < budget; offset += step) {
    eatTheRichRaw(parent, x0, y0, x1, y1, ratio + offset);
    const first = parent.children[0];
    const firstRatio = (first.x1 - first.x0) / (first.y1 - first.y0);
    if (firstRatio >= misery) return;
    if (firstRatio > max.firstRatio) max = { firstRatio, ratio: ratio + offset };
  }
  // Nothing worked, so revert to original ratio
  eatTheRichRaw(parent, x0, y0, x1, y1, max.ratio);
}
