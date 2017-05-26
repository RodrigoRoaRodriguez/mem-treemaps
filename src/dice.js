/**
 * Vertically subdivides a treemap node into their children proportionally to 
 * their value.
 *
 * @param {children:node[], value:number} param0 the node to be subdivided
 * @param {number} x0 x coordinate of the left side of the node
 * @param {number} y0 y coordinate of the top side of the node
 * @param {number} x1 x coordinate of the right side of the node
 * @param {number} y1 y coordinate of the bottom side of the node
 */
export default function dice({ children, value }, x0, y0, x1, y1) { // Vertical
  const lengthPerValue = value && (x1 - x0) / value;
  for (let i = 0; i < children.length; i++) {
    const prev = children[i - 1] || { x1: x0 };
    children[i].y0 = y0;
    children[i].y1 = y1;
    children[i].x0 = prev.x1;
    children[i].x1 = prev.x1 + children[i].value * lengthPerValue;
  }
}