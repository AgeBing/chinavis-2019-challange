import React from 'react'
import { DragSource } from 'react-dnd'

import { Tag } from 'antd';

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
          rid } = this.props
    const opacity = isDragging ? 0.4 : 1
    return connectDragSource(
      <div  className='node' style={{ opacity }}> 
          rid : {rid}
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
