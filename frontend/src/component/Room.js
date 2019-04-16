import React, { Component } from 'react';

import '../css/grid.css';


export default class Room extends Component {
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
      fillColor: 'green'
    })
  }
  leaveHandle(e){
    this.setState({
      fillColor: 'gray'
    })
  }
  render() {
    let { rectWidth,rectHeight,wordOffsetX,wordOffsetY,fillColor  } = this.state 
    let { x,y ,height,width,name }  = this.props
    return (
      <g>
          <rect 
            x={ (x+1)*rectWidth }  
            y={ (y+1)*rectHeight}
            width={ width*rectWidth} height={ height* rectHeight}
            fill={fillColor}
            ></rect>  
          <text 
            x={ (x + 0.5 + width/2  )*rectWidth + wordOffsetX}  
            y={ (y + 1 + height/2 )*rectHeight+ wordOffsetY}
            fill="black" > {name}  </text>
      </g>
    );
  }
}
