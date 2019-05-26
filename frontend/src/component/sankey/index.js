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

import { sankeyLayout } from  './transform'

class Sankey extends React.Component {

  constructor() {
    super(...arguments)
    this.state = {
      data : null,
      selectIds : [],
      selectItemId:-1
    }
  }

  componentWillMount(){
    let day = 1,
      cluster = 4, 
      timeStart = 480, 
      timeEnd = 960, 
      limit  = 1000000

    API_Sankey({
      day, cluster, timeStart, timeEnd, limit
    }).then((res)=>{
      let sankeyData = sankeyLayout(res)

      this.setState({
        data: sankeyData
      })
    })
  }
  



  render() {
    let { data,selectIds,selectItemId }  = this.state
    let { changeSelectTrajIds } = this.props
    if( data == null) return (
      <div></div>
    )

    const scale = {
      x: {
        sync: true
      },
      y: {
        sync: true
      }
    };

    let chartIns,
        self = this


    return (
      <div>
        <Chart
          forceFit={true}
          data={[1]}
          height={1000}
          scale={scale}
          padding={[40, 80]}

          //https://bizcharts.net/products/bizCharts/api/chart#%E5%9B%BE%E8%A1%A8%E4%BA%8B%E4%BB%B6
          onGetG2Instance={g2Chart => {chartIns = g2Chart;}}
          
          onEdgeClick={ev => {
            var point = {
              x: ev.x,
              y: ev.y
            };

            let selectIds = ev.data._origin.ids
            let _selectItemId = ev.data._origin.index

            if(selectItemId == _selectItemId){ // 取消
                selectIds = []
                _selectItemId = -1
            }

            changeSelectTrajIds(selectIds)
            self.setState({
              selectIds,
              selectItemId:_selectItemId
            })
          }}

        >
          <Tooltip showTitle={false} />
          <View data={data.links}>
            <Geom
              type="edge"
              position="x*y"
              shape="arc"

              color={['ids*index', (ids,index)=>{
                  if(index == selectItemId){
                    return 'red';
                  }
                  let flag  = false
                  for(let i=0;i<selectIds.length;i++){
                    if(ids.indexOf(selectIds[i]) != -1){
                      flag = true
                      break
                    }
                  }
                  if(flag)
                    return '#00ff00';
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
          <View data={data.nodes}>
            <Geom
              type="polygon"
              position="x*y"
              color="name"
              style={{
                stroke: "#ccc"
              }}
            >
              <Label
                content="name"
                textStyle={{
                  fill: "#545454",
                  textAlign: "start"
                }}
                offset={0}
                formatter={val => {
                  return "  " + val;
                }}
              />
            </Geom>
          </View>
        </Chart>
      </div>
    );
  }
}





const mapStateToProps = (state) => {
  return {
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








