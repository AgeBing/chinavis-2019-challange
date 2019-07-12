import React from 'react'
import { DragSource } from 'react-dnd'

import { Tag } from 'antd';

const roomMap = {0: "过道", 1: "展厅", 2: "主会场", 3: "分会场 A", 4: "签到处", 5: "分会场 B", 6: "分会场 C", 7: "分会场 D", 8: "海报区", 9: "厕所1", 10: "room1", 11: "room2", 12: "服务台", 13: "room3", 14: "room4", 15: "厕所2", 16: "餐厅", 17: "room5", 18: "休闲区", 19: "厕所3", 20: "room6", 21: "扶梯A", 22: "扶梯B", 23: "扶梯C", 24: "扶梯D"}
class Node extends React.Component{
  constructor() {
    super(...arguments)
    this.state = {
    }
  }

  render() {
    let { name, 
          isDropped, 
          isDragging, 
          connectDragSource,
          rid
           } = this.props

    const opacity = isDragging ? 0.4 : 1
    
    return connectDragSource(
      <div  className='node' style={{ opacity }}> 
          {   roomMap[rid]  }
      </div>
    )
  }
}

export default DragSource(
  'rid',  //type
  {
    beginDrag: props => ({ type:'rid',rid : props.rid }),
  },
  (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  }),
)(Node)
