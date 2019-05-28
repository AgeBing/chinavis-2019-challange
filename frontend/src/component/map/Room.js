import React, { Component } from 'react';

import { connect } from 'react-redux'

import * as Config from './Config'
import { Switch } from 'antd';


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

  handdleChooseRoom = (event)=>{
    let ifChecked = event.target.checked
    this.setState({
      choosen : ifChecked
    })
  }
  render() {
    let { choosen,  wordOffsetX,wordOffsetY,fillColor  } = this.state 
    let { x,y ,height,width,name,choose }  = this.props
    let { rectWidth,rectHeight } = Config

    let style = {
      left : (x)*rectWidth ,
      top :  (y)*rectHeight ,
      width : width * rectWidth ,
      height : height * rectHeight

    }
    return (

          // <text 
          //   x={ (x + 0.5 + width/2  )*rectWidth + wordOffsetX}  
          //   y={ (y + 1 + height/2 )*rectHeight+ wordOffsetY}
          //   fill="black" > {name}  </text>

      <div className={ choose ? 'map-room map-room-choose': 'map-room'}
          style = { style }
        >
          <div className='room-color'>
            <div className='check-box'>
              <input type='checkbox' onClick={this.handdleChooseRoom} checked={choose} disabled />
            </div>
          </div>
          <div className='room-name'  style={{ lineHeight : height * rectHeight+'px' }}>{name}</div>
      </div>

    );
  }
}
