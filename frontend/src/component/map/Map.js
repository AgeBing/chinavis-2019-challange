import React, { Component } from 'react';

import  Sensors  from './Sensors'
import  Bricks  from './Bricks'
import  Rooms  from './Rooms'
import  Traj   from  './Traj'
import Heatmap from './Heatmap'

import * as Config from './Config'



import { connect } from 'react-redux'

import { Slider,Drawer,Button,List,Card  } from 'antd';

import './map.css'




const tabListNoTitle = [
  {
    key: 'traj',
    tab: '轨迹视图',
  },
  {
    key: 'heat',
    tab: '热力图',
  },
];
const contentListNoTitle = {
  'traj': <p>轨迹配置项</p>,
  'heat': <p>热力图配置项</p>,
};




class  MyMap  extends Component{
	constructor(props){
		super(props)
		this.state = {
			visible: false,
			showIds:[],
    
    		mapMode:  'traj' || 'heat',
		}
	}
	componentWillMount(){

    	let storage=window.localStorage
    	storage.clear()

    	this.setState({ 
    		opacity : this.props.opacity
    	})


    	contentListNoTitle['traj'] = (
    		<div>
				<div className='config-name'> 轨迹透明度 </div>
				<Slider className='config-wiget' 
					min={0.01}
	        		max={1} 
	        		step={0.01}
	        	defaultValue={this.props.opacity} onChange={this.onOpacityChange} />
        	</div>
    	)

    	contentListNoTitle['heat'] = (
    		<div>
				{/*<div className='config-name'> 图例 </div>*/}
				<div className='config-wiget-heat'>
					{Config.COLORS.map((c,i)=>{
						return (
							<div className='rect' style={{
								backgroundColor: c
							}}
							key={i}
							>
								{(i == 0 || i == Config.COLORS.length-1)?i * Config.countPerColor :i * Config.countPerColor}
							</div>)
					})}
				</div>
        	</div>
    	)	

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
		let { opacity,showIds,mapMode } = this.state


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



				{mapMode == 'traj' ? (
						<div className='map-views'>
						<Traj floor={1}  height={Config.mapHeight} width={Config.mapWidth} />
						<Traj floor={2} height={Config.mapHeight} width={Config.mapWidthHalf} />
						</div>
					):(
						<div className='map-views'>
						<Heatmap  floor={1} />
						<Heatmap  floor={2} />
						</div>
					)
				}

				<div className='map-floors'>
					<Rooms floor={1} height={Config.mapHeight} width={Config.mapWidth}  />
					<Rooms  floor={2}  height={Config.mapHeight} width={Config.mapWidthHalf} />
				</div>




		 		<Card
		          className='config-container'
		          tabList={tabListNoTitle}
		          activeTabKey={this.state.mapMode}
		          onTabChange={key => {
		            this.onTabChange(key, 'mapMode');
		          }}
		        >
		          {contentListNoTitle[this.state.mapMode]}
		        </Card>

		</div>


{/*			<div className='map-config'> 
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
*/}


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


	onTabChange = (key, type) => {
	    this.setState({ [type]: key });
	    this.props.changeMode(key)
	 };

}



const mapStateToProps = (state) => {
  return {
    opacity: state.opacityTraj,
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

     changeMode: (mode) => {
      let type = 'CHANGE_MAP_MODE'
      dispatch({ type, mode });
    },

  }
}

export default connect(mapStateToProps,mapDispatchToProps)(MyMap)
