import React, { Component } from 'react';

import './grid.css';
import * as Config from './Config'


export default class Grid extends Component {
  constructor(props) {
    super(props);
    this.state = {
        wordOffsetX:3,
        wordOffsetY:20,
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
    let { wordOffsetX,wordOffsetY,fillColor  } = this.state 
    let { x,y }  = this.props
    let { rectWidth,rectHeight } = Config
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
      </g>
    );
  }
}
