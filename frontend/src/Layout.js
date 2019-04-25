import React, { Component } from 'react';

import './layout.css';
import { Row, Col } from 'antd';

import MyMap from './component/map/Map.js' 
import Tree from './component/tree/Tree.js'

class App extends Component {

	render(){
		return(
			<div>
			    <Row gutter={8} className='layout-app'>
			      

			      <Col span={16} className='layout-item '>
					<div className='layout-item-sub1 layout-view'>
						<MyMap />
					</div>
					<div className='layout-item-sub2 layout-view'>
						
					</div>
			      </Col>


			      <Col span={8} className='layout-item layout-view'>
			      		<Tree />
			      </Col>
			    </Row>
			</div>
		)
	}
}


export default App;
