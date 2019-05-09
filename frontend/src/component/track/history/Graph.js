import React, { Component } from 'react';
import {G2,Chart,Geom,Axis,Tooltip,Coord,Label,Legend,View,Guide,Shape,Facet,Util} from "bizcharts";
import DataSet from '@antv/data-set';

import { connect } from 'react-redux';

class Graph extends Component {
    constructor () {
        super()
        this.state = {
            // 地点的文本显示 0 1 2345 6 7 8
            placeText : ['入/出口', '主会场', '分会场A', '分会场B', '分会场C', '分会场D', '餐厅', '休息室', '其他区域'],
            // 人员分类的颜色显示
            labelColor : ['red', 'blue', 'green'],
        };
    }

    // 转换秒数至小时，用于显示
    getTimeToHour (second, dayOn) {
        let hour = Math.floor(second/3600);
        let min = Math.floor((second - hour*3600)/60);
        let str = '';
        if(dayOn === true) str = str + 'DAY 1 ';

        if(hour < 10) str = str + '0';
        str = str + hour + ':';
        if(min < 10) str = str + '0';
        str = str + min;

        return str
    }

    render() {
        // label是人员的分类
        const data = [
            [
                {time:25240, place:0, label:0, id:'50001'},
                {time:32457, place:1, label:0, id:'50001'},
                {time:39457, place:1, label:0, id:'50001'},
                {time:42000, place:2, label:0, id:'50001'},
                {time:47000, place:2, label:0, id:'50001'},
                {time:55000, place:6, label:0, id:'50001'},
                {time:57000, place:7, label:0, id:'50001'},
                {time:64858, place:0, label:0, id:'50001'}
            ],
            [
                {time:24000, place:0, label:1, id:'52333'},
                {time:32000, place:1, label:1, id:'52333'},
                {time:33000, place:1, label:1, id:'52333'},
                {time:36000, place:4, label:1, id:'52333'},
                {time:40000, place:4, label:1, id:'52333'},
                {time:50000, place:6, label:1, id:'52333'},
                {time:60000, place:7, label:1, id:'52333'},
                {time:64000, place:0, label:1, id:'52333'}
            ],
            [
                {time:20000, place:0, label:2, id:'66666'},
                {time:23000, place:6, label:2, id:'66666'},
                {time:30000, place:6, label:2, id:'66666'},
                {time:35000, place:7, label:2, id:'66666'},
                {time:47000, place:6, label:2, id:'66666'},
                {time:58000, place:6, label:2, id:'66666'},
                {time:62000, place:6, label:2, id:'66666'},
                {time:63000, place:0, label:2, id:'66666'}              
            ]

        ];
        // 将label转换为字符串，这样分组颜色不会出错
        const dataTrans = data.reduce((res, cur) => {
            const list = cur.map(i => {
                return {
                    ...i,
                    label: `${i.label}`
                };
            });
            return res.concat(list);
        }, [])
        console.log(dataTrans) 
        // 数据轴
        const scale = {
            // 地点
            place: {
                type: 'linear',
                alias: '地点',
                range: [0, 1],
                formatter: (value) => {return this.state.placeText[value]},
                tickInterval: 1
            },
            // 时间
            time: {
                type: 'linear',
                alias: '时间',
                range: [0, 1],
                formatter: (value) => {return this.getTimeToHour(value, false)} ,
                tickInterval: 3600
            },
            // 分类
            label: {
                type: 'cat'
            },
            // id也是分类
            id: {
                type: 'cat'
            }
        };
        // 绘制图形
        return (
            <div className='graph-container'>
                <Chart height={640} data={dataTrans} scale={scale} 
                padding={{ top: 30, right: 20, bottom: 20, left: 60 }} forceFit>
                    <Coord type='rect' reflect='y'/>
                    <Axis name='time' />
                    <Axis name='place' />
                    <Tooltip 
                        crosshairs={{
                            type: 'y'
                        }}
                    />
                    <Geom 
                        type='line' 
                        position='time*place' 
                        size={2} 
                        opacity={0.75} 
                        shape={this.props.lineShape} 
                        color={['label', this.state.labelColor]} 
                        tooltip={['time*place*id', (time, place, id)=> {
                            return {
                                // 自定义tooltip
                                title: this.getTimeToHour(time, true),
                                name: 'id: ' + id,
                                value: this.state.placeText[place]
                            };
                        }]}
                    />
                    <Geom
                        type='point'
                        position='time*place'
                        color={['label', this.state.labelColor]}
                        tooltip={['time*place*id', (time, place, id)=> {
                            return {
                                // 自定义tooltip
                                title: this.getTimeToHour(time, true),
                                name: 'id: ' + id,
                                value: this.state.placeText[place]
                            };
                        }]}
                    />
                </Chart>
            </div>
        );
    }
}
        
export default Graph

