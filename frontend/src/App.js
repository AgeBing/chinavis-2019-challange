import React, { Component } from 'react';
import './App.css';
import { Card,Switch,Icon,Spin  } from 'antd';

import  Floor  from './component/Floor'
import ConfigView from  './component/ConfigView'


const tabList = [{
  key: '1',
  tab: 'First Floor',
}, {
  key: '2',
  tab: 'Second Floor',
}];




const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin id='loading-icon'/>;

class App extends Component {
  

  state = {
    key: '1',
    loading: false
  }

  handleTabChange = (key, type) => {
    this.setState({ [type]: key })
  }

  render() {
    return (
      <div className="App">
        
        <Card  id='map-container' 
          activeTabKey={this.state.key}
          tabList={tabList}
          onTabChange={(key) => { this.handleTabChange(key, 'key'); }}
          bodyStyle={bodyStyle}
        >
            <Floor   floor={this.state.key} />
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
