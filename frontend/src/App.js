import React, { Component } from 'react';
import './App.css';

import  Sensors  from './component/Sensors'
import  Floor  from './component/Floor'
import  Rooms  from './component/Rooms'



class App extends Component {
  render() {
    return (
      <div className="App">

        <Floor height={650} width={1200} />
        <Sensors  floor={1}  height={650} width={1200} />
        <Rooms height={650} width={1200} />  
        {/*<Sensors  floor={2}  height={650} width={1200} />*/}


      </div>
    );
  }
}

export default App;
