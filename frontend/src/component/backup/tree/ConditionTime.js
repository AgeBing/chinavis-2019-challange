import React, { Component } from 'react';

import { Checkbox,TimePicker,Divider } from 'antd';
import moment from 'moment';

const CheckboxGroup = Checkbox.Group;

const format = 'HH:mm';


const dayOptions = [
  { label: 'Day1', value: 1 },
  { label: 'Day2', value: 2 },
  { label: 'Day3', value: 3 },
];


function mins2str(mins) {
  let h = Math.floor(mins/60)
  let m = mins % 60
  return  `${h}:${m}`
}


export default class TimeSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      days:[1],
      start_value:null,
      start_time:'8:2',
      end_value:null,
      end_time:'12:00',
      time_disable:false
    };
  }
  componentWillMount(){
    let { suggest_times } = this.props

    let start_time = mins2str(suggest_times[0])
    let end_time = mins2str(suggest_times[1])
    let start_value = moment(start_time, format)
    let end_value = moment(end_time, format)

    this.setState({
      start_time,end_time,
      start_value,end_value
    })
  }

  onChangeDay = (days) => {

      let start_time,end_time,time_disable

      if( days.length > 1){
        time_disable = true
        start_time='0:00'
        end_time = '0:00'
      }else{
        start_time = this.state.start_time
        end_time = this.state.end_time
      }

      this.setState({ 
        days,time_disable,
        start_time,end_time
      })
  }
  onChange = (order,time) => {
    let { suggest_times,timeChange,id } = this.props

    let date = time['_d']
    let hour = date.getHours()
    let min  = date.getMinutes()
    
    suggest_times[order] =  hour * 60 + min

    timeChange(id,suggest_times)
  }

  render() {

    return (
      <div className='cond-time-line'>
{/*        <div className='cond-time-line'>
          <CheckboxGroup options={dayOptions} defaultValue={this.state.days} onChange={this.onChangeDay} />
        </div>*/}
        <div className='cond-time-line-half'>
           <span> 开始时间</span> 
           <TimePicker className='cond-item' defaultValue={moment(this.state.start_time, format)} format={format}  onChange={this.onChange.bind(this,0)}  disabled={this.state.time_disable}/>
        </div>
         <div className='cond-time-line-half'>
           <span>结束时间</span> 
           <TimePicker  className='cond-item' defaultValue={moment(this.state.end_time, format)} format={format}  onChange={this.onChange.bind(this,1)}  disabled={this.state.time_disable}/>
        </div>

      </div>
    );
  }
}



