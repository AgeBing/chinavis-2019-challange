import React, { Component } from 'react';

import  Sensors  from './Sensors'
import  Bricks  from './Bricks'
import  Rooms  from './Rooms'
import  Traj   from  './Traj'
import  Hotmap   from  './Hotmap'

import * as Config from '../Config'

import { connect } from 'react-redux'



const mapStateToProps = (state) => {
  return {
    showSensors: state.showSensors,
    showBricks: state.showBricks,
    showRooms: state.showRooms,
    showTrajs: state.showTrajs,
    showHotmap: state.showHotmap
  }
}

class  Floor  extends Component{
	constructor(props){
		super(props)
	}
	render(){
		let { floor,showBricks,showSensors,showRooms,showTrajs,showHotmap }  = this.props
		return (
			<div>
				{ showBricks && 
					( <Bricks height={Config.mapHeight} width={Config.mapWidth} /> )  
				}
				{ showSensors && 
					(<Sensors  floor={floor}  height={Config.mapHeight} width={Config.mapWidth} />)  
				}
				{ showRooms && 
					( <Rooms floor={floor} height={Config.mapHeight} width={Config.mapWidth} /> )  
				}
				{ showTrajs && 
					( <Traj height={Config.mapHeight} width={Config.mapWidth} /> )  
				}
				{ showHotmap && 
					( <Hotmap floor={floor} 	height={Config.mapHeight} width={Config.mapWidth} /> )  
					}
					}
				}
			</div>
		)
	}
}

export default connect(mapStateToProps)(Floor)