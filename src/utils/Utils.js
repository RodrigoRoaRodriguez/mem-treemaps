export function range(count) {
  return Array(count).fill().map((_, i) => i);
}

export function sum(array) {
  return array.reduce((total, next) => total + next, 0);
}

export function elementwise(fn, ...args) {
  return args[0].map((_, i, arrays) => fn(arrays.map(() => arrays[i])));
}

export function map2d(arrayOfArrays, fn) {
  return arrayOfArrays.map((outerValue, outerIndex, outerArray) =>
    outerValue.map((value, index, array) =>
      fn(value, index, array, outerIndex, outerArray)));
}

