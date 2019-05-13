import React, { Component } from 'react';

import { G2, Chart, Geom, Axis, Tooltip, Coord, Label, Legend, View, Guide, Shape, Facet, Util } from "bizcharts";
import DataSet from '@antv/data-set';
import Brush from "@antv/g2-brush";

import { connect } from 'react-redux';
import { API_Track } from '../../../api/index'

import './MyTrack.css'

// 时钟转换为time
function getClockToTime(clock) {
    // clock = "14:03:00";
    let hour = clock.substr(0, 2);
    let min = clock.substr(3, 2);
    let sec = clock.substr(6, 2);
    return Number(hour) * 3600 + Number(min) * 60 + Number(sec);
}

// time转换为时钟
function getTimeToClock(second) {
    let hour = Math.floor(second / 3600);
    let min = Math.floor((second - hour * 3600) / 60);
    let str = '';
    if (hour < 10) str = str + '0';
    str = str + hour + ':';
    if (min < 10) str = str + '0';
    str = str + min;
    return str;
}

// 地名映射
function getPlaceText(place) {
    const p = Number(place);
    switch (p) {
        case 0: return '走廊/墙';
        case 1: return '展厅';
        case 2: return '主会场';
        case 3: return '分会场A';
        case 4: return '签到处';
        case 5: return '分会场B';
        case 6: return '分会场C';
        case 7: return '分会场D';
        case 8: return '海报区';
        case 9:
        case 15:
        case 19: return '厕所';
        case 10: return 'room1';
        case 11: return 'room2';
        case 13: return 'room3';
        case 14: return 'room4';
        case 17: return 'room5';
        case 20: return 'room6';
        case 12: return '服务台';
        case 16: return '餐厅';
        case 18: return '休闲区';
        case 21:
        case 22:
        case 23:
        case 24: return '扶梯';
        default: return '错误';
    }
}

// 主函数
function getMyGraph(Data) {
    // console.log(Data);
    // 改变数据格式
    const dataTrans = Data.map(i => {
        return {
            ...i,
            place: getPlaceText(i.place),
            time: getClockToTime(i.time),
            label: Number(i.label)
        }
    });
    console.log('处理后的全部数据', dataTrans);
    // 建立dataset
    const ds = new DataSet({
        state: {
            brushTime: null //缩略图时间选择
        }
    });
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
    // 数据尺度配置
    const scale = {
        place: {
            type: 'cat',
            alias: '地点',
            range: [0, 1],
            values: ['主会场', '分会场A', '分会场B', '分会场C', '分会场D', '海报区', '展厅', '签到处', '走廊/墙',
                '扶梯', '厕所', '餐厅', '休闲区', 'room1', 'room2', 'room3', 'room4', 'room5', 'room6', '错误']
        },
        time: {
            type: 'linear',
            alias: '时间',
            range: [0, 1],
            formatter: (value) => { return getTimeToClock(value) },
            // tickInterval: 3600

        },
        label: {
            type: 'cat',
            alias: '聚类标记'
        },
        id: {
            type: 'cat',
            alias: '人员标记'
        }
    };

    // 把组件的chart绑定到这个变量上,实现 brush操作 的功能
    let chart2;

    // 画图组件
    class MyGraph extends Component {
        constructor() {
            super();
            this.state = {
                // 人员分类的颜色显示
                labelColor: ['#e41a1c','#377eb8','#4daf4a'],
                // 图表高度,BizChart的宽度是自适应屏幕的
                chartHeight: 360,
                chartHeight2: 200
            };
        }

        // 挂载后设置 brush
        componentDidMount() {
            new Brush({
                canvas: chart2.get('canvas'),
                chart: chart2,
                type: 'X',  //固定X轴
                dragable: true,  // 可以移动brush框

                onBrushmove(ev) {
                    // 选中的数据里面，选择time作为过滤条件
                    const { time } = ev;
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
                    <div className='chart-brush'>
                        <Chart
                            height={this.state.chartHeight2} data={dataTrans} scale={scale}
                            padding={{ top: 30, right: 20, bottom: 0, left: 20 }}
                            onGetG2Instance={g2Chart => {
                                chart2 = g2Chart; //绑定到全局变量chart
                            }}
                            forceFit
                        >
                            <Coord type='rect' reflect='y' />
                            <Axis name='time' />
                            <Axis name='place' visible={false} />
                            <Geom
                                type='line' position='time*place' size={1} opacity={1} shape={'hv'}
                                color={['label', this.state.labelColor]} 
                                active={false}
                            />
                        </Chart>
                    </div>
                    <div className='chart-whole'>
                        <Chart
                            height={this.state.chartHeight} data={dv} scale={scale} animate={false}
                            padding={{ top: 30, right: 20, bottom: 20, left: 60 }}
                            forceFit
                        >
                            <Coord type='rect' reflect='y' />
                            <Axis name='time' />
                            <Axis name='place' />
                            <Tooltip crosshairs={{ type: 'y' }} />
                            <Geom
                                type='line' position='time*place' size={1} opacity={1} shape={'hv'}
                                active={[true, {
                                    highlight: true, // 开启时没有激活的变灰
                                    style: { // 查找 html convas 属性
                                        lineWidth: 3
                                    },
                                }]}
                                color={['label', this.state.labelColor]} 
                                tooltip={['time*place*id*label', (time, place, id, label) => {
                                    return {
                                        // 自定义tooltip
                                        title: '时刻 ' + getTimeToClock(time) + ' ' + time + 's', 
                                        name: 'id ' + id + ' cat ' + label,
                                        value: place
                                    };
                                }]}
                            />
                        </Chart>
                    </div>
                </div>
            );
        }
    }
    return MyGraph;
}

// 父组件，获取初始数据
class MyTrack extends Component {
    constructor() {
        super();
        this.state = {
            data: []
        }
    }
    componentWillMount() {
        // 参数 traj='1', cluster='3' 第一个是第几天，第二个是聚类个数
        API_Track(this.traj='1', this.cluster='3').then(response => {
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

export default MyTrack;

// mysqldump --column-statistics=0  --host=115.159.202.238 -uchinavis -pchinavis2019 --databases chinavis2019 --tables cluster_By5 cluster_By6  cluster_By7 cluster_By8 cluster_By9 cluster_By10>  C:\Users\14403\Documents\dumps\day3.sql

