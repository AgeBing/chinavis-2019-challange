import React, { Component } from 'react';
import './tree.css'

import Layer from './Layer.js'
import Links from './Links.js'


import { Modal, Button,Icon,InputNumber } from 'antd';
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


export default class Tree extends Component {
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
      nodes_number: 12,
      modal_visible : false,
      add_node_num:3
    };
  }
  componentWillMount(){
    let tree = {
      name: 'root',
      childNum:3,
      path: [0],
      children:[
        {
          name: '会场',
          childNum:3,
          path:[0,0],
          children:[
            {
              name: '上午',
              childNum: 0,
              path:[0,0,0],              
            },
            {
              name: '中午',
              childNum: 0,
              path:[0,0,1],              
            },
            {
              name: '下午',
              childNum: 0,
              path:[0,0,2],             
            },
          ]
        },
        {
          name: '功能区',
          childNum:0,
          path:[0,1],
        },
        {
          name: '楼梯',
          childNum:3,
          path:[0,2],
          children:[
            {
              name: '上午',
              childNum: 2,
              path:[0,2,0],
              children:[
                {
                  name: '男',
                  childNum: 0,
                  path:[0,2,0,0],              
                },
                {
                  name: '女',
                  childNum: 0,
                  path:[0,2,0,1],              
                }
              ]              
            },
            {
              name: '中午',
              childNum: 0,
              path:[0,2,1],              
            },
            {
              name: '下午',
              childNum: 0,
              path:[0,2,2],             
            },
          ]
        },
      ]
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
      console.log("render links ",tree,_links)
      this.setState({
        links:_links
      })
  }
  componentDidUpdate(){
  
  }




  updateNodeLocation(path,location){
    let { nodes_number } = this.state 
    nodes_location[ path.join('*') ]  = location
    console.log( path.join('*') )
    console.log( Object.keys(nodes_location).length ,nodes_number )
    // 等到节点数目 达标 
    if( Object.keys(nodes_location).length  == nodes_number){
        this.renderLinks()
    }
  }

  addNodesInTree(){
      let { tree,nodes_number,add_node_num,currentAddPath  } = this.state
      let self = this
      let nodes = tree['children'],
          node,i,
          path = currentAddPath
      for(i = 1; i < path.length-1;i++){
          nodes = nodes[path[i]]['children']
      }
      node = nodes[path[i]]
      if(node.childNum == 0){
         node['children'] = []
          for(let j =0; j < add_node_num;j++){
               node['children'].push({
                  name: 'xxx',
                  childNum: 0,
                  path: path.concat(j)
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
      node = nodes[path[i]]
      
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
  openModal(path){
     this.setState({
        currentAddPath: path,
        modal_visible: true
     })

  }


  onChangeNodeNum =(value)=> {
    this.setState({
       add_node_num : value
    })
  }
  handleOk=()=>{


    this.addNodesInTree()
    this.setState({
      modal_visible: false,
      add_node_num : 3
    })

  }
  handleCancel = ()=>{
    this.setState({
      modal_visible: false,
      add_node_num : 3
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
                    data={layer} key={i} /> 
            ))
          }

          <Modal
            title="添加子节点"
            visible={this.state.modal_visible}
            mask={false}
            width={width-200}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
          >

            节点个数  <InputNumber min={1} max={4} defaultValue={3} onChange={this.onChangeNodeNum} value={this.state.add_node_num}/>


          </Modal>

      </div>
    );
  }
}

