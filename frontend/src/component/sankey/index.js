import { API_Sankey }  from '../../api/index'
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

import { sankeyLayout } from  './transform'

class Sankey extends React.Component {

  constructor() {
    super(...arguments)
    this.state = {
      data : null
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
      console.log(sankeyData)
      this.setState({
        data: sankeyData
      })
    })
  }
  



  render() {
    let { data }  = this.state
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

    
    return (
      <div>
        <Chart
          forceFit={true}
          data={[1]}
          height={1000}
          scale={scale}
          padding={[40, 80]}
        >
          <Tooltip showTitle={false} />
          <View data={data.links}>
            <Geom
              type="edge"
              position="x*y"
              shape="arc"
              color="#bbb"
              opacity={0.6}
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

export default Sankey







