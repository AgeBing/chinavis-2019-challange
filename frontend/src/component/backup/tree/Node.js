import React, { Component } from 'react';

import { Card,Icon } from 'antd';

export default class Node extends Component {
  constructor(props) {
    super(props);
    this.state = {
        prevLocation:{
          x: 0 ,
          y: 0 
        }
    };
  }


  componentDidMount(){
    let { prevLocation } = this.state
    let { path, updateNodeLocation } = this.props

    let location = this.nodeDOM.getBoundingClientRect()// 该 node 的 绝对位置

    // 位置变化
    if( prevLocation.x != location.x  || prevLocation.y != location.y){

       this.setState({
          prevLocation : {
            x : location.x,
            y : location.y
          }
       })
       updateNodeLocation( path, location  )
    }
  }

  componentDidUpdate(){
    let { prevLocation } = this.state
    let { path, updateNodeLocation } = this.props

    let location = this.nodeDOM.getBoundingClientRect()// 该 node 的 绝对位置

    // 位置变化
    if( prevLocation.x != location.x  || prevLocation.y != location.y){


       this.setState({
          prevLocation : {
            x : location.x,
            y : location.y
          }
       })
       updateNodeLocation( path, location  )
    }
  }
  addNodes(){   //在当前 节点后面创建 几个节点
      
    return 
    let { path,addNodesInTree } = this.props 
    addNodesInTree(path)

  }
  changeSelectState(){
    let { path,stateChangeInTree } = this.props 
    stateChangeInTree(path)
  }


  hanldeAdd(e){
     // console.log('click on icon')
     e.stopPropagation();  // 避免 事件 向下传递
    let { path,addNodesInTree } = this.props 
    addNodesInTree(path)
  }

  hanldeDel(){
    let { path,delNodesInTree } = this.props 
    delNodesInTree(path)
  }

  render() {
    let { name,path,hasChild,hasEndChild,isSelected }  = this.props

    let bgColor = ( isSelected == true ? '#40a9ff' : null)

    return (
      <div className='card' ref={dom => {this.nodeDOM = dom}} onClick={this.changeSelectState.bind(this)} style={{ backgroundColor: bgColor }} >
          
          <div className='card-content'>
            {name}
          </div>
          <div className='card-icons'>
          {  !hasChild && 
              ( <Icon type="plus-circle" onClick={this.hanldeAdd.bind(this)}  className='card-icon card-icon-add' /> )
          }
          {
              hasEndChild && 
              ( <Icon type="minus-circle" onClick={this.hanldeDel.bind(this)}  className='card-icon card-icon-del' /> )
          }
          </div>
      </div>
    );
  }
}
