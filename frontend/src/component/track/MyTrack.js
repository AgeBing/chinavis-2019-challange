import React, { Component } from 'react';

import {G2,Chart,Geom,Axis,Tooltip,Coord,Label,Legend,View,Guide,Shape,Facet,Util} from "bizcharts";
import DataSet from '@antv/data-set';

import { connect } from 'react-redux';
import { API_Track } from '../../api/index'

class MyTrack extends Component {
    constructor () {
        super()
        this.state = {
            // 人员分类的颜色显示
            labelColor : ['red', 'blue', 'green'],
            // 导入的数据
            data: [],
            // 图表高度
            chartHeight: 640
        };
    }

    // 挂载前读取数据（实际上仍然是异步的，会重新加载）
    componentWillMount(){
        this.getTrackData();
    }

    // 从数据库中读取数据
    getTrackData () {
        console.log('data download...');
        API_Track().then( response => {
            this.setState({
                data: response
            })
        })
        console.log('finish...');
    }

    // 时钟转换为time（这部分最后放进数据库预存储吧）
    getClockToTime (clock) {
        // clock = "14:03:00";
        let hour = clock.substr(0,2);      
        let min = clock.substr(3,2);
        let sec = clock.substr(6,2);
        return Number(hour)*3600 + Number(min)*60 + Number(sec);
    }

    // time转换为时钟 dayOn加上day的字样
    getTimeToClock (second, dayOn) {
        let hour = Math.floor(second/3600);
        let min = Math.floor((second - hour*3600)/60);
        let str = '';
        if(dayOn === true) str = str + 'DAY 1 ';
        if(hour < 10) str = str + '0';
        str = str + hour + ':';
        if(min < 10) str = str + '0';
        str = str + min;
        return str;
    }

    // 地名映射
    getPlaceText (place) {
        switch(place){
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

    render() {
        // 初始数据
        const data = this.state.data;
        // 处理数据 （在数据库里存储字符串下载快？还是在前端处理函数快？还是在后端处理完了再给前端快？）
        const dataTrans = data.map(i => {
            return {
                ...i,
                place: this.getPlaceText(i.place),
                time: this.getClockToTime(i.time)
            }
        });

        // 数据尺度配置
        const scale = {
            // 地点
            place: {
                type: 'cat',
                alias: '地点',
                range: [0, 1],
                values: [ '主会场','分会场A','分会场B','分会场C','分会场D','海报区','展厅','签到处','走廊/墙',
                            '扶梯','厕所','餐厅','休闲区','room1','room2','room3','room4','room5','room6','错误']
                // formatter: (value) => {return this.getPlaceText(value)},
                // tickInterval: 1
            },
            // 时间
            time: {
                type: 'linear',
                alias: '时间',
                range: [0, 1],
                formatter: (value) => {return this.getTimeToClock(value, false)}
                // tickInterval: 3600
            },
            // 分类
            // label: {
            //     type: 'cat'
            // },
            // id也是分类
            id: {
                type: 'cat',
                alias: '人员标记'
            }
        };
        // 绘制图形
        return (
            <div>
                <Chart height={this.state.chartHeight} data={dataTrans} scale={scale} padding={{ top: 30, right: 20, bottom: 20, left: 60 }} forceFit>
                    <Coord type='rect' reflect='y'/>
                    <Axis name='time' />
                    <Axis name='place' />
                    <Tooltip crosshairs={{type: 'y'}}/>
                    <Geom 
                        type='line' position='time*place' size={2} opacity={0.25} shape={this.props.lineShape} 
                        // color={['label', this.state.labelColor]} 
                        color='id'
                        tooltip={['time*place*id', (time, place, id)=> {
                            return {
                                // 自定义tooltip
                                title: this.getTimeToClock(time, true),
                                name: 'id: ' + id,
                                value: place
                            };
                        }]}
                    />
                    {/* <Geom
                        type='point' position='time*place'
                        // color={['label', this.state.labelColor]}
                        color='id'
                        tooltip={['time*place*id', (time, place, id)=> {
                            return {
                                // 自定义tooltip
                                title: this.getTimeToClock(time, true),
                                name: 'id: ' + id,
                                value: place
                            };
                        }]}
                    /> */}
                </Chart>
            </div>
        );
    }
}
        
export default MyTrack

