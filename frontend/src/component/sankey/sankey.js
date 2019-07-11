import { API_Sankey }  from '../../api/index'
import React from "react";
import { connect } from 'react-redux'

import DataSet from "@antv/data-set";

import { sankeyLayout,m2s } from  './transform'
import * as d3 from 'd3';
import  mysankey from './layout'


const width = 1000
const height = 1000

class Sankey extends React.Component {

  constructor() {
    super(...arguments)
    this.state = {
      data : null,
      selectIds : [],
      selectLinkId:-1,
      selectNodeId:-1,
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
      rids :[[3],[5],[6],[2], [4],[20],[9,18]],//,[2,4,7,16,15,19,20]]day3
      //[[3,5,6,7],[1],[2],[4],[8,16,18,10],[9,15,19],[20]]  
      //[[3],[5],[6],[7],[18], [10],[1,2,4,8,16,9,15,19,20]] 
      ids : uids
    }).then((res)=>{
      // let sankeyData = sankeyLayout(res)
      console.log(res)
      let s = new mysankey(res)
      let svg = d3.select('#theChart')
       .append('svg')
         .attr('width',width)
         .attr('height',height)
      s.renderNodes(svg)
      s.renderLinks(svg)
      s.print()
    })
  }



  render() {
    let { data,selectIds,selectLinkId,selectNodeId }  = this.state
    let { changeSelectTrajIds } = this.props
    
    return(
      <div>
        <div className="theChart" id="theChart" ref="theChart">
        </div>
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








