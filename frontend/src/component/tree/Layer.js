import React, { Component } from 'react';


import Node from './Node.js'

export default class Layer extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    let { data,updateNodeLocation,addNodesInTree,delNodesInTree,stateChangeInTree }  = this.props
    return (
      <div className='layer'>
            {/*<Node  addLinks={this.props.addLinks} layerId={this.props.layerId} nodeId={0}/>
            <Node  addLinks={this.props.addLinks} layerId={this.props.layerId} nodeId={1}/>
            <Node  addLinks={this.props.addLinks} layerId={this.props.layerId} nodeId={2}/>*/}

            {
              data.map((node,i)=>{
                let hasEndChild = false //指拥有叶子节点 的父节点
                if(node.childNum >0){
                  let sign = true
                  for(i = 0; i < node['children'].length;i++){
                    if(node['children'][i].childNum != 0)
                      sign = false
                  }
                  if(sign) hasEndChild = true
                }

                return (
                <Node name={node.name} path={node.path}
                  isSelected={node.isSelected} 
                  hasChild={node.childNum > 0 ? true : false}
                  hasEndChild={hasEndChild}
                  addNodesInTree={addNodesInTree}
                  delNodesInTree={delNodesInTree}
                  updateNodeLocation={updateNodeLocation} 
                  stateChangeInTree={stateChangeInTree}
                  key={ node.path.join('*') }/>
              )})
            }

      </div>
    );
  }
}
