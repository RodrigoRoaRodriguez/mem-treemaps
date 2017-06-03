 import * as d3 from 'd3';

// Metrics
 export const aspectRatio = n => (n.x1 - n.x0) / (n.y1 - n.y0);
 export const area = n => (n.x1 - n.x0) * (n.y1 - n.y0);
 export const oaar = n =>
 Math.max((n.x1 - n.x0) / (n.y1 - n.y0), (n.y1 - n.y0) / (n.x1 - n.x0));
 export const foaar = n =>
 Math.min((n.x1 - n.x0) / (n.y1 - n.y0), (n.y1 - n.y0) / (n.x1 - n.x0));
 export const offsetFactor = (n, ratio) => 
 aspectRatio(n) > ratio ? aspectRatio(n) / ratio : ratio / aspectRatio(n);
 export const offsetQuotient = (n, ratio) =>
 aspectRatio(n) < ratio ? aspectRatio(n) / ratio : ratio / aspectRatio(n);

 export const metrics = { aspectRatio, oaar, foaar, offsetFactor, offsetQuotient };

// Aggregates
 export const mean = (root, valueFn) => d3.mean(root.children.filter(n => n.value > 0.001), valueFn);

 export const weightedMean = (root, valueFn = id => id) =>
   d3.sum(root.children.filter(n => n.value > 0.001), n => valueFn(n) * n.value) / root.value;

 export const geometricMean = (array, valueFn = id => id) =>
  array.map(valueFn).reduce((prev, next) => prev * next, 1) ** (1 / array.length);

