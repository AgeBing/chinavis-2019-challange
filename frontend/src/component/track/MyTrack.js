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
        // 参数 day='1', cluster='3' 第一个是第几天，第二个是聚类个数
        API_Track(Config.postData).then(response => {
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
            brushTime: null //缩略图时间选择
        }
    });
    // 建立dataview 每次状态量变更后，会自动刷新数据
    const dv = ds.createView();
    // 绑定数据筛选关系
    dv.source(dataTrans).transform({
        type: 'filter',
        callback: obj => {
            if (ds.state.brushTime) {  //当brushdata存储了数值的时候
                return ds.state.brushTime.indexOf(obj.time) > -1;  //为每一行数据遍历brushdata，在其中则返回true
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
                    ds.setState('brushTime', time);
                },
                onDragmove(ev) {
                    const { time } = ev;
                    ds.setState('brushTime', time);
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

export default MyTrack;

// mysqldump --column-statistics=0  --host=115.159.202.238 -uchinavis -pchinavis2019 --databases chinavis2019 --tables cluster_By5 cluster_By6  cluster_By7 cluster_By8 cluster_By9 cluster_By10>  C:\Users\14403\Documents\dumps\day3.sql

