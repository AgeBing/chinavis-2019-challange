import React, { Component } from 'react';

import { Modal,
		InputNumber,
		Select,
		Icon,
		Divider,
		Checkbox,
		TimePicker } from 'antd'

import moment from 'moment';

const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;
const format = 'HH:mm';


const dayOptions = [
  { label: 'Day 1', value: 1 },
  { label: 'Day 2', value: 2 },
  { label: 'Day 3', value: 3 },
];

const roomOptions = [ '会场', '休息区', '普通房间' ]

function _M2T(mins) {
  let h = Math.floor(mins/60)
  let m = mins % 60
  return  `${h}:${m}`
}

function _T2M(T) {
	let ts = T.split(':'),
		h = +ts[0] || 0,
		m = +ts[1] || 0
	return h * 60 + m
}

export default class CondiPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
    	checkedDays: [1],
    	times:{
    		1 : {
    			startTime:   '8:2',
    			endTime:     '12:00',
    		}
    	},
    	rooms:['会场', '休息区']
    };
  }



  initial = ()=>{
  }

  componentWillMount(){
  	let { times,rooms } = this.props.defaultConditions

  	let checkedDays = []

  	Object.keys(times).forEach((day)=>{
  		checkedDays.push(+day)
  		times[day]['startMinites'] = _T2M(times[day]['startTime'])
  		times[day]['endMinites'] = _T2M(times[day]['endTime'])
  	})

  	let stateTime = Object.assign({}, times)   //deep copy 
  	let stateRooms = [].concat(rooms)

  	this.setState({
  		checkedDays,
  		times: stateTime,
  		rooms: stateRooms
  	})
  }


  handleTimeChange = (day,order,time)=>{
  	let { times } = this.state

  	let date = time['_d'],
    	h = date.getHours(),
    	m  = date.getMinutes()

	times[day][order + 'Minites'] = h * 60 + m
	
	m =  ( m >= 10 ? ""+m : "0"+m )
  	times[day][order + 'Time'] =    h + ':' +m

  	this.setState({times})
  }
  handleDayChange = (checkedDays)=>{

  	let { times } = this.state
  	let defaultDays = Object.keys( this.props.defaultConditions.times )  // 返回 ["1","2"]

  	checkedDays.forEach((day)=>{
  		if( defaultDays.indexOf(""+day) != -1 ){
  			times[day] = Object.assign({} ,this.props.defaultConditions.times[day])
  		}else{
  			times[day] = {
  				'startTime' : '8:00',
  				'endTime'   : '18:00',
  				'startMinites':_T2M('8:00'),
  				'endMinites':_T2M('18:00')
  			}
  		}
  	})

  	let oldDays = Object.keys(times)

  	oldDays.forEach((day)=>{
  		if(checkedDays.indexOf(+day) == -1)
  			delete times[day]
  	})

  	this.setState({
  		checkedDays,
  		times
  	})
  }
  handleRoomChange = (checkedRooms)=>{
  	this.setState({
  		rooms:checkedRooms
  	})
  }

  hanleOK =()=>{
  	let { hanldeAddCondition }  = this.props
  	let { times,rooms } = this.state
  	hanldeAddCondition({ times ,rooms })
  }
  hanleCancel = ()=>{
  	let { hanldeCancel } = this.props
  	hanldeCancel()
  }

  render(){
  	let { defaultCondiions } = this.props

  	let { checkedDays,times,rooms }  = this.state

  	return(
  		<Modal
            title="添加条件"
            width={400}
            visible={true}
            onOk={this.hanleOK}
            onCancel={this.hanleCancel}
          >

{/*          <div className='condition-line'>
          	<div className='words'> 节点个数 </div> 
          	<InputNumber className='condis'
          		min={1} max={4} defaultValue={1}/>
          </div>
*/}
{/*          <div className='condition-line'>
          	<div className='words'> 条件类型 </div> 
          	 <Select className='condis'
                  placeholder="Select Condition Type" >
                      <Option value="time"><Icon type="clock-circle" /> 时间</Option>
                      <Option value="date"><Icon type="calendar" /> 日期 </Option>
                      <Option value="location"><Icon type="environment" />地点</Option>
                </Select>
          </div>*/}


         
         <Divider  orientation="left"> 时间 </Divider>

         <CheckboxGroup className='condition-line'
         	options={ dayOptions } defaultValue={checkedDays}  onChange={this.handleDayChange}/>

        { checkedDays.map((day)=>{
        	let startTime = times[day]['startTime'],
        		endTime   = times[day]['endTime']

        	return (
	         <div className='condition-line' key={day}>
		        <div className='words'> Day {day} </div> 

		        <div className='condition-line-half'>
		           <div className='words' > Start </div> 
		           <TimePicker className='condis' 
		           	defaultValue={moment(startTime,format)}
		           	onChange={this.handleTimeChange.bind(this,day,'start')}
		           	format={format} />
		        </div>
		         <div className='condition-line-half'>
		           <div className='words'> End </div> 
		           <TimePicker  className='condis' 
		           	defaultValue={moment(endTime,format)}
		           	onChange={this.handleTimeChange.bind(this,day,'end')}
		           	format={format} />
		        </div>
	        </div>
        )})}




        <Divider  orientation="left"> 地点 </Divider>
         <CheckboxGroup className='condition-line'
         	options={ roomOptions } defaultValue={rooms}
         		onChange={this.handleRoomChange}/>
         </Modal>
  	)
	}
 }