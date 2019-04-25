import React, { Component } from 'react';

import Room from './Room'

import { API_Rooms } from '../../api/index'

export default class Rooms extends Component {
  constructor(props) {
    super(props);
    this.state = {
        rooms: []
    };
  }

  componentWillMount(){
    this.getRooms(this.props.floor)
  }

  componentWillReceiveProps(nextProps){
      this.getRooms(nextProps.floor)
  }
  getRooms(floor){
      let data = { floor}
      
      API_Rooms(data).then((response)=>{
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
               <Room  key={room.id}
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
