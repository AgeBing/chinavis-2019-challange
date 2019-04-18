import React, { Component } from 'react';

import '../css/grid.css';

import Grid from './Grid'

export default class Sensors extends Component {
  constructor(props) {
    super(props);
    this.state = {
        grids: []
    };
  }

  componentWillMount(){
    this.getGrids(this.props.floor)
  }

  componentWillReceiveProps(nextProps){
      this.getGrids(nextProps.floor)
  }
  getGrids(floor){
      if(floor == 1){
        fetch('/api/grids1')
          .then(r => r.json())
          .then(response => {
              this.setState({
                  grids : response
              })
          })
        }else{
          fetch('/api/grids2')
            .then(r => r.json())
            .then(response => {
                this.setState({
                    grids : response
                })
            })
        }
  }

  render() {
    let { grids } = this.state 
    return (
      <svg  className='map-sensor' 
        width={this.props.width} height={this.props.height} >
          {
            grids.map((grid)=>(
               <Grid  key={grid.sid}
                x = {grid.x}
                y = {grid.y}
                            />  
            ))
          }
      </svg>
    );
  }
}
