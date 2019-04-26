import React, { Component } from 'react';

import './tree.css'
import TimeSelect from './TimeSelect.js'
import { Modal, Button,Icon,InputNumber, Menu, Dropdown,Divider,Select } from 'antd';

const Option = Select.Option;


export default class Condition extends Component {
  constructor(props) {
    super(props);
    this.state = {
        add_node_num: 3,
        condition_type:null
    };
  }

  componentWillMount(){
    this.getTimeIntervals()
  }

  // 修改增加节点 个数 
  onChangeNodeNum =(value)=> {
    let self = this
    this.setState({
       add_node_num : value
    },()=>{
      self.getTimeIntervals()
    })

  }


  handleOk = ()=>{
    let { time_intervals } = this.state
    this.setState({
      add_node_num : 3
    })

    this.props.handleOk( time_intervals )
  }
  handleCancel = ()=>{
    this.setState({
      add_node_num : 3
    })
    this.props.handleCancel()
  }

  //根据子节点个数计算 推荐的时间区间
  getTimeIntervals(){
    let { current_add_condition } =  this.props
    let { add_node_num }  = this.state
    let interval = current_add_condition.time
    let timeLength = interval[1] - interval[0]
    let intervals = []
    let gap  = Math.floor(timeLength / add_node_num)
    for( let i = 0;i < add_node_num;i++){
      intervals.push(
        [interval[0]+i*gap , interval[0] + (i+1)*gap]
      )
    }

    this.setState({
      time_intervals : intervals
    })
  }
  timeChange = (id, new_interval)=>{
    let { time_intervals } = this.state

    time_intervals[id] = new_interval

    this.setState({ time_intervals })
  }

  changeType = (value)=>{
    this.setState({
      condition_type:value
    })
  }

  render() {
    let { time_intervals } = this.state
    return (
      <div>
          <Modal
            title="添加子节点"
            visible={this.props.modal_visible}
            mask={false}
            width={400}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
          >
            节点个数  <InputNumber min={1} max={4} defaultValue={3} onChange={this.onChangeNodeNum} value={this.state.add_node_num} />

            <div className='cond-container'>
                <Select 
                  placeholder="Select Condition Type"
                  style={{ width: '100%' }}
                  onChange={this.changeType}>
                      <Option value="time"><Icon type="clock-circle" /> 时间</Option>
                      <Option value="date"><Icon type="calendar" /> 日期 </Option>
                      <Option value="location"><Icon type="environment" />地点</Option>
                </Select>
          </div>

            <Divider />
            <div className='cond-container'>
              {
                time_intervals.map((interval,i)=>(
                  <TimeSelect suggest_times={interval} key={interval.join(',')} id={i}
                      timeChange={this.timeChange}
                  /> 
                ))
              }
            </div>

          </Modal>
      </div>
    );
  }
}
