import React, { Component } from 'react';
import { connect } from 'react-redux'

import Room from './Room'

import { API_Rooms } from '../../api/index'

class Rooms extends Component {
  constructor(props) {
    super(props);
    this.state = {
        rooms: []
    };
  }

  componentWillMount(){
    this.getRooms(this.props.floor)
  }

  // componentWillReceiveProps(nextProps){
  //     this.getRooms(nextProps.floor)
  // }
  getRooms(floor){
      let data = { floor}
      
      let { changeRoomsMap,roomsMap }  = this.props

      API_Rooms(data).then((response)=>{
         this.setState({
                rooms : response
          })
      })
  }

  render() {
    let { rooms } = this.state 
    let { chooseRooms } = this.props
    let style = {
      width: this.props.width,
      height : this.props.height
    }
    return (
      <div className='map-rooms' style={style}>
          {
            rooms.map((room)=>(
               <Room  key={room.id}
                x = {room.x}
                y = {room.y}
                width = {room.width}
                height = {room.height}
                name   = {room.name}
                choose = { chooseRooms.indexOf(room.id)!=-1 }
                            />  
            ))
          }
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    chooseRooms: state.rooms,
  }
}

const mapDispatchToProps = dispatch => {

  return {
    changeRoomsMap: (roomsMap) => {
      let type = 'CHANGE_ROOMMAP'

      dispatch({ type, roomsMap });
    },
  }
}
export default connect(mapStateToProps,mapDispatchToProps)(Rooms)