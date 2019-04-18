import React, { Component } from 'react';

import Room from './Room'

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
       fetch('/api/rooms',{
        body: JSON.stringify(data),
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
          credentials: 'same-origin', // include, same-origin, *omit
          headers: {
            'user-agent': 'Mozilla/4.0 MDN Example',
            'content-type': 'application/json'
          },
          method: 'POST', // *GET, POST, PUT, DELETE, etc.
          mode: 'cors', // no-cors, cors, *same-origin
          redirect: 'follow', // manual, *follow, error
          referrer: 'no-referrer', // *client, no-referrer
       })
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
