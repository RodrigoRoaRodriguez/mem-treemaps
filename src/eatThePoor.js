import slice from './slice';

export default function eatThePoor({ children, value }, x0, y0, x1, y1, ratio) {
  let x = x0; // Start from the left
  let remainingValue = value;
  const height = y1 - y0;

  for (let start = 0; start < children.length;) {
    const width = x1 - x;

    const alpha = width / height / remainingValue / ratio;
    let end = 0;
    let sumValue = 0;
    let minValue = children[start].value;
    let maxValue = minValue;
    let valueByArea = children[start].value ** 2 * alpha;
    let worst = Math.max(maxValue / valueByArea, valueByArea / minValue);
    // Keep adding nodes while the aspect ratio maintains or improves.
    for (; start + end < children.length; ++end) {
      const nodeValue = children[start + end].value;
      minValue = nodeValue > minValue ? minValue : nodeValue;
      maxValue = nodeValue < maxValue ? maxValue : nodeValue;
      sumValue += nodeValue;
      valueByArea = sumValue ** 2 * alpha;
      const newWorst = Math.max(maxValue / valueByArea, valueByArea / minValue);
      if (newWorst > worst) { // It added too many and ratio got worse
        sumValue -= nodeValue; // Roll back last one.
        break;
      }
      worst = newWorst;
    }

    // Carve out a column from the remaining area
    const nextX = remainingValue ? x + width * sumValue / remainingValue : x1;
    // Pass it to slice as a fake node and let it subdivide it.
    const fakeNode = {
      value: sumValue,
      children: children.slice(start, start + end),
    };
    slice(fakeNode, x, y0, nextX, y1);
    // Update values for next iteration.
    start += end;
    remainingValue -= sumValue;
    x = nextX;
  }
}