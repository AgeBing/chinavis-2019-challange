import React, { Component } from 'react';


import './tree.css'


export default class Link extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  render() {
    let { source,target } = this.props
    return (
      <g>
        <line x1={source.x} y1={source.y} x2={target.x} y2={target.y}  style={svgStyle}/>
        <circle cx={source.x} cy={source.y} style={svgStyle} />
        <circle cx={target.x} cy={target.y} style={svgStyle} />
      </g>
    );
  }
}


const svgStyle = {
  stroke : 'red',
  strokeWidth:1,
  r: 2,
  fill:'red'
}

