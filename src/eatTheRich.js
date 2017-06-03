import slice from './slice';

export default function eatTheRich({ children, value }, x0, y0, x1, y1, ratio) {
  let x = x1; // Start from the right
  let remainingValue = value;
  const height = y1 - y0;

  for (let end = children.length, start = 1; end >= 1; end -= start) {
    const width = x - x0;

    const alpha = width / height / remainingValue / ratio;
    let start = 1;
    let sumValue = 0;
    let minValue = children[end - start].value;
    let maxValue = minValue;
    let valueByArea = children[end - start].value ** 2 * alpha;

    let worst = Math.max(maxValue / valueByArea, valueByArea / minValue);
    // Keep adding nodes while the aspect ratio maintains or improves.
    for (; end - start >= 0; ++start) {
      const nodeValue = children[end - start].value;
      minValue = nodeValue > minValue ? minValue : nodeValue;
      maxValue = nodeValue < maxValue ? maxValue : nodeValue;
      sumValue += nodeValue;
      valueByArea = sumValue ** 2 * alpha;
      const newWorst = Math.max(maxValue / valueByArea, valueByArea / minValue);
      if (worst && newWorst > worst) { // It added too many and ratio got worse
        sumValue -= nodeValue; // Roll back last one.
        break;
      }
      worst = newWorst;
    }
    start--;
    // Carve out a column from the remaining area
    const nextX = remainingValue ? x - width * sumValue / remainingValue : x0;
    // Pass it to slice as a fake node and let it subdivide it.
    const fakeNode = {
      value: sumValue,
      children: children.slice(end - start, end),
    };
    slice(fakeNode, nextX, y0, x, y1);
    // Update values for next iteration.
    remainingValue -= sumValue;
    x = nextX;
  }
}
