import React, { Component } from 'react';

import  Sensors  from './Sensors'
import  Bricks  from './Bricks'
import  Rooms  from './Rooms'
import  Traj   from  './Traj'
// import  Hotmap   from  './Hotmap'
import HeatMap from './HeatMap'

import * as Config from './Config'

import { connect } from 'react-redux'


import './map.css'

class  MyMap  extends Component{
	constructor(props){
		super(props)
	}
	componentWillMount(){
	}

	render(){
		return (
			<div className='map-container'>
				<div className='map-floors'>
					<Bricks  floor={1}/>
					<Bricks  floor={2}/> 
				</div> 

				<div className='map-floors'>
					<Sensors  floor={1}  height={Config.mapHeight} width={Config.mapWidth} />
					<Sensors  floor={2}  height={Config.mapHeight} width={Config.mapWidthHalf} />
				</div>

				<div className='map-floors'>
					<Rooms floor={1} height={Config.mapHeight} width={Config.mapWidth}  />
					<Rooms  floor={2}  height={Config.mapHeight} width={Config.mapWidthHalf} />
				</div>

				<div className='map-views'>
					<HeatMap  floor={1} />
					<HeatMap  floor={2} />
				</div>

			</div>
		)
	}
}

export default MyMap