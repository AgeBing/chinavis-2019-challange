import React from 'react'
import { DragDropContextProvider } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import Panel from './Panel'
import './tree.css'

class Tree extends React.Component{
	render(){
		return (
			<DragDropContextProvider backend={HTML5Backend}>
				<Panel />
			</DragDropContextProvider>
		)
	}
}

export default Tree;