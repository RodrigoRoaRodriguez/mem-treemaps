import React, { Component } from 'react';
import { drawTreemap } from '../utils/simpleTreemap';


class Treemap extends Component {
  render() {
    const {
      className,
      ratio,
      granularity,
      height,
      width,
      treemapArgs,
      callback,
    } = this.props;

    return (
      <svg
        className={className}
        height={height}
        width={width}
        viewBox={`0 0 ${ratio * granularity} ${granularity}`}
        ref={svg => callback(drawTreemap({ svg, ratio, granularity, ...treemapArgs }))
        }
      />
  );
  }
}

Treemap.defaultProps = {
  ratio: 3 / 2,
  granularity: 100,
  height: '100%',
  width: '100%',
  callback: id => id,
};


export default Treemap;
