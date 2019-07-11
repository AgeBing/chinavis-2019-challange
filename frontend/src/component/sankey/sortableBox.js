
import React, { useImperativeHandle, useRef } from 'react'
import { DragSource, DropTarget } from 'react-dnd'
import Box from './box.js'


import { nodeRectHeight ,nodeRectWidth } from './config'


const style = {
  height:nodeRectHeight,
  width:nodeRectWidth  
}

const SortableBox = React.forwardRef(
  ({ text, isDragging, connectDragSource, connectDropTarget,
  	 onDrop,index,hasNodes,onDelBox
   }, ref) => {

    const elementRef = useRef(null)
    connectDragSource(elementRef)
    connectDropTarget(elementRef)
    const opacity = isDragging ? 0 : 1
    
    useImperativeHandle(ref, () => ({
      getNode: () => elementRef.current,
    }))

    let left = index * (nodeRectWidth + 20)
    
    return (
      <div className='drop-node' ref={elementRef} style={{...style, left }} >
        <Box 
          onDrop={onDrop}
          index={index}
          hasNodes={hasNodes}
          onDelBox={onDelBox}
        />
      </div>
    )
  },
)

export default DropTarget(
  'box',
  {
    hover(props, monitor, component) {
      if (!component) {
        return null
      }
      // node = HTML Div element from imperative API
      const node = component.getNode()
      if (!node) {
        return null
      }
      const dragIndex = monitor.getItem().index
      const hoverIndex = props.index
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return
      }
      // Determine rectangle on screen
      const hoverBoundingRect = node.getBoundingClientRect()
      // Get vertical middle
      const hoverMiddleX =
        (hoverBoundingRect.right - hoverBoundingRect.left) / 2
      // Determine mouse position
      const clientOffset = monitor.getClientOffset()
      // Get pixels to the top
      const hoverClientX = clientOffset.x - hoverBoundingRect.left
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) {
        return
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) {
        return
      }
      // Time to actually perform the action
      props.onMoveBox(dragIndex, hoverIndex)
    },
  },
  connect => ({
    connectDropTarget: connect.dropTarget(),
  }),
)(
  DragSource(
    'box',
    {
      beginDrag: props => ({
        id: props.id,
        index: props.index,
      }),
    },
    (connect, monitor) => ({
      connectDragSource: connect.dragSource(),
      isDragging: monitor.isDragging(),
    }),
  )(SortableBox),
)
