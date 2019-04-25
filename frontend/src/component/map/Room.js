import React, { Component } from 'react';


import * as Config from './Config'


export default class Room extends Component {
  constructor(props) {
    super(props);
    this.state = {
        wordOffsetX: - 5,
        wordOffsetY: 5,
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
    let { wordOffsetX,wordOffsetY,fillColor  } = this.state 
    let { x,y ,height,width,name }  = this.props
    let { rectWidth,rectHeight } = Config
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
