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

class PieChart extends React.Component {
  render() {
    const { DataView } = DataSet;
    let { counts,style } = this.props


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

export default PieChart