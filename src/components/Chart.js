import React, { Component } from 'react';
import PropTypes from 'prop-types';
import plotly from 'plotly.js';
import styled from 'styled-components';

const Frame = styled.figure`
  background-color: white;
  color: black;
  margin: 1em;
  `;

class Chart extends Component {
  componentDidMount() {
    const { data, layout } = this.props;
    plotly.newPlot(this.container, data, layout)
    // TODO extract this code image downloading 
    // .then(
    //   function (gd) {
    //     plotly.toImage(gd, { format: 'svg', height: 600, width: 400 })
    //       .then(
    //       function (url) {
    //         var download = document.createElement('a');
    //         document.body.appendChild(download); // For Firefox.
    //         download.setAttribute('href', url);
    //         download.setAttribute('download', (new Date()) + '.svg');
    //         download.click();
    //       }
    //       )
    //   });
  }
  componentWillUnmount(){
    plotly.purge(this.container);
  }
  render() {
    const { className } = this.props;
    return (
      <Frame className={className}>
        <figure ref={DOMNode => this.container = DOMNode} />
      </Frame>
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
