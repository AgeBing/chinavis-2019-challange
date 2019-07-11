import React from 'react'
import { DragDropContextProvider } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import { Group } from './group'

class GroupPanel extends React.Component{
	render(){
		return (
			<DragDropContextProvider backend={HTML5Backend}>
				<Group />
			</DragDropContextProvider>
		)
	}
}

export default GroupPanel;