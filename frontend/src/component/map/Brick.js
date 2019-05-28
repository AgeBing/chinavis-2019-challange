import React, { Component } from 'react';

import * as Config from './Config'



export default class Brick extends Component {
  constructor(props) {
    super(props);
    this.state = {
        wordOffsetX:3,
        wordOffsetY:20,
        fillColor: 'gray'
    };
  }

  render() {
    let { wordOffsetX,wordOffsetY,fillColor  } = this.state 
    let { x,y }  = this.props
    let { rectWidth,rectHeight }  = Config
    return (
      <g>
          <rect 
            x={ (x)*rectWidth }  
            y={ (y)*rectHeight}
            width={rectWidth} height={rectHeight}
            fill={fillColor}
            ></rect>

{/*          <text 
            x={ (x + 1)*rectWidth + wordOffsetX}  
            y={ (y + 1)*rectHeight+ wordOffsetY}
            fill="red" > {x} | {y}  </text>*/}
            
      </g>
    );
  }
}
