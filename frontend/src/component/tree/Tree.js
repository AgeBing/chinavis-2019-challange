import React, { Component } from 'react';
import './tree.css'

import Layer from './Layer.js'
import Links from './Links.js'

import Condition from './Condition.js'

import { Modal, Button,Icon,InputNumber, Menu, Dropdown,Divider } from 'antd';

import { findConditions }  from './util.js'

import { connect } from "react-redux";


const ButtonGroup = Button.Group

let nodes_location = {}
function  treeToLayer( tree ){
  let _layers = []
  let queue = []
  queue[0] = tree
    // 广度优先遍历
    function processQueue() {
      var i, childCount, node,level;
      if (queue.length === 0) {
        return;
      }
      node = queue.shift();
      level = node.path.length
      if(_layers[level-1] === undefined){
        _layers[level-1] = []
      }
      _layers[level-1].push(node)

      for (i = 0, childCount = node.childNum; i < childCount; i++) {
        queue.push(node.children[i]);
      } 
      processQueue();
    }
    processQueue()

  return _layers
}

function mins2str(mins_arr ){

  let s = mins_arr[0] , e = mins_arr[1]
  return  `${Math.floor(s/60)}:${s%60} - ${Math.floor(e/60)}:${e%60}`
}



class Tree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      links:[],
      nodes:[],
      tree:{},
      location:{
        width:0,
        height:0
      },
      nodes_number: 1,
      modal_visible : false,
    };
  }
  componentWillMount(){
    let tree = {
      name: 'Root Node',
      childNum:0,
      path: [0],
      isSelected:true,
      condition:{
        time:[420,1080]    // 以 分 为单位 , 表示 [7:00-18:00]
      }
    }
    let layers = treeToLayer( tree )

    this.setState({
      tree,layers
    })

  }
  componentDidMount(){
    let { x,y,width,height } = this.treedom.getBoundingClientRect()// 该 node 的 绝对位置
    let location = { x,y,width,height }
    this.setState({
      location
    })
  }


  // 当 Node 位置变化时调用 
  renderLinks(){
     let { tree } = this.state

     let nodes = nodes_location
     let queue = [],
         _links = []

      queue[0] = tree
      // 广度优先遍历
      function processQueue() {
        var i, childCount, node,level;
        if (queue.length === 0) {
          return;
        }
        node = queue.shift();
        for (i = 0, childCount = node.childNum; i < childCount; i++) {
          // 将 father 于 children 都连起来
          let father_path = node.path.join('*'),
              child_path  = node.children[i].path.join('*'),
              f_l = nodes_location[father_path] ,
              c_l = nodes_location[child_path]

           _links.push({
              source: {
                x:  f_l.x + f_l.width/2 ,
                y:  f_l.y + f_l.height
              },
              target:{
                x:  c_l.x + c_l.width/2,
                y:  c_l.y
              },
              id:  `${father_path}-${child_path}`
           })
          queue.push(node.children[i]);
        } 
        processQueue();
      }
      processQueue()
      // console.log("render links ",tree,_links)
      this.setState({
        links:_links
      })
  }
  componentDidUpdate(){
  
  }




  updateNodeLocation(path,location){
    let { nodes_number } = this.state 
    nodes_location[ path.join('*') ]  = location
    // console.log( path.join('*') )
    // console.log( Object.keys(nodes_location).length ,nodes_number )
    // 等到节点数目 达标 
    if( Object.keys(nodes_location).length  == nodes_number){
        this.renderLinks()
    }
  }

  addNodesInTree(conditions){
      let { tree,nodes_number,currentAddPath  } = this.state
      let self = this
      let nodes = tree['children'],
          node,
          i,
          path = currentAddPath,
          add_node_num = conditions.length
      for(i = 1; i < path.length-1;i++){
          nodes = nodes[path[i]]['children']
      }

      node =  ( nodes !== undefined ? nodes[path[i]] : tree) // 右边表示 root 情况

      if(node.childNum == 0){
         node['children'] = []
          for(let j =0; j < add_node_num;j++){
               node['children'].push({
                  name: mins2str(conditions[j]['time']),
                  childNum: 0,
                  path: path.concat(j),
                  isSelected:false,
                  condition: conditions[j]
               })
          }
          node['childNum'] = add_node_num
          nodes_number+= add_node_num
      }

      let layers = treeToLayer( tree )
      this.setState({
          tree,layers,nodes_number
      })
  }

  delNodesInTree(path){
      let { tree,nodes_number  } = this.state
      let self = this
      let nodes = tree['children'],
          node,i

      for(i = 1; i < path.length-1;i++){
          nodes = nodes[path[i]]['children']
      }

      node =  ( path.length != 1  ? nodes[path[i]] : tree) // 右边表示 root 情况

      
      for(let i = 0;i < node.childNum;i++){
          let child_path = node['children'][i].path.join('*')
          delete nodes_location[child_path]  // 删除对应属性
      }

      nodes_number -= node.childNum
      node.childNum = 0
      delete  node['children']

      let layers = treeToLayer( tree )
      this.setState({
          tree,layers,nodes_number
      })
  }
  stateChangeInTree(path){
     let { tree } = this.state
     let { changeQueryTime } = this.props

     let queue = [],
         _links = []

      queue[0] = tree
      // 广度优先遍历
      function processQueue() {
        var i, childCount, node,level;
        if (queue.length === 0) {
          return;
        }
        node = queue.shift();

        if(node.path.join('*') == path.join('*')){
          node.isSelected = true
        }else{
          node.isSelected = false
        }

        for (i = 0, childCount = node.childNum; i < childCount; i++) {
          queue.push(node.children[i]);
        } 
        processQueue();
      }
      processQueue()

      let layers = treeToLayer( tree )
      this.setState({
          tree,layers
      })

      
      let final_conditions  =  findConditions(tree)
      changeQueryTime( final_conditions['time'] )

  }
  openModal(path){
    let { tree  } = this.state

    let current_add_condition = {},
        node

    current_add_condition = tree.condition

    // if(path.length > 1){
    //    node = tree 
    //    for(let i = 1;i < path.length;i++){
    //      node = node['children'][path[i]]
    //      for(let cond in node.condition){
    //          current_add_condition[cond] = node.condition[cond]  
    //          // 子节点的条件将父节点的条件覆盖了
    //          // 子节点没有的条件继承自父节点
    //      }
    //    }
    // }

    console.log('current node condition', current_add_condition)
     this.setState({
        currentAddPath: path,
        modal_visible: true,
        current_add_condition
     })
  }

  handleOk =(conditions)=>{
    this.addNodesInTree(conditions)
    this.setState({
      modal_visible: false,
    })
  }

  handleCancel = ()=>{
    this.setState({
      modal_visible: false,
    })
  }

  render() {
    let self = this
    let { layers,links,location } = this.state
    let { height,width } = location


    return (
      <div className='tree'  ref={dom => {this.treedom = dom}}>          
          <Links 
              height={height}
              width={width}
              links={links}    />


          {
            layers.map((layer,i)=>(
                <Layer updateNodeLocation={self.updateNodeLocation.bind(this)}  
                    addNodesInTree={self.openModal.bind(this)}
                    delNodesInTree={self.delNodesInTree.bind(this)}
                    stateChangeInTree= {self.stateChangeInTree.bind(this)}
                    data={layer} key={i}  /> 
            ))
          }

          {
            this.state.modal_visible && 
            (<Condition 
              modal_visible={this.state.modal_visible}
              current_add_condition={this.state.current_add_condition}
              handleOk={this.handleOk}
              handleCancel={this.handleCancel}
            />)
          }

      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
  };
};


const mapDispatchToProps = dispatch => {
  return {
    changeQueryTime: (time) => {
      let type = 'CHANGE_TIME'
      dispatch({ type, time });
    },
  }
}





export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Tree)