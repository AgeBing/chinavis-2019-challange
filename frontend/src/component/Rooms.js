import React, { Component } from 'react';

import Room from './Room'

export default class Sensors extends Component {
  constructor(props) {
    super(props);
    this.state = {
        rooms: []
    };
  }

  componentDidMount(){
    this.getRooms()
  }

  getRooms(){
     fetch('/api/rooms1')
          .then(r => r.json())
          .then(response => {
            // console.log(response)
              this.setState({
                  rooms : response
              })
          })

  }
  render() {
    let { rooms } = this.state 
    return (
      <svg  className='map-rooms' 
        width={this.props.width} height={this.props.height} >
          {
            rooms.map((room)=>(
               <Room  
                x = {room.x}
                y = {room.y}
                width = {room.width}
                height = {room.height}
                name   = {room.name}
                            />  
            ))
          }
      </svg>
    );
  }
}
