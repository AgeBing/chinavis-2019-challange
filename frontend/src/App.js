import React, { Component } from 'react';
import './App.css';


import { Card,Switch,Icon,Spin  } from 'antd';


import  Sensors  from './component/Sensors'
import  Floor  from './component/Floor'
import  Rooms  from './component/Rooms'
import  Traj   from  './component/Traj'

import ConfigView from  './component/ConfigView'

import * as Config from './Config'

const tabList = [{
  key: 'floor1',
  tab: 'First Floor',
}, {
  key: 'floor2',
  tab: 'Second Floor',
}];

const mapContentList = {
   floor1 : 
      <div>
        <Floor height={Config.mapHeight} width={Config.mapWidth} /> 
        <Sensors  floor={1}  height={Config.mapHeight} width={Config.mapWidth} />
        <Rooms height={Config.mapHeight} width={Config.mapWidth} /> 
        {/*<Traj height={Config.mapHeight} width={Config.mapWidth} />*/}
       </div>,   
   floor2 : 
      <div>

        <Sensors  floor={2}  height={Config.mapHeight} width={Config.mapWidth} />
        <Floor height={Config.mapHeight} width={Config.mapWidth} /> 
       </div> ,

}


const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin id='loading-icon'/>;

class App extends Component {
  

  state = {
    key: 'floor1',
    loading: false,
  }

  onTabChange = (key, type) => {
    this.setState({ [type]: key });
  }

  render() {
    return (
      <div className="App">
        
        <Card  id='map-container' 
          activeTabKey={this.state.key}
          tabList={tabList}
          onTabChange={(key) => { this.onTabChange(key, 'key'); }}
          bodyStyle={bodyStyle}
        >
          { mapContentList[this.state.key] }
        </Card>

        <Card title='Config View'   id='config-container' > 
          <ConfigView />
        </Card>

        <Spin indicator={antIcon} spinning={this.state.loading} />
      </div>
    );
  }
}

const bodyStyle = {
  padding:'0px',
  position:'relative' 
}

export default App;
