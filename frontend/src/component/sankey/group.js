import React from "react"
import './group.css'
import { Tag,
		Icon,
		Button,
    message
 } from 'antd';
import SortableBox from './sortableBox.js'
import Box from './box.js'

import Node from './node.js'
import { NativeTypes } from 'react-dnd-html5-backend'
import { nodeRectHeight ,nodeRectWidth } from './config'


export class Group extends React.Component {
  constructor() {
    super(...arguments)
	  this.state = {
      groupCount : 2,
      group : {
        default: [1,2,3,4,5] ,
      }
    }
  }

  componentWillMount(){
    let { group,groupCount } = this.state
    for(let i = 0;i < groupCount;i++){
      group[i] = []
    }
    this.setState({ group })
  }
  handleDrop = (item,box)=>{
    console.log('handleDrop',item,box)
    let { group,groupCount } = this.state
    // 先删除
    for(let _box in group){
      if(!group[_box]) continue
      let findIndex = group[_box].indexOf(item.rid)
      if(findIndex != -1){
        group[_box].splice(findIndex,1)
      }
    }
    // 再添加
    group[box.id].push(item.rid)

    this.setState({ group })
  }
  addBox = () =>{
    let { group,groupCount } = this.state
    group[groupCount] = []
    groupCount++
    this.setState({ groupCount,group })
  }
  delBox = (index) => {
    let { group,groupCount } = this.state

    let delRids = group[index]
    group['default'] = group['default'].concat( delRids )

    for(let i = index ; i < groupCount ; i++){
      group[i] = group[i+1]
    }
    groupCount--
    this.setState({ groupCount,group })
  }
  moveBox = (a,b)=>{
     // console.log('move',a,b) 
    let { group,groupCount } = this.state

    let temp = [].concat(group[a])
    group[a] = group[b]
    group[b] = temp

    this.setState({ group })
  }
  render() {
    let { groupCount,group } = this.state
  	let boxs = [],nodes =[] , k=10
  	
    console.log(group)
    for(let i=0;i < groupCount;i++){
  		boxs.push(
  			<SortableBox
          onDrop={this.handleDrop}
          key={i}
          index={i}
          hasNodes={group[i]}
          onMoveBox={this.moveBox}
          onDelBox={this.delBox}
        />
	    )
  	}
    for(let i=0;i < group.default.length;i++){
      nodes.push(
        <Node 
          key={i}
          rid = {group.default[i]}
          isDropped={()=>true}
        />
      )
    }
    return (
    <div className='group-container'>
      <div className='group-panel'>

        	<div className='left-panel'>
              <Box
                  index={'default'}
                  onDrop={this.handleDrop}
                  hasNodes={group['default']}
                />
          </div>

        	<div className='right-panel'>
        		{ boxs	}


  	      	<div className='add-node-wraper'
  	      	 style={{
  	              left :  groupCount * (nodeRectWidth + 20)
  	          }}>
  		      	<div  className='add-node'  
  		          style={{
  		              height:nodeRectHeight,
  		              width:nodeRectWidth,
  		          }}
                onClick={this.addBox}
  		        >
  		          <span>
  		              <Icon type='plus' />
  		              <div className="ant-upload-text" >
  		              添加节点
  		              </div>
  		          </span>
  		        </div>
  	        </div>
  	      </div>
      </div>
      <div className='btn-panel'>
          <Button onClick={this.onCanel}> 取消 </Button>
          <Button onClick={this.onSubmit}> 确定 </Button>
      </div>
    </div>
    );
  }
  // 取消 关闭该视窗
  onCanel = ()=>{

  }
  // 提交
  onSubmit = ()=>{
    let { group } = this.state
    if( group['default'].length > 0 ){
      message.warning('将所有的room进行归类');
    }else{

    }
  }

}
