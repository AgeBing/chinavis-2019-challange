import React from 'react'
import { DropTarget } from 'react-dnd'
import './Panel.css'
import ItemType from './ItemType'
import Node from './Node'
import Links from './Links'
import CondiPanel from './CondiPanel'
import update from 'immutability-helper'
import { connect } from 'react-redux'

import { _M2T,_T2M,
    panelWidth,panelHeight,
		initalNodeX,initalNodeY,
		getRandId,getNewPosition,
    nodeRectWidth,nodeRectHeight } from './Config'

import { Icon,  } from 'antd';
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
      conditionPanelMode:'add' | 'change',
      conditionChange:{
        condition:{},
        id:0
      },
      defaultConditions:{},
      currentSourceID:0
    }
  }



  async componentWillMount(){
    let { nodes }  = this.state 


    // 初始 Node
    let rootId = getRandId()
    let defaultConditions = {}
    let { timeInterval } = this.props
    let startMinites = timeInterval.minites[0],
        endMinites   = timeInterval.minites[1],
        startTime    = '8:00',
        endTime      = '12:00'


    defaultConditions = {
      time:{
        startTime,
        startMinites,
        endTime,
        endMinites
      },
      day:1,
      peopleMode:1,
      rooms:[],
      roomsId:[]
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


    this.addNode(defaultConditions)
  }



  render() {
    const { connectDropTarget } = this.props
    const { nodes , links ,showCondiPanel } = this.state
    
    return connectDropTarget(
      <div>
      <div 	
      	style={panelStyle} 
      	className="panel" >  

        <div  className='add-node'  
          style={{
              height:nodeRectHeight,
              width:nodeRectWidth
          }}
          onClick={this.addNodeButtonHandler}
        >
          <span>
              <Icon type='plus' />
              <div className="ant-upload-text">
              添加节点
              </div>
          </span>
        </div>


        {Object.keys(nodes).map((key) => {
        	let node = nodes[key]
          
	          return (
	            <Node
	              key={node.id}
	              id={node.id}
	              x={node.x}
	              y={node.y}
	              delFlag={!node.deleteAble}
                chaFlag={!node.changeAble}
                ifChoosen={node.choosen}
	              hideSourceOnDrag={true}
	              handleConditionChange={this.changeNodeConditionHandler}
	              handleNodeDel={this.delNode.bind(this)}
                handleStateChage={this.chooseNode.bind(this)}
                condition={node.condition}
                handleUnionTwoNode={this.unionTwoNode}
	            >
	            </Node>
	          )
        })}

      
      {  showCondiPanel && (
        <CondiPanel 
           hanldeAddCondition={this.addNode}
           handleChangeCondition={this.changeCondition}
           hanldeCancel={this.hideCondiPanel}
           defaultConditions={this.state.conditionChange}
           roomsMap={roomsMap}
           mode={this.state.conditionPanelMode}
        />
      )}
      
       </div>
       <Links links={links} />
      </div>
    )
  }

  // 点击添加节点按钮触发
  addNodeButtonHandler=()=>{
    this.setState({
      conditionPanelMode : 'add'
    })
    this.showCondiPanel()
  }

  changeNodeConditionHandler =(id)=>{
    let {nodes} = this.state
    this.setState({
      conditionPanelMode : 'change',
      conditionChange: {
        condition : nodes[id]['condition'],
        id
      }
    })
    this.showCondiPanel()
  }


  // 拖动节点时触发
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
    /*[{
        source: { id1:{ x,y},id2:{ x,y} },
        target: { id : {x,y}}
    }]*/
    links.forEach((link)=>{
      if(link.source[id]){
        link.source[id].x = x
        link.source[id].y = y
      }
      if(link.target[id]){
        link.target[id].x = x
        link.target[id].y = y
      }
    })
    this.setState({links})
  }

  // 从 conditionPanel 中获取 condition ，并添加至全局 nodes 中
  addNode = (condition,sourceNodes)=>{
  	let { nodes,links,currentSourceID } = this.state 

  	let newId = getRandId(),
  		{ x,y } = getNewPosition()

  	let newNode =  {
      condition,
  		x,y,                 //位置
  		id:newId,            //nodes[id]查找
  		deleteAble : true,  //是否可删除
      changeAble : true,  // 是否可更改条件
      choosen  : false,  //是否为选中
  	}
  	nodes[newId] = newNode

    if(sourceNodes){
      let sourceA = sourceNodes[0],
          sourceB = sourceNodes[1],
          positionA = { x : nodes[sourceA]['x'] ,  y : nodes[sourceA]['y'] },
          positionB = { x : nodes[sourceB]['x'] ,  y : nodes[sourceB]['y'] }

      let newLink = {}
      newLink['target'] = {}
      newLink['target'][newId] = { x,y }
      newLink['source'] = {}
      newLink['source'][sourceA] = positionA 
      newLink['source'][sourceB] = positionB
      links.push(newLink)

      //设置为不可删除
      nodes[sourceA]['deleteAble'] = false
      nodes[sourceB]['deleteAble'] = false
      nodes[sourceA]['changeAble'] = false
      nodes[sourceB]['changeAble'] = false
    }

  	this.setState({ nodes,links })
    this.hideCondiPanel()    
  }

  // 删除节点
  delNode(deleteId){
  	let { nodes,links } = this.state

    // 删除目标节点
  	delete nodes[deleteId]

    // 删除 link
  	let i , sourceIds = []
  	for(i = 0;i < links.length;i++){
  		if( links[i].target[deleteId] != null){  			
  			sourceIds = Object.keys(links[i].source)
  			break;
  		}
  	}
  	links.splice(i ,1)

  	nodes[sourceIds[0]]['deleteAble'] = true
    nodes[sourceIds[1]]['deleteAble'] = true
    nodes[sourceIds[0]]['changeAble'] = true
    nodes[sourceIds[1]]['changeAble'] = true

  	// 查看 sourceId 下是否还有 target
  	for(i = 0;i < links.length;i++){
      for(let j = 0;j < 2;j++){
        let _id = sourceIds[j]
        if( links[i].source[_id] != null ){ 
            nodes[_id]['deleteAble'] = false
            nodes[_id]['changeAble'] = false
        }
      }
  	}

  	this.setState({
  		nodes,links
  	})
  }

  // 选中某个节点，切换状态 
  chooseNode(sourceId){
    let { nodes } = this.state
    
    Object.keys(nodes).forEach((id)=>{
      if(id == sourceId){
        nodes[id]['choosen'] = true
        console.log('Current Condition:',nodes[id]['condition']  )
        this.props.changeState(nodes[id]['condition'] , id)
      }else{
        nodes[id]['choosen'] = false
      }
    })


    this.setState({nodes})
  }

  unionTwoNode =(aId,bId)=>{
    // 获取两个node 的 ids 
    let { nodes } = this.state
    let nodeA = nodes[aId],
        nodeB = nodes[bId],
        uidsA = nodeA['condition']['uids'],
        uidsB = nodeB['condition']['uids'],
        uidsUnion = uidsA.filter(function(u){ return uidsB.indexOf(u) > -1 })  // 考虑NAN
    // 取交集

    // console.log(uidsA,uidsB,uidsUnion)
    // 添加新节点
    let condition = {
      uids : uidsUnion
    },sourceNodes = [aId,bId]

    this.addNode(condition , sourceNodes)
  }

  // 修改节点的条件
  changeCondition = (condition , ifChanged)=>{
    if(ifChanged){
      let { conditionChange,nodes } = this.state
      let { id } = conditionChange
      nodes[id]['condition'] = condition
      this.setState({
         nodes
      })
      if(nodes[id]['choosen'] = true){
         this.props.changeState(nodes[id]['condition'] , id)
      }
    }
    this.hideCondiPanel()
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
    if(!delta || !item)  return
    const x = Math.round(item.x + delta.x)
    const y = Math.round(item.y + delta.y)
    component.moveBox(item.id, x, y)  //调用本组件的函数
  },
  // hover(props, monitor, component) {  // 拖动的时候也触发
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
      let { day,roomsId,time,uids  } = condition
      
      let rooms , timeInterval 
      if(day != null && roomsId != null && time !=null ){
            rooms  = roomsId
            timeInterval = {
              day : day,
              minites : [
                  time.startMinites,
                  time.endMinites
              ],
              times: [
                  time.startTime,
                  time.endTime
              ]
            }

      }else{//考虑 condition 为空的情况 ， 即只有 ids 
          
          rooms = []  // 空表示所有，在sql语句中实现
          timeInterval = {  // 默认
               day : 1,
               minites:[
                  480,
                  1080
               ],
               times:[
                  '8:00',
                  '18:00'
               ]
          }
      }

      

      let type = 'CHANGE_STATE',
          stateNodeId = id,
            ids = uids

      dispatch({ type, timeInterval,stateNodeId,rooms,ids });
    },
  }
}
let HOC = DropTarget(type , targetSpec , collect )(Panel)
export default connect(mapStateToProps,mapDispatchToProps)(HOC)

