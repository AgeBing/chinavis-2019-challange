import { API_Sankey }  from '../../api/index'
import './sankey.css'

import React from "react";
import { connect } from 'react-redux'

import DataSet from "@antv/data-set";

import * as d3 from 'd3';
import  mysankey from './layout'
import  { Group }  from './group.js'



import { Tag,
    Icon,
    Button
 } from 'antd';

const width =1200
const height = 488

class Sankey extends React.Component {

  constructor() {
    super(...arguments)
    this.state = {
      data : {},
      selectIds : [],
      selectLinkId:-1,
      selectNodeId:-1,
      config: false,     // config 面板开关
      rids : [[2,3,5,6,7],[1,8],[0,9,15,19,21,22,23,24],[10,11,13,14,17,20],[4,12,16,18]]
    }
  }

  componentWillMount(){
    this.requestNewDatas()
  }
  componentWillReceiveProps(nextProps){
    //参数变化  
      // 体检改变
      if(this.props.selectTimeInterval.day != nextProps.selectTimeInterval.day ||
         this.props.selectTimeInterval.minites.toString() != nextProps.selectTimeInterval.minites.toString()){
        
        // 重新获取数据
        this.requestNewDatas(nextProps) 
      }
  }
  requestNewDatas(nextProps){
    let { selectTimeInterval,uids } = nextProps || this.props

    let day = selectTimeInterval.day,
      cluster = 4, 
      timeStart = selectTimeInterval.minites[0], 
      timeEnd = selectTimeInterval.minites[1], 
      // limit  = 1000 
      limit  = 30000000


    API_Sankey({
      day, cluster, 
      startMinutes: timeStart,
      endMinutes: timeEnd,
      limit,
      rids: this.state.rids , 
      ids : uids    
    }).then((res)=>{
      this.drawSankey(res)
    })
  }

  drawSankey = (data)=>{
    if(!data.hasOwnProperty('nodes')) return

    console.log(data)

    let s = new mysankey(data,width,height)
    
    d3.select('#sankeyChart').selectAll('*').remove()

    let svg = d3.select('#sankeyChart')
       .append('svg')
         .attr('width',width)
         .attr('height',height)

    s.renderNodes(svg)
    s.renderLinks(svg)
    s.registerEvent(this.onSelectIds , this.onUnSelectIds)
    s.print()
  }

  onOpenConfig= ()=>{
      this.setState({
        config  : true
      })
  }
  onCloseConfig = ()=>{
      this.setState({
        config  : false
      })    
  }
  onChangeGroup =( newGroup )=>{
      let self = this
      this.onCloseConfig()
      this.setState({
        rids : newGroup
      },() => {  
        self.requestNewDatas()
      })
  }
  onSelectIds =(ids)=>{
    this.props.changeSelectTrajIds(ids)
  }
  onUnSelectIds=()=>{
    this.props.changeSelectTrajIds([])
  }
  render() {

    let { selectIds,selectLinkId,selectNodeId,config }  = this.state
    let { changeSelectTrajIds } = this.props
    
    return(
      <div className='sankey-container'>
        {  !config ? 
         (
          <div>
             <div className='config-panel'>
               <Button icon="tool" onClick={this.onOpenConfig}/>
              </div>
              <div 
                  className="sankeyChart" 
                  id="sankeyChart" 
                  ref="sankeyChart"
                  style={{ padding:'28px'}}>
            </div>
          </div>
          )
          : (<Group  
              onCloseConfig={this.onCloseConfig}
              onChangeGroup={this.onChangeGroup}
              givenGroup={
               this.state.rids
              }
            />)
      }

      </div>
    );
  }
}


const mapStateToProps = (state) => {
  return {
    selectTimeInterval : state.selectTimeInterval,
    uids : state.ids
  }
}

const mapDispatchToProps = dispatch => {

  return {
    changeSelectTrajIds: (ids) => {
      let type = 'CHANGE_SELECT_TRAJ_IDS'
      dispatch({ type, ids });
    },
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(Sankey)