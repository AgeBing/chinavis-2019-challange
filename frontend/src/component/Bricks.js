import React, { Component } from 'react';

import '../css/grid.css';

import Brick from './Brick'

export default class Sensors extends Component {
  constructor(props) {
    super(props);
    this.state = {
        grids: []
    };
  }

  componentDidMount(){
    this.generateGrids()
  }

  generateGrids(){
    let x_n = 30,
        y_n = 16,
        _grids = []

    for(let i = 0;i < x_n ;i++){
      for(let j = 0;j < y_n ;j++){
          _grids.push({
            x : i,
            y:  j
          })
      }
    }

    this.setState({
       grids : _grids
    })

  }
  render() {
    let { grids } = this.state 
    return (
      <svg  className='map-floor' 
        width={this.props.width} height={this.props.height} >
          {
            grids.map((grid)=>(
               <Brick  
                x = {grid.x}
                y = {grid.y}
                            />  
            ))
          }
      </svg>
    );
  }
}
