import React, { Component } from 'react';

import  Sensors  from './Sensors'
import  Bricks  from './Bricks'
import  Rooms  from './Rooms'
import  Traj   from  './Traj'

import * as Config from './Config'

import { connect } from 'react-redux'

import { Slider,Drawer,Button,List } from 'antd';

import './map.css'

class  MyMap  extends Component{
	constructor(props){
		super(props)
		this.state = {
			visible: false,
			showIds:[]
		}
	}
	componentWillMount(){

    	let storage=window.localStorage
    	storage.clear()

    	this.setState({ 
    		opacity : this.props.opacity
    	})
	}

	  onOpacityChange = (value) => {
	    this.props.changeOpacity(value)
	  }

	componentWillReceiveProps(nextProps){
    //参数变化  
      if(this.props.selectIdsGlobal != nextProps.selectIdsGlobal){
        this.updateShowIds(nextProps)
      }
  	}
  	updateShowIds(nextProps){
  		this.setState({
  			showIds : nextProps.selectIdsGlobal
  		})
  	}
	render(){
		let { opacity,showIds } = this.state


		let data = ['123','21213','324','123']
		for(let o = 0;o < 400;o++){
			data.push(o)
		}
		return (
		<div>
			<div className='map-container'>
				<div className='map-floors'>
					<Bricks  floor={1}/>
					<Bricks  floor={2}/> 
				</div> 

				<div className='map-floors'>
{/*					<Sensors  floor={1}  height={Config.mapHeight} width={Config.mapWidth} />
					<Sensors  floor={2}  height={Config.mapHeight} width={Config.mapWidthHalf} />*/}
				</div>

				<div className='map-views'>
					{/*<HeatMap  floor={1} />*/}
		

					<Traj floor={1}  height={Config.mapHeight} width={Config.mapWidth} />
					<Traj floor={2} height={Config.mapHeight} width={Config.mapWidthHalf} />

					{/*<HeatMap  floor={2} />*/}
				</div>

				<div className='map-floors'>
					<Rooms floor={1} height={Config.mapHeight} width={Config.mapWidth}  />
					<Rooms  floor={2}  height={Config.mapHeight} width={Config.mapWidthHalf} />
				</div>


			</div>

			<div className='map-config'> 
				<div className='config-name'> 轨迹透明度 </div>
				<Slider className='config-wiget' 
					min={0.01}
            		max={1} 
            		step={0.01}
            	defaultValue={opacity} onChange={this.onOpacityChange} />
				
				<br/>
				<Button type="primary" onClick={this.showDrawer}>
          			Open
        		</Button>
			</div>



			 <Drawer
		          title={"当前选中人数"+showIds.length}
		          placement="right"
		          closable={true}
		          onClose={this.onClose}
		          visible={this.state.visible}
		          mask={false}
		        >
						 <List
						    itemLayout="horizontal"
						    dataSource={showIds}
						    renderItem={item => (
						      <List.Item>
						       	{+item}
						      </List.Item>
						    )}
						  />
		        </Drawer>

		</div>
		)
	}

	 showDrawer = () => {
	    this.setState({
	      visible: true,
	    });
	  };

	  onClose = () => {
	    this.setState({
	      visible: false,
	    });
	  };

}



const mapStateToProps = (state) => {
  return {
    opacity: state.opacity,
    selectIdsGlobal : state.selectIdsGlobal
  }
}

const mapDispatchToProps = dispatch => {
  var timer,
    delay = 2000;

  return {
    changeOpacity: (opacity) => {
      let type = 'CHANGE_OPACITY'

      delay = 500;
      clearTimeout(timer);
      timer = setTimeout(function() {
        dispatch({ type, opacity });
      }, delay);
    },
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(MyMap)
