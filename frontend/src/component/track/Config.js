// 配置文件

// 非常重要！！！ 
// true使用自己设定的参数查询数据库 
// false使用系统的redux共享状态联动
const useMyOwn = true

// 数据库查询 & 颜色配置
// limit 查询多少条 0代表所有行数据
export function getPostData(timeInterval, rooms, cluster) {
    if(useMyOwn === true) {
        labelColorArray = labelColor[3];
        return {day:3, cluster:3, timeStart:0, timeEnd:86400, limit:1000};
    }
    const timeStart = timeInterval.minites[0] * 60;
    const timeEnd = timeInterval.minites[1] * 60;
    const day = timeInterval.day;
    labelColorArray = labelColor[cluster];
    return {day:day, cluster:cluster, timeStart:timeStart, timeEnd:timeEnd, limit:1000};
}

// 人员分类的颜色显示
let labelColorArray = []

const labelColor = {
    2 : ['#d7191c','#fdae61'],
    3 : ['#d7191c','#fdae61','#abd9e9'],
    4 : ['#d7191c','#fdae61','#abd9e9','#2c7bb6'],
    5 : ['#d7191c','#fdae61','#ffffbf','#abd9e9','#2c7bb6'],
    6 : ['#d73027','#fc8d59','#fee090','#e0f3f8','#91bfdb','#4575b4'],
    7 : ['#d73027','#fc8d59','#fee090','#ffffbf','#e0f3f8','#91bfdb','#4575b4'],
}

// 图表高度,BizChart的宽度是自适应屏幕的
export let chartHeightShow = 360
export let chartHeightBrush = 200

// 地点轴的显示情况
export let placeArray = ['分会场D', '分会场C', '分会场B', '分会场A', '海报区', '展厅', '主会场', '签到处',
'走廊/扶梯', '厕所', 'room', '休闲区','餐厅']

// 地名映射
export function getPlaceText(place) {
    const p = Number(place);
    switch (p) {
        case 0: return '走廊/扶梯';
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
        case 10: 
        case 11: 
        case 13: 
        case 14: 
        case 17: 
        case 20: return 'room';
        case 12: return '服务台';
        case 16: return '餐厅';
        case 18: return '休闲区';
        case 21:
        case 22:
        case 23:
        case 24: return '走廊/扶梯';
        default: return '错误';
    }
}

// 改变数据格式
export function getDataTrans(Data) {
    const dataTrans = Data.map(i => {
        return {
            ...i,
            place: getPlaceText(i.place),
        }
    });
    // console.log('处理后的全部数据', dataTrans);
    return dataTrans;
}

// 数据尺度配置
export const scale = {
    place: {
        type: 'cat',
        alias: '地点',
        range: [0, 1],
        values: placeArray,
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
        alias: '聚类标记',
    },
    id: {
        type: 'cat',
        alias: '人员标记',
    }
}

// 颜色映射
export function getLabelColor(label) {
    return labelColorArray[label];                                   
}

// 时钟转换为time
export function getClockToTime(clock) {
    // clock = "14:03:00";
    let hour = clock.substr(0, 2);
    let min = clock.substr(3, 2);
    let sec = clock.substr(6, 2);
    return Number(hour) * 3600 + Number(min) * 60 + Number(sec);
}

// time转换为时钟
export function getTimeToClock(second) {
    let hour = Math.floor(second / 3600);
    let min = Math.floor((second - hour * 3600) / 60);
    let str = '';
    if (hour < 10) str = str + '0';
    str = str + hour + ':';
    if (min < 10) str = str + '0';
    str = str + min;
    return str;
}

