import React, { Component } from 'react';
import styled from 'styled-components';
import { drawTreemap } from '../utils/simpleTreemap';


class Treemap extends Component {
  render() {
    const {
      className,
      ratio,
      granularity,
      ...rest
    } = this.props;

    return (
      <svg
        className={className}
        height="80vh"
        width="100%"
        viewBox={`0 0 ${ratio * granularity} ${granularity}`}
        ref={svg => drawTreemap({ svg, ...rest })}
      />
    );
  }
}

Treemap.defaultProps = {
  ratio: 3 / 2,
  granularity: 100,
};


export default Treemap;
