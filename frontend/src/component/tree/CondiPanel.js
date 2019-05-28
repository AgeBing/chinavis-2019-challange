import React, { Component } from 'react';

import { Modal,
		InputNumber,
		Select,
		Icon,
		Divider,
		Checkbox,
		TimePicker,
    Row, Col,
    message,
    Radio   } from 'antd'

import moment from 'moment';
import { _M2T,_T2M }  from './Config'

const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;
const format = 'HH:mm';


const peopleModeOptions = [
  { label: '所有人员', value: 1 },
  { label: '当前选中人员', value: 2 }
];
const dayOptions = [
  { label: '第 1 天', value: 1 },
  { label: '第 2 天', value: 2 },
  { label: '第 3 天', value: 3 },
];
const roomOptions = [ "展厅", "主会场", "分会场 A", "签到处,", "分会场 B,", "分会场 C,", "分会场 D,", "海报区,", "厕所1,", "room1,", "room2,", "服务台,", "room3,", "room4,", "厕所2,", "餐厅,", "room5,", "休闲区,", "厕所3,", "room6,", "扶梯,", "扶梯,", "扶梯,", "扶梯,"]

let timeOption = {
  startTime : '8:00',
  endTime : '9:00'
}


export default class CondiPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectDay:1,
      selectPeopleMode:1 ,
      selectTime:{
          startTime : '8:00',
          endTime : '9:00',
          startMinites : 480,
          endMinites:540
      },
      rooms:[],
      roomCheckAll:false,
      indeterminate:false,
    };
  }


  componentWillMount(){
    let { selectTime,selectDay,rooms } = this.state
    let { mode,defaultConditions } = this.props

    if(mode == 'change'){ 
      let condition  = defaultConditions['condition'],
          _selectTime = condition['time'] ? { 
              startTime : condition['time']['startTime'],
              endTime   : condition['time']['endTime'],
              startMinites : condition['time']['startMinites'],
              endMinites : condition['time']['endMinites']
          } : selectTime ,
          _selectDay  =  condition['day'] ? condition['day'] : selectDay,
          _rooms      = condition['roomsId'] ? condition['roomsId']:rooms 
    
      this.setState({
         selectTime : _selectTime,
         selectDay  : _selectDay,
         rooms      : _rooms
      })
    }
  }

  // 确定 添加
  hanleOK =()=>{
    let { hanldeAddCondition,handleChangeCondition,
          roomsMap,mode,defaultConditions }  = this.props
    let { rooms,selectTime,selectPeopleMode,selectDay } = this.state
    let roomsName = rooms.map((id)=>roomsMap[id])


    if(rooms.length == 0){
       message.error('请选择至少一个房间!')
      return
    }

    if(mode == 'add'){
      hanldeAddCondition({
        peopleMode : selectPeopleMode ,
        time:selectTime ,
        rooms:roomsName,
        roomsId:rooms,
        day:selectDay,
      })
    }else{

      let ifConditionChanged = false
      if( defaultConditions.condition.day != selectDay ||
          defaultConditions.condition.roomsId.toString() != rooms.toString() ||
          defaultConditions.condition.time.startMinites != selectTime.startMinites ||
          defaultConditions.condition.time.endMinites != selectTime.endMinites  ){
        ifConditionChanged = true
      console.log(defaultConditions,selectTime,rooms,selectDay)
      }


      handleChangeCondition({
        peopleMode : selectPeopleMode ,
        time:selectTime ,
        rooms:roomsName,
        roomsId:rooms,
        day:selectDay,
      }, ifConditionChanged)
    }
  }
  // 取消
  hanleCancel = ()=>{
    let { hanldeCancel } = this.props
    hanldeCancel()
  }
  handleTimeChange = (day,order,time)=>{
  	let { selectTime } = this.state

  	let date = time['_d'],
    	h = date.getHours(),
    	m  = date.getMinutes()
	  selectTime[order + 'Minites'] = h * 60 + m
	   m =  ( m >= 10 ? ""+m : "0"+m )
  	selectTime[order + 'Time'] =    h + ':' +m

  	this.setState({selectTime})
  }
  handlePeopleModeChange = (e)=>{
    this.setState({
      selectPeopleMode : e.target.value
    })
  }
  handleDayChange = (e)=>{
    let selectDay = e.target.value
    this.setState({
      selectDay
    })
  }
  handleRoomChange = (checkedRooms)=>{
   let { roomsMap } = this.props
  	this.setState({
  		rooms:checkedRooms,
      roomCheckAll:  Object.keys(roomsMap).length === checkedRooms.length,
      indeterminate: !!checkedRooms.length && Object.keys(roomsMap).length > checkedRooms.length
  	})
  }
  handleRoomChangeAll =( event)=>{
   let { roomsMap } = this.props
   let checked = event.target.checked

   let allRooms = Object.keys(roomsMap).map((key)=>+key)

    this.setState({
        rooms: checked ? allRooms : [],
        indeterminate : false,
        roomCheckAll: checked
    })

  }

  render(){
  	let { defaultConditions,roomsMap,mode } = this.props

  	return(
  		<Modal
            title={mode == 'add' ? "添加节点" : "修改条件"}
            width={400}
            visible={true}
            onOk={this.hanleOK}
            onCancel={this.hanleCancel}
          >

         <Divider  orientation="left"> 人员选择 </Divider>
          <RadioGroup className='condition-line'
             onChange={this.handlePeopleModeChange} value={this.state.selectPeopleMode} >
              {peopleModeOptions.map((d)=>
                  (<Radio value={d.value}>{d.label}</Radio>)
              )}
          </RadioGroup>


         
         <Divider  orientation="left"> 时间选择 </Divider>
          <RadioGroup className='condition-line'
             onChange={this.handleDayChange} value={this.state.selectDay} >
              {dayOptions.map((d)=>
                  (<Radio value={d.value}>{d.label}</Radio>)
              )}
          </RadioGroup>

	       <div className='condition-line'>
		           <div className='words'> Day {this.state.selectDay} </div> 

		          <div className='condition-line-half'>
		           <div className='words' > Start </div> 
		           <TimePicker className='condis' 
		           	defaultValue={moment(timeOption.startTime,format)}
		           	onChange={this.handleTimeChange.bind(this,this.state.selectDay,'start')}
		           	format={format} />
		          </div>
		          <div className='condition-line-half'>
		           <div className='words'> End </div> 
		           <TimePicker  className='condis' 
		           	defaultValue={moment(timeOption.endTime,format)}
		           	onChange={this.handleTimeChange.bind(this,this.state.selectDay,'end')}
		           	format={format} />
	            </div>
	        </div>




        <Divider  orientation="left"> 地点选择 </Divider>
        
         <div className='condition-line' >
            <Checkbox value={'all'} style={{margin: '0 auto'}}
             onChange={this.handleRoomChangeAll}
             indeterminate={this.state.indeterminate}
             checked={this.state.roomCheckAll}>
              全部
            </Checkbox>
         </div>

         <Checkbox.Group className='condition-checkbox'
         defaultValue={defaultConditions['roomsId']}
         		onChange={this.handleRoomChange}
            value={this.state.rooms}
            >
               <Row>
                  {Object.keys(roomsMap).map((key)=>{
                     let id = +key,
                        name = roomsMap[id]
                     return( 
                      <Col span={8} key={id}>
                          <Checkbox value={id}>{name}</Checkbox>
                      </Col>
                  )})}
              </Row>
          </Checkbox.Group>

         </Modal>
  	)
	}
 }