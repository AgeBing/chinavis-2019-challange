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

class StackChart extends React.Component {
  render() {
    let { rooms , style } = this.props

    const cols = {
      time: {
        type: "cat",
      },
      'count':{
        type : 'linear',
        nice: true,
      }
    };
    return (
      <div>
        <Chart 
          height={style.height}
          width={style.width}
         data={rooms} scale={cols}
          padding={[20, 65, 45, 40]}
         >
          <Axis name="time" />
          <Axis name="count" />
          <Legend  position="right-center" />
          <Tooltip
            crosshairs={{
              type: "line"
            }}
          />
          <Geom type="areaStack" position="time*count" color="name" />
          <Geom type="lineStack" position="time*count" size={2} color="name" />
        </Chart>
      </div>
    );
  }
}

export default StackChart;
