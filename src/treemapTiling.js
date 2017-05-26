export function dice({ children, value }, x0, y0, x1, y1) { // Vertical
  const lengthPerValue = value && (x1 - x0) / value;
  for (let i = 0; i < children.length; i++) {
    const prev = children[i - 1] || { x1: x0 };
    children[i].y0 = y0;
    children[i].y1 = y1;
    children[i].x0 = prev.x1;
    children[i].x1 = prev.x1 + children[i].value * lengthPerValue;
  }
}

export function slice({ children, value }, x0, y0, x1, y1) { // Horizontal
  const lengthPerValue = value && (y1 - y0) / value;
  for (let i = 0; i < children.length; i++) {
    const prev = children[i - 1] || { y1: y0 };
    children[i].x0 = x0;
    children[i].x1 = x1;
    children[i].y0 = prev.y1;
    children[i].y1 = prev.y1 + children[i].value * lengthPerValue;
  }
}

function eatThePoorHelper({ children, value }, x0, y0, x1, y1, ratio) {
  let x = x0; // Start from the left
  let remainingValue = value;
  const height = y1 - y0;

  for (let start = 0; start < children.length;) {
    if (!children[start].value) { continue; } // Skip empty nodes.
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

function eatTheRichHelper({ children, value }, x0, y0, x1, y1, ratio) {
  let x = x1; // Start from the right
  let remainingValue = value;
  const height = y1 - y0;

  for (let end = children.length, start = 1; end >= 1; end -= start) {
    if (!children[end-1].value) { continue; } // Skip empty nodes.
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

function welfareHelper({ children, value }, x0, y0, x1, y1, ratio, maxFlexibility) {
  let start,
    lastStart,
    end;
  for (let welfare = 0; welfare < maxFlexibility; welfare += 0.1) {
    let x = x0; // Start from the left
    let remainingValue = value;
    for (start = 0, end = 0; start < children.length; start += end, end = 0) {
      if (!children[start].value) { continue; } // Skip empty nodes.
      const width = x1 - x;
      const height = y1 - y0;

      const alpha = width / height / remainingValue / (ratio + welfare);
      let valueByArea = children[start].value ** 2 * alpha;
    // Keep adding nodes while the aspect ratio maintains or improves.
      let minRatio = Math.max(maxValue / valueByArea, valueByArea / minValue);
      let sumValue = 0;
      let maxValue = children[start].value;
      let minValue = children[start].value;
      for (; start + end < children.length; ++end) {
        const nodeValue = children[start + end].value;
        if (nodeValue < minValue) minValue = nodeValue;
        if (nodeValue > maxValue) maxValue = nodeValue;
        sumValue += nodeValue;
        valueByArea = sumValue ** 2 * alpha;
        const newRatio = Math.max(maxValue / valueByArea, valueByArea / minValue);
        if (newRatio > minRatio) { // It added too many
          sumValue -= nodeValue; // Remove the last one
          break;
        }
        minRatio = newRatio;
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
      remainingValue -= sumValue;
      x = nextX;
    // Save start so that it is avilabel after the loop ends.
      lastStart = start;
    }
    const node = children[lastStart];

    if ((node.x1 - node.x0) / (node.y1 - node.y0) > 1) break;
  }
}

let lastNode;
function eatTheRichHelperOld(parent, x0, y0, x1, y1, ratio) {
  // HACK: in order to traverse the tree in the opposite order in spite of d3
  // reverse the children's order during execution, then mirror their x coords
  // and then reverse them once more to put them back the way they were.
  parent.children.reverse();
  if (parent.depth === 0) { lastNode = parent.children[0]; }
  eatThePoorHelper(parent, x0, y0, x1, y1, ratio);
  if (parent.data.key === lastNode.data.key) { mirrorAll(parent.parent); }
}

function subsidyHelper(parent, x0, y0, x1, y1, ratio, flexibility) {
  // HACK: in order to traverse the tree in the opposite order in spite of d3
  // reverse the children's order during execution, then mirror their x coords
  // and then reverse them once more to put them back the way they were.
  parent.children.reverse();
  if (parent.depth === 0) { lastNode = parent.children[0]; }
  welfareHelper(parent, x0, y0, x1, y1, ratio, flexibility);
  if (parent.data.key === lastNode.data.key) { mirrorAll(parent.parent); }
}

function mirrorAll(root) {
  root.children.reverse();
  root.children.forEach(n => mirror(n));
}

function mirror(node) {
  const prevX0 = node.x0;
  node.x0 = node.parent.x0 + node.parent.x1 - node.x1;
  node.x1 = node.parent.x0 + node.parent.x1 - prevX0;
  if (node.children) {
    node.children.reverse();
    node.children.forEach(n => mirror(n));
  }
}


export const phi = (1 + Math.sqrt(5)) / 2;
function customizer(algorithm, ratio = phi, maxFlexibility = 1) {
  function tilingFormat(parent, x0, y0, x1, y1) {
    algorithm(parent, x0, y0, x1, y1, ratio, maxFlexibility);
  }
  tilingFormat.ratio = function (r) {
    return customizer(algorithm, r, maxFlexibility);
  };
  tilingFormat.tax = function (newFlexibility) {
    return customizer(algorithm, ratio, newFlexibility);
  };
  return tilingFormat;
}

export const eatThePoor = customizer(eatThePoorHelper);
export const eatTheRich = customizer(eatTheRichHelper);
export const welfare = customizer(welfareHelper);
export const subsidy = customizer(subsidyHelper);

