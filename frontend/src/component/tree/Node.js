import React from 'react'
import { DragSource } from 'react-dnd'
import ItemType from './ItemType'

import { Button,Icon,Tag } from 'antd';

import { nodeRectWidth,nodeRectHeight } from './Config'

const style = {
  width: nodeRectWidth,
  height: nodeRectHeight
}

class Node extends React.Component{
  constructor() {
    super(...arguments)
    this.state = {
    }
  }

  onHandleAdd(){
      let { handleNodeAdd,id }  = this.props
      handleNodeAdd(id)
  }

  onHandleDel(){
      let { handleNodeDel,id }  = this.props
      handleNodeDel(id)
  }
  onHandleChangeState(){
      let { handleStateChage,id }  = this.props
      handleStateChage(id)
  }

  showConditions(){
    let { condition } = this.props
    let show = []

    if(!condition.hasOwnProperty('times')) return

    if( condition['times'] ){
        let days = Object.keys(condition['times'])
        days.forEach((day)=>{
          show.push(
              <Tag className='cond-line' key={'time'+day}>
                <Icon type="clock-circle" /> 
                {' '}D{day}|{condition['times'][+day]['startTime']}~{condition['times'][+day]['endTime']}
              </Tag>
          )
        })
    }

    // 展示分割
    let roomsStr = ' ',
        maxSL = 9
    condition['rooms'].forEach((room,i)=>{
       roomsStr += (room + ' ')
    })
    if(roomsStr.length > maxSL){
      roomsStr = roomsStr.slice(0,maxSL)
      roomsStr += '...'
    }

    if( condition['rooms'] && condition['rooms'].length > 0){
          show.push(
              <Tag className='cond-line' key={'rooms'}>
                    <Icon type="home" />  
                    {roomsStr}
              </Tag>
          )
    }
    if( show.length == 0){
          show.push(
            <span>无条件</span>
          )
    }
    return show
  }
  render(){
    const {
      hideSourceOnDrag,
      x,
      y,
      delFlag,
      ifChoosen,
      connectDragSource,
      isDragging,
      children,
      id,
      handleNodeAdd,
      condition
    } = this.props

    if (isDragging && hideSourceOnDrag) {
      return null  // 不显示 否则会有拖影
    }
    return connectDragSource(
      <div 
        className={ifChoosen?'node-rect node-rect-choosen':'node-rect'}
        style={Object.assign({}, style, { 'left':x, 'top':y })}>

        <div className='conditions-contain'>
              {this.showConditions()}
        </div>


        <div className="config-contain">
          <div className='config-box'>
            <Button icon="minus-circle"  
              onClick={this.onHandleDel.bind(this)}
              disabled={delFlag}/>
          </div>
          <div className='config-box'>
            <Button icon="plus-circle" onClick={this.onHandleAdd.bind(this)} />
          </div>
          <div className='config-box'>
            <Button icon="swap" 
               onClick={this.onHandleChangeState.bind(this)}
               disabled={ifChoosen} />
          </div>
        </div>
      </div>
    )
  }
}


const type = ItemType.BOX

const sourceSpec =  {
    beginDrag(props) {   // Required  
      const { id, x, y } = props   // component's current props
      return { id, x, y }    // 返回的 obj 会传给 dropTarget 
    },
}

// pass dragging state to  component 
function collect( connect , monitor ){
  return {
    connectDragSource: connect.dragSource(),   // 到 props, 然后在 render 里面包裹 dom ; 
    // connect this source DOM to Dnd backend   ; connectDragSource 的 实例
    isDragging: monitor.isDragging(),
    //  DragSourceMonitor 的 实例 ； 获取当前 state 
  }
} 


export default DragSource( type , sourceSpec , collect )(Node)
