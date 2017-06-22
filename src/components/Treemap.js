import React from 'react';
import { drawTreemap } from '../utils/simpleTreemap';

const Treemap = ({
      className = 'treemap',
      ratio = 3 / 2,
      granularity = 100,
      callback = id => id,
      height,
      width,
      ...rest
}) => (
  <svg
    className={className}
    height={height}
    width={width}
    viewBox={`0 0 ${ratio * granularity} ${granularity}`}
    ref={svg => callback(drawTreemap({ svg, ratio, granularity, ...rest }))}
  />
  );


export default Treemap;
