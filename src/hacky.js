/**
 * There are hacky versions of the algorithms that use function composition
 * for their implementation. While these appear to work there is no guarantee
 * in regards to their correctness.
 */

let lastNode;
function eatTheRichHelper(parent, x0, y0, x1, y1, ratio) {
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
