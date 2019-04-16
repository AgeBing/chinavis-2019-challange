import React, { Component } from 'react';

import '../css/grid.css';


export default class Grid extends Component {
  constructor(props) {
    super(props);
    this.state = {
        wordOffsetX:3,
        wordOffsetY:20,
        rectWidth:35,
        rectHeight:35,
        fillColor: '#e9e4e6'
    };
  }

  enterHandle(e){
    this.setState({
      fillColor: 'green'
    })
  }
  leaveHandle(e){
    this.setState({
      fillColor: '#e9e4e6'
    })
  }
  render() {
    let { rectWidth,rectHeight,wordOffsetX,wordOffsetY,fillColor  } = this.state 
    let { x,y }  = this.props
    return (
      <g>
          <rect 
            x={ (x+1)*rectWidth }  
            y={ (y+1)*rectHeight}
            width={rectWidth} height={rectHeight}
            onMouseEnter={this.enterHandle.bind(this)}
            onMouseLeave={this.leaveHandle.bind(this)}
            fill={fillColor}
            ></rect>

          <text 
            x={ (x + 1)*rectWidth + wordOffsetX}  
            y={ (y + 1)*rectHeight+ wordOffsetY}
            fill="red" > {x} | {y}  </text>
            
      </g>
    );
  }
}
