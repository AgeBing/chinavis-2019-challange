import React, { Component } from 'react';

import Brick from './Brick'
import * as Config from './Config'

export default class Bricks extends Component {
  constructor(props) {
    super(props);
    this.state = {
        grids: [],
        width:0,
        height:0
    };
  }

  componentDidMount(){
    this.generateGrids()
  }

  generateGrids(){
    let { rectWidth,rectHeight } = Config
    let { floor } = this.props
    let x_n = 30,
        y_n = 16,
        _grids = []

    if(floor == 2) x_n  = 12

    for(let i = 0;i < x_n ;i++){
      for(let j = 0;j < y_n ;j++){
          _grids.push({
            x : i,
            y:  j,
            id: i*y_n + j
          })
      }
    }
    let width = (x_n + 2) * rectWidth,
        height = (y_n) * rectHeight 
    this.setState({
       grids : _grids,
       width,
       height
    })
  }
  render() {
    let { grids,width,height } = this.state 
    return (
      <svg  className='map-bricks' 
        width={width} height={height} >
          {
            grids.map((grid)=>(
               <Brick  key={grid.id}
                x = {grid.x}
                y = {grid.y}
                            />  
            ))
          }
      </svg>
    );
  }
}
