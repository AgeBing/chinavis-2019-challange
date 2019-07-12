import React, { useImperativeHandle, useRef }  from 'react'
import { DragSource,DropTarget } from 'react-dnd'
import Node from './node.js'


import { Tag,
    Icon,
    Button
 } from 'antd';

import { nodeRectHeight ,nodeRectWidth } from './config'

console.log(nodeRectHeight ,nodeRectWidth)
const style = {
  height:nodeRectHeight,
  width:nodeRectWidth  
}


class Box extends React.Component {
  constructor(){
    super(...arguments)
    this.state = {}
  }

  handleDel = ()=>{
    this.props.onDelBox(this.props.index)
  }
  render(){
    let {
      isOver,
      canDrop,
      connectDropTarget,
      isDragging,
      index,
      hasNodes,
    } = this.props


    const isActive = isOver && canDrop
    
    let backgroundColor = 'gray'
    if (isActive) {
      backgroundColor = 'gray'
    } else if (canDrop) {
      backgroundColor = 'darkkhaki'
    }
    let left = index * (nodeRectWidth + 20)

    return connectDropTarget(
      <div  style={{ ...style  }} className='box-node'> 
        {
          (index != 'default') && (
            <div className=' node-header'>
              <div className='index-word'>
                {index+1}
              </div>
              <div className='config-box'>
                <Button icon="minus-circle"  onClick={this.handleDel}/>
              </div>
            </div>
          )
        }

         { hasNodes.map((rid,i)=>{
             return (<Node 
                  key={i}
                  rid = {rid}
                  isDropped={()=>true}
              />)
          })}

      </div>
    ) 
  }
}



export default  DropTarget(
  'rid',
  {
    drop(props, monitor) {
      props.onDrop(monitor.getItem(),{id: props.index})
    },
  },
  (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
  }),
)(Box)
