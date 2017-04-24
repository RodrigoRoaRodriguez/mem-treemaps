import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Chart.css';
import plotly from 'plotly.js';

class Chart extends Component {
  componentDidMount() {
    const { data, layout } = this.props;
    plotly.newPlot(this.container, data, layout);
  }
  render() {
    const { className } = this.props;
    return (
      <div className="Chart uniform">
        <figure className="uniform" ref={DOMNode => this.container = DOMNode} />
      </div>
    );
  }
}

Chart.defaultProps = {
  data: [{
    x: Array(100).fill().map((_, i) => i),
    y: Array(100).fill().map((_, i) => i),
    type: 'bar',
  }],
  layout: {
    title: 'Proportional',
  },
};

export default Chart;
