import React from 'react'
import { DropTarget } from 'react-dnd'
import ItemType from './ItemType'
import Node from './Node'
import Links from './Links'
import CondiPanel from './CondiPanel'
import update from 'immutability-helper'
import { connect } from 'react-redux'

import { panelWidth,panelHeight,
		initalNodeX,initalNodeY,
		getRandId,getNewPosition } from './Config'


import './Panel.css'

import { _M2T,_T2M }  from './Config'

import { API_SYNC_Rooms } from '../../api/index'

const roomsMap = {}   // id => name

const panelStyle = {
  width: panelWidth,
  height: panelHeight,
}

class Panel extends React.Component {
  constructor() {
    super(...arguments)
    this.state = {
      nodes: {},
      links: [],

      showCondiPanel:false,
      defaultConditions:{},
      currentSourceID:0
    }
  }

  async componentWillMount(){
    let { nodes }  = this.state 


    // 初始 Node
    let rootId = getRandId()
    nodes[rootId] = {
    	id : rootId,
    	x : initalNodeX,
    	y : initalNodeY,
    	deleteAble: false,
      condition : {},
      choosen: true
    }


    let defaultConditions = {
      times : {},
      rooms: [],
      roomsId:[]
    }
     // 初始 time
    let { timeInterval } = this.props
    let startMinites = timeInterval.minites[0],
        endMinites   = timeInterval.minites[1],
        startTime    = '8:00',
        endTime      = '12:00'


    defaultConditions['times'][timeInterval.day] = {
      startMinites,
      endMinites,
      startTime,
      endTime
    }

    // 初始 Rooms
    await this.getRooms()
    let { rooms }  = this.props
    rooms.forEach((roomId)=>{
      defaultConditions.roomsId.push(
          roomId
      )
      defaultConditions.rooms.push(
          roomsMap[roomId]
      )
    })



    nodes[rootId]['condition'] = defaultConditions
    this.setState({ nodes })
  }



  render() {
    const { connectDropTarget } = this.props
    const { nodes , links ,showCondiPanel } = this.state
    return connectDropTarget(
      <div 	
      	style={panelStyle} 
      	className="panel" >  
        
        {Object.keys(nodes).map((key) => {
        	let node = nodes[key]
          
	          return (
	            <Node
	              key={node.id}
	              id={node.id}
	              x={node.x}
	              y={node.y}
	              delFlag={!node.deleteAble}
                ifChoosen={node.choosen}
	              hideSourceOnDrag={true}
	              handleNodeAdd={this.addCondition}
	              handleNodeDel={this.delNode.bind(this)}
                handleStateChage={this.chooseNode.bind(this)}
                condition={node.condition}
	            >
	            </Node>
	          )
        })}

      <Links links={links} />
      
      {  showCondiPanel && (
        <CondiPanel 
           hanldeAddCondition={this.addNode}
           hanldeCancel={this.hideCondiPanel}
           defaultConditions={this.state.defaultConditions}
           roomsMap={roomsMap}
        />
      )}

       
      </div>

    )
  }

  moveBox(id, x, y) {
  	let { links }  = this.state
    this.setState(
      update(this.state, {
        nodes : {
          [id]: {
            $merge: { x, y },
          },
        },
      }),
    )

    //updatelinks 
    links.forEach((link)=>{
    	Object.keys(link).forEach((key)=>{
    		if(link[key].id == id){
    			link[key].x =  x
    			link[key].y =  y
    		}
    	})
    })

    this.setState({links})

  }

  addNode = (condition)=>{
  	let { nodes,links,currentSourceID } = this.state 

    let sourceId = currentSourceID
  	let sourceNode = nodes[sourceId]
  	if(!sourceNode) return

  	let newId = getRandId(),
  		{ x,y } = getNewPosition(sourceNode.x , sourceNode.y)

  	sourceNode['deleteAble'] = false

  	let newNode =  {
      condition,
  		x,y,
  		id:newId,
  		deleteAble:true,
      choosen  : false,
  	}
  	nodes[newId] = newNode

  	links.push({
  		source: sourceNode,
  		target: newNode,
  	})

  	this.setState({ nodes,links })
    this.hideCondiPanel()    
  }

  delNode(deleteId){
  	let { nodes,links } = this.state
  	delete nodes[deleteId]


  	let i , sourceId
  	for(i = 0;i < links.length;i++){
  		if( links[i].target.id == deleteId ){  			
  			sourceId = links[i].source.id
  			break
  		}
  	}
  	links.splice(i ,1)

  	nodes[sourceId]['deleteAble'] = true

  	// 查看 sourceId 下是否还有 target
  	for(i = 0;i < links.length;i++){
  		if( links[i].source.id == sourceId ){ 
  			nodes[sourceId]['deleteAble'] = false
  			break;
  		}
  	}

  	this.setState({
  		nodes,links
  	})
  }
  chooseNode(sourceId){
    let { nodes } = this.state
    
    Object.keys(nodes).forEach((id)=>{
      if(id == sourceId){
        nodes[id]['choosen'] = true
        console.log('Current Condition:',nodes[id]['condition']  )
        this.props.changeState(nodes[id]['condition'] , sourceId)
      }else{
        nodes[id]['choosen'] = false
      }
    })


    this.setState({nodes})
  }


  showCondiPanel = ()=>{
    this.setState({
      showCondiPanel : true
    })
  }

  hideCondiPanel = ()=>{
    this.setState({
      showCondiPanel : false
    })
  }

  addCondition = (sourceId)=>{
    let { nodes,links } = this.state 
    
    let sourceNode = nodes[sourceId]
    if(!sourceNode) return


    this.setState({
      defaultConditions: sourceNode.condition,
      currentSourceID: sourceId
    })

    this.showCondiPanel()
  }

    // 初始化房间和名称 采用同步写法
  async getRooms(){
      let floors = [1,2]
      for(let i = 0;i < floors.length;i++){
        let floor = floors[i]
        let rooms = await API_SYNC_Rooms({ floor })
        rooms.forEach((room)=>{
           roomsMap[room.id] = room.name 
         })
      }
  }

}






//  dnd 部分
const type = ItemType.BOX
const targetSpec =  {
  drop(props, monitor, component) {   // called when a item is dropped on target
    if (!component) {   //该组件的实例     
      return null
    }
    const item = monitor.getItem()   //  获取 drag 对象 ，来自与 dragsource 的 beginDrag的返回    // monitor 为 DropTargetMonitor 的实例
    const delta = monitor.getDifferenceFromInitialOffset()
    const x = Math.round(item.x + delta.x)
    const y = Math.round(item.y + delta.y)
    component.moveBox(item.id, x, y)  //调用本组件的函数
  },
  // hover(props, monitor, component) { 
  //   if (!component) {     
  //     return null
  //   }
  //   const item = monitor.getItem() 
  //   const delta = monitor.getDifferenceFromInitialOffset()
  //   const x = Math.round(item.x + delta.x)
  //   const y = Math.round(item.y + delta.y)
  //   component.moveBox(item.id, x, y) 
  // },
}

function collect( connect , monitor ){
  return {
    connectDropTarget: connect.dropTarget(),
  }
} 


// redux
const mapStateToProps = (state) => {
  return {
    timeInterval: state.timeInterval,
    stateNodeId : state.stateNodeId,
    rooms: state.rooms
  }
}

const mapDispatchToProps = dispatch => {
  var timer,
    delay = 2000;

  return {
    changeState: (condition,id) => {
      // let change = checked ? "SHOW" : "HIDE";
      // let type = change + "_" + name.toLocaleUpperCase();

      let days = Object.keys(condition['times']),
          day , minites ,times
      if(!condition['times']){
          day = 1
          minites  = [0,0]
          times = ['0:00','0:00']
      }else{
         day = +days[0]
         minites = [
          condition['times'][day]['startMinites'],
          condition['times'][day]['endMinites']
         ]
         times = [
          condition['times'][day]['startTime'],
          condition['times'][day]['endTime']
         ]
      }
      let timeInterval = { day ,minites,times }
      let rooms = condition['roomsId']
      let stateNodeId  = id
      let type = 'CHANGE_STATE'

      dispatch({ type, timeInterval,stateNodeId,rooms });
    },
  }
}
let HOC = DropTarget(type , targetSpec , collect )(Panel)
export default connect(mapStateToProps,mapDispatchToProps)(HOC)

