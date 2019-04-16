import React, { Component } from 'react';
import { connect } from 'react-redux'

import { Card, Icon, Avatar ,Switch,Radio,Divider,Slider} from 'antd';




const marks = {
  9  : '9:00',
  14 : '14:00',
};





class ConfigView extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    let { onChange ,showSensors,showBricks,showRooms,showTrajs } = this.props 
    return (
      <div>
          <Divider orientation="left">显示设置</Divider>
          <Switch  checkedChildren="传感器" unCheckedChildren="传感器" 
             checked={showSensors}
             onChange={(checked)=> onChange('sensor',checked)} />
          <Switch  checkedChildren="房间" unCheckedChildren="房间"  
              checked={showRooms}
             onChange={(checked)=> onChange('room',checked)} />
          <Switch  checkedChildren="轨迹" unCheckedChildren="轨迹"   
              checked={showTrajs}
             onChange={(checked)=> onChange('traj',checked)} />
          


          <Divider orientation="left">时间选择</Divider>
          <Radio.Group onChange={onChange} value={1}>
            <Radio value={1}>Day 1</Radio>
            <Radio value={2}>Day 2</Radio>
            <Radio value={3}>Day 3</Radio>
          </Radio.Group>
          <Slider range step={1} marks={marks} defaultValue={[9,14]} min={0} max={23} tipFormatter={(val)=>`${val}:00`} />

          <Divider orientation="left">轨迹样式设置</Divider>
          透明度  <Slider step={0.1}  defaultValue={0.5} min={0} max={1} style={sliderStyle} />

      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    showSensors: state.showSensors,
    showBricks: state.showBricks,
    showRooms: state.showRooms,
    showTrajs: state.showTrajs
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onChange: (name , checked) => {
      let change =  checked ? 'SHOW' : 'HIDE'
      let type = change + '_' + name.toLocaleUpperCase()
      dispatch({ type, checked})
    }
  }
}


const sliderStyle ={
    width: '70%',
    display: 'inline-block',
    float: 'right',
    marginTop: '5px',
}
const gridStyle = {
  width: '100%',
  textAlign: 'center',
};


export default connect(mapStateToProps,mapDispatchToProps)(ConfigView)