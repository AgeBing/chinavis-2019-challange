import { API_Sankey }  from '../../api/index'
import React from "react";
import { connect } from 'react-redux'

import {
  G2,
  Chart,
  Geom,
  Axis,
  Tooltip,
  Coord,
  Label,
  Legend,
  View,
  Guide,
  Shape,
  Facet,
  Util
} from "bizcharts";
import DataSet from "@antv/data-set";

import { sankeyLayout,m2s } from  './transform'

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
      let sankeyData = sankeyLayout(res)
      this.setState({
        data: sankeyData
      })
    })
  }



  render() {
    let { data,selectIds,selectLinkId,selectNodeId }  = this.state
    let { changeSelectTrajIds } = this.props
    if( data == null) return (
      <div></div>
    )

    console.log(data)


    // 坑 https://github.com/antvis/g2/issues/654
    //  不然会导致不同view间错位的问题
    const scale = {
      x: {
        sync: true
      },
      y: {
        sync: true
      }
    };

    let depthArr = [],
        heightArr = []

    for(let i = 0 ;i < 30;i++){
      depthArr.push(i)
    }

    for(let i = 0 ;i < 8;i++){
      heightArr.push(i)
    }
    let nodeScale = {
      x_index : {
        type : 'cat',
        values: data.times,
      },
      y_index : {
        type : 'cat',
        values: data.rooms,
        tickInterval:105,
      }

    }

    let chartIns,
        self = this

    return (
      <div>
        <Chart
          data={data.nodes}
          forceFit={false}
          height={542}
          width={1230}
          padding={[0,0,0,70]}

          //https://bizcharts.net/products/bizCharts/api/chart#%E5%9B%BE%E8%A1%A8%E4%BA%8B%E4%BB%B6
          onGetG2Instance={g2Chart => {chartIns = g2Chart;}}
          
          onEdgeClick={ev => {
            var point = {
              x: ev.x,
              y: ev.y
            };

            let selectIds = ev.data._origin.ids
            let _selectLinkId = ev.data._origin.index

            if(selectLinkId == _selectLinkId){ // 取消
                selectIds = []
                _selectLinkId = -1
            }

            changeSelectTrajIds(selectIds)
            self.setState({
              selectIds,
              selectLinkId:_selectLinkId,
              selectNodeId:-1
            })
          }}

          onPolygonClick={ev => {
            var point = {
              x: ev.x,
              y: ev.y
            };


            let nodeIndex =  ev.data._origin.index 
            let ids = []

            if(selectNodeId == nodeIndex){
                selectNodeId = -1
                ids = []
            }else{
              //遍历 links 找出source 或 target 对应的边，取出 ids
              for(let i = 0;i < data.links.length; i++){
                  let link = data.links[i]
                  if(link['sourceNodeIndex'] == nodeIndex || link['targetNodeIndex'] == nodeIndex){
                   ids =  ids.concat(link.ids)
                  }
              }
              selectNodeId = nodeIndex
            }

            self.setState({
              selectIds : ids,
              selectNodeId,
              selectLinkId:-1
            })

          }}



        >

        
        <View data={data.nodes} scale={nodeScale} 
            start={{x:0,y:0.1}} end={{x:1, y:1}} 
            forceFit={false}>
          <Geom
            type="polygon"
            position="x_index*y_index"
            color="transparent"
            style={{
              fill:'none',
              stroke: "#ccc"
            }}
          >
          </Geom>
          <Axis name='x_index' visable={false}/>
          <Axis name='y_index'  title={false} label={{
            autoRotate: false
          }} />
        </View>


        <View data={data.links} scale={scale}>
            <Geom
              type="edge"
              position="x*y"
              shape="arc"

              color={['ids*index', (ids,index)=>{
                  if(index == selectLinkId){
                    return '#c41d7f';
                  }
                  let flag  = false
                  for(let i=0;i<selectIds.length;i++){
                    if(ids.indexOf(selectIds[i]) != -1){
                      flag = true
                      break
                    }
                  }
                  if(flag)
                    return '#ffadd2';
                  else
                    return '#bbb';
                }]}
              
              opacity={0.6}
              highlight={true}
              
              tooltip={[
                "target*source*value",
                (target, source, value) => {
                  return {
                    name: source + " to " + target + "</span>",
                    value
                  };
                }
              ]}
            />
        </View>

         <View data={data.nodes} scale={scale}>
            <Geom
              type="polygon"
              position="x*y"
              style={{
                lineWidth:1,
                stroke: "#ccc",
                fill: 'transparent'
              }}
            >
           <Label
              content="time*height"
              textStyle={{
                fill: "#545454",
              }}

              formatter={(time,height) => {
                  if(height.point.height == 6){
                    return m2s(time)
                  }
                  return ''
              }}
              position='middle'
              offset={20}
            />
            </Geom>
          </View>
          
        <View data={data.subNodes} scale={scale}>
            <Geom
              type="polygon"
              position="x*y"

              style={['index', {
                  fill:(index)=>{
                    if(index == selectNodeId){
                      return "#c41d7f";
                    }else{
                      return "#bae7ff";
                    }
                  }
              }]}

            >
            </Geom>
        </View> 


        </Chart>
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








