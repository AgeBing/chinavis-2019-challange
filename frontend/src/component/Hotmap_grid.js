import React, { Component } from 'react';

import '../css/grid.css';


export default class hotmap_grid extends Component {
  constructor(props) {
    super(props);
    this.state = {
        wordOffsetX:0,
        wordOffsetY:0,
        rectWidth:35,
        rectHeight:35,
        fillColor: 'yellow'
    };
  }

  enterHandle(e){
    this.setState({
      // fillColor: 'green'
    })
  }
  leaveHandle(e){
    this.setState({
      // fillColor: 'gray'
    })
  }
  render() {
    let { rectWidth,rectHeight,wordOffsetX,wordOffsetY,fillColor  } = this.state 
    let { x,y ,color}  = this.props
    return (
      <g>
          <rect 
            x={ (x+1)*rectWidth }  
            y={ (y+1)*rectHeight}
            width={rectWidth} height={rectHeight}
            fill={color}
            ></rect>
      </g>
    );
  }
}
