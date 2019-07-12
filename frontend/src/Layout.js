import React, { Component } from 'react';

import { DragDropContextProvider } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'


import './layout.css';
import { Row, Col } from 'antd';

import MyMap from './component/map/Map.js' 
import Panel from './component/tree/Panel.js'
// import Sankey from './component/sankey/index.js'
import Sankey from './component/sankey/sankey.js'


import TimeLine from './component/time/time.js'

class App extends Component {

	render(){
		return(
		<DragDropContextProvider backend={HTML5Backend}>
			<div>
			    <Row gutter={8} className='layout-app'>
			 
			      <Col span={16} className='layout-item '>
					<div className='layout-item-sub1'>
						<MyMap />
						
					</div>
					<div className='layout-item-submid layout-view'>
						<TimeLine />
					</div>					
					<div className='layout-item-sub2 layout-view'>
						<Sankey/>
					</div>
			      </Col>

			      <Col span={8} className='layout-item layout-view' 
			      		style={{ marginTop: '6px' }}>
			      		<Panel />
			      </Col>
			    </Row>
			</div>
			</DragDropContextProvider>
		)
	}
}


export default App;
