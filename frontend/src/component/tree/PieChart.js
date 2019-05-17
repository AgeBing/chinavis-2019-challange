import React from "react";
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
import { connect } from 'react-redux'


class PieChart extends React.Component {
   constructor() {
    super(...arguments)
    this.state = {
    }
  }
  onHandleClusterSelect = (data)=>{
    let { clusterNum }  = this.props

    console.log('select',data)    // 聚类2
    let currentNum = +data.slice(-1)
    if(clusterNum !=  currentNum){
      this.props.changeSelectCluster(currentNum)
    }
  }
  componentWillUnmount(){
    let { clusterNum }  = this.props
    if( clusterNum != 0){
      // 是选择失效，返回全部数据
      this.props.changeSelectCluster(0)
    }

  }
  render() {
    const { DataView } = DataSet;
    let { counts,style } = this.props

    let chartIns,
       self = this

    const dv = new DataView();
    dv.source(counts).transform({
      type: "percent",
      field: "count",
      dimension: "cluster",
      as: "percent"
    });
    const cols = {
      percent: {
        formatter: val => {
          val = Math.floor(val * 100)+ "%";
          return val;
        }
      }
    };
    return (
      <div>
        <Chart
          height={style.height}
          width={style.width}
          data={dv}
          scale={cols}
          padding={[2, 60, 5, 5]}

          onGetG2Instance={g2Chart => {chartIns = g2Chart;}}
          onPlotClick={ev => {
            var point = {
              x: ev.x,
              y: ev.y
            };
            let selectItem = ev.data._origin.cluster
            self.onHandleClusterSelect(selectItem)
          }}


        >
          <Coord type="theta" radius={0.75} />
          <Axis name="percent" />
          <Legend
            position="right-center"
          />
          <Tooltip
            showTitle={false}
            itemTpl="<li><span style=&quot;background-color:{color};&quot; class=&quot;g2-tooltip-marker&quot;></span>{name}: {value}人</li>"
          />
          <Geom
            type="intervalStack"
            position="percent"
            color="cluster"
            tooltip={[
              "item*count",
              (cluster, count) => {
                return {
                  name: cluster,
                  value: count
                };
              }
            ]}
            style={{
              lineWidth: 1,
              stroke: "#fff"
            }}
          >
            <Label content="count" />
          </Geom>
        </Chart>
      </div>
    );
  }
}



const mapStateToProps = (state) => {
  return {
    clusterNum : state.clusterNum
  }
}

const mapDispatchToProps = dispatch => {
  return {
    changeSelectCluster: (clusterNum) => {
      let type = 'CHANGE_CLUSTERNUM'
      dispatch({ type, clusterNum });
    },
  }
}


export default connect(mapStateToProps,mapDispatchToProps)(PieChart);