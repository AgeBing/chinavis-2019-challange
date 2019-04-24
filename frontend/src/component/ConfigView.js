import React, { Component } from 'react';
import { connect } from 'react-redux'

import { Card, Icon, Avatar ,Switch,Radio,Divider,Slider} from 'antd';







class ConfigView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dayValue : 1,
      marks:{
      }
    };
  }


  componentWillMount(){

    let { day,startHour,endHour } = this.props
    
    let newMarker = {}
      newMarker[startHour] = `${startHour}:00`
      newMarker[endHour] = `${endHour}:00`
    this.setState({ 
      dayValue:day,
      marks:newMarker,
      startHour,
      endHour
    })

  }

  render() {
    let { onChangeDisplay ,onChangeDay,onChangeHour,
      showSensors,showBricks,showRooms,showTrajs ,showHotmap} = this.props 
    
    let { dayValue,marks,startHour,endHour } = this.state
    return (
      <div>
          <Divider orientation="left">显示设置</Divider>
          <Switch  checkedChildren="传感器" unCheckedChildren="传感器" 
             checked={showSensors}
             onChange={(checked)=> onChangeDisplay('sensor',checked)} />
          <Switch  checkedChildren="房间" unCheckedChildren="房间"  
              checked={showRooms}
             onChange={(checked)=> onChangeDisplay('room',checked)} />
          <Switch  checkedChildren="轨迹" unCheckedChildren="轨迹"   
              checked={showTrajs}
             onChange={(checked)=> onChangeDisplay('traj',checked)} />
          <Switch  checkedChildren="热力图" unCheckedChildren="热力图"   
              checked={showHotmap}
             onChange={(checked)=> onChangeDisplay('Hotmap',checked)} />
          


          <Divider orientation="left">时间选择</Divider>
          <Radio.Group onChange={onChangeDay.bind(this)} value={dayValue}>
            <Radio value={1}>Day 1</Radio>
            <Radio value={2}>Day 2</Radio>
            <Radio value={3}>Day 3</Radio>
          </Radio.Group>

          <Slider range step={1} marks={marks} defaultValue={[startHour,endHour]} 
                  min={0} max={23} tipFormatter={(val)=>`${val}:00`}
                  onChange={onChangeHour.bind(this)}
                   />

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
    showTrajs: state.showTrajs,
    showHotmap:state.showHotmap,
    day : state.day,
    startHour:state.startHour,
    endHour:state.endHour
  }
}

const mapDispatchToProps = (dispatch) => {

   var timer,
        delay = 2000

  return {
    onChangeDisplay: (name , checked) => {
      let change =  checked ? 'SHOW' : 'HIDE'
      let type = change + '_' + name.toLocaleUpperCase()
      dispatch({ type, checked})
    },

    onChangeDay:function(e){
      let value = e.target.value
      this.setState({ dayValue: value})
      let type = 'SWITCH_DAY'
    

      delay = 500
      clearTimeout(timer)
      timer = setTimeout(function () {

        dispatch({ type:type , day:value})
      
      }, delay)

    },

    onChangeHour:function(v){
      let startHour = v[0],
          endHour   = v[1]
      let type = 'SWITCH_HOUR'

      clearTimeout(timer)
      timer = setTimeout(function () {
        dispatch({ type , startHour ,endHour })
      }, delay)


      let newMarker = {}
      newMarker[startHour] = `${startHour}:00`
      newMarker[endHour] = `${endHour}:00`

      this.setState({
        marks:newMarker
      })

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