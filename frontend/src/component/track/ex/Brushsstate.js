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

import Brush from "@antv/g2-brush";

import data from "./mockBrush.json";

function getComponent(data) {
    const ds = new DataSet({
        state: {
            dates: null
        }
    });
    const totalDv = ds.createView().source(data);
    const dv = ds.createView();
    dv.source(data).transform({
        type: "filter",
        callback: obj => {
            if (ds.state.dates) {
                return ds.state.dates.indexOf(obj.date) > -1;
            }

            return obj;
        }
    });
    console.log('233');
    console.log(dv.rows);


    const scale1 = {
        date: {
            tickCount: 10,
            type: "time",
            mask: "MMM D YYYY"
        },
        price: {
            min: totalDv.min("price"),
            max: totalDv.max("price")
        }
    };
    const scale2 = {
        date: {
            tickCount: 10,
            type: "time",
            mask: "YYYY"
        }
    };
    let chart2;

    class DoubleChart extends React.Component {
        componentDidMount() {
            new Brush({
                canvas: chart2.get("canvas"),
                chart: chart2,
                type: "X",
                dragable: true,

                onBrushmove(ev) {
                    const { date } = ev;
                    console.log(date);
                    ds.setState("dates", date);
                    console.log(ds);
                    console.log(dv);
                },

                onDragmove(ev) {
                    const { date } = ev;
                    ds.setState("dates", date);
                }
            });
        }

        render() {
            console.log(data);
            return (
                <div>
                    <Chart
                        height={window.innerHeight * (4 / 5)}
                        data={dv}
                        padding={[100, 40, 50, 80]}
                        scale={scale1}
                        animate={false}
                        forceFit
                    >
                        <Axis />
                        <Tooltip />
                        <Geom
                            type="area"
                            position="date*price"
                            shape="smooth"
                            opacity={0.85}
                        />
                    </Chart>
                    <Chart
                        height={window.innerHeight * (1 / 5)}
                        data={data}
                        padding={[5, 40, 60, 80]}
                        scale={scale2}
                        onGetG2Instance={g2Chart => {
                            chart2 = g2Chart;
                        }}
                        forceFit
                    >
                        <Axis name="price" visible={false} />
                        <Geom
                            type="area"
                            position="date*price"
                            shape="smooth"
                            acitve={false}
                            opacity={0.85}
                        />
                    </Chart>
                </div>
            );
        }
    }
    return DoubleChart;
}

class Brushdsstate extends React.Component {
    render() {
        const DoubleChart = getComponent(data);
        return (
            <div>
                <DoubleChart />
            </div>
        );
    }
}

export default Brushdsstate;