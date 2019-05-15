import React, { Component } from 'react';

import { G2, Chart, Geom, Axis, Tooltip, Coord, Label, Legend, View, Guide, Shape, Facet, Util } from "bizcharts";
import DataSet from '@antv/data-set';
import Brush from "@antv/g2-brush";

import { connect } from 'react-redux';
import * as Config from './Config'
import './MyTrack.css'
import { API_Track } from '../../api/index'

// 父组件，获取初始数据
class MyTrack extends Component {
    constructor() {
        super();
        this.state = {
            data: []
        }
    }
    componentWillMount() {
        // 接受 共享数据
        const postData = Config.getPostData(this.props.timeInterval, this.props.rooms, this.props.cluster);
        console.log('所查询的数据:', postData);
        API_Track(postData).then(response => {
            this.setState({
                data: response
            })
        });
    }
    render() {
        const MyGraph = getMyGraph(this.state.data);
        return (
            <div>
                <MyGraph />
            </div>
        );
    }
}

// 主函数 数据预处理、双图表公共dataset
function getMyGraph(Data) {
    const dataTrans = Config.getDataTrans(Data);
    // 建立dataset
    const ds = new DataSet({
        state: {
            timeStart: null, //时间筛选 格式是秒数
            timeEnd:  null
        }
    });
    // 建立dataview 每次状态量变更后，会自动刷新数据
    const dv = ds.createView();
    // 绑定数据筛选关系
    dv.source(dataTrans).transform({
        type: 'filter',
        callback: obj => {  
            const time = obj.time;
            if (ds.state.timeStart && ds.state.timeEnd) {  
                return time >= ds.state.timeStart && time <= ds.state.timeEnd;
            }
            return obj;
        }
    });
    // 把组件的chart绑定到这个变量上,实现 brush操作 的功能
    let chart2;
    // 画图组件
    class MyGraph extends Component {
        // 挂载后设置 brush
        componentDidMount() {
            new Brush({
                canvas: chart2.get('canvas'),
                chart: chart2,
                type: 'X',  //固定X轴
                dragable: true,  // 可以移动brush框
                onBrushmove(ev) {
                    const { time } = ev;    // 选中的数据里面，选择time作为过滤条件
                    const max = Math.max.apply(null, time);
                    const min = Math.min.apply(null, time);
                    ds.setState('timeStart', min);
                    ds.setState('timeEnd', max);
                },
                onDragmove(ev) {
                    const { time } = ev;
                    const max = Math.max.apply(null, time);
                    const min = Math.min.apply(null, time);
                    ds.setState('timeStart', min);
                    ds.setState('timeEnd', max);
                }
            });
        }

        render() {
            return (
                <div>
                    <Chart
                        height={Config.chartHeightBrush} data={dataTrans} scale={Config.scale}
                        padding={{ top: 50, right: 20, bottom: 0, left: 20 }}
                        onGetG2Instance={g2Chart => {
                            chart2 = g2Chart; //绑定到全局变量chart
                        }}
                        forceFit
                    >
                        <Coord type='rect' reflect='y' />
                        <Axis name='time' />
                        <Axis name='place' visible={false} />
                        <Legend name="label" position="top" dx={20} />
                        <Geom
                            type='line' position='time*place' size={1} opacity={1} shape={'hv'}
                            color={['label', Config.getLabelColor]} 
                            active={false}
                        />
                    </Chart>
                    <Chart
                        height={Config.chartHeightShow} data={dv} scale={Config.scale} animate={false}
                        padding={{ top: 50, right: 20, bottom: 20, left: 60 }}
                        forceFit
                    >
                        <Coord type='rect' reflect='y' />
                        <Axis name='time' />
                        <Axis name='place' />
                        <Legend name="label" position="top" dx={20} />
                        <Tooltip crosshairs={{ type: 'y' }} />
                        <Geom
                            type='line' position='time*place' size={1} opacity={1} shape={'hv'}
                            active={[true, {
                                highlight: true, // 开启时没有激活的变灰
                                style: { // 查找 html convas 属性
                                    lineWidth: 2
                                },
                            }]}
                            color={['label', Config.getLabelColor]} 
                            tooltip={['time*place*id*label', (time, place, id, label) => {
                                return {
                                    // 自定义tooltip
                                    title: '时刻 ' + Config.getTimeToClock(time) + ' ' + time + 's', 
                                    name: 'id ' + id + ' cat ' + label,
                                    value: place
                                };
                            }]}
                        />
                    </Chart>
                </div>
            );
        }
    }
    return MyGraph;
}

// redux 时间段,room
const mapStateToProps = (state) => {
    return {
        timeInterval: state.timeInterval,
        rooms: state.rooms,
        cluster: state.cluster, 
    }
}

export default connect(mapStateToProps)(MyTrack);


