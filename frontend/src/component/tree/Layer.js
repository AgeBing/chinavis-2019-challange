import React, { Component } from 'react';


import Node from './Node.js'

export default class Layer extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    let { data,updateNodeLocation,addNodesInTree,delNodesInTree }  = this.props
    return (
      <div className='layer'>
            {/*<Node  addLinks={this.props.addLinks} layerId={this.props.layerId} nodeId={0}/>
            <Node  addLinks={this.props.addLinks} layerId={this.props.layerId} nodeId={1}/>
            <Node  addLinks={this.props.addLinks} layerId={this.props.layerId} nodeId={2}/>*/}

            {
              data.map((node,i)=>{
                console.log(node)
                let hasEndChild = false //指拥有叶子节点 的父节点
                if(node.childNum >0 && node.children[0].childNum == 0){
                   hasEndChild = true
                }

                return (
                <Node name={node.name} path={node.path} 
                  hasChild={node.childNum > 0 ? true : false}
                  hasEndChild={hasEndChild}
                  addNodesInTree={addNodesInTree}
                  delNodesInTree={delNodesInTree}
                  updateNodeLocation={updateNodeLocation} 
                  key={i}/>
              )})
            }

      </div>
    );
  }
}
