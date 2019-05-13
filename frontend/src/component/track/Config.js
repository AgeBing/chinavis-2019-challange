// 人员分类的颜色显示
export let labelColor = ['#d7191c','#fdae61','#2c7bb6']
// 图表高度,BizChart的宽度是自适应屏幕的
export let chartHeightShow = 360
export let chartHeightBrush = 200
// 地点轴的显示情况
export let placeArray = ['主会场', '分会场A', '分会场B', '分会场C', '分会场D', '海报区', '展厅', '签到处', '走廊/墙',
'扶梯', '厕所', '餐厅', '休闲区', 'room1', 'room2', 'room3', 'room4', 'room5', 'room6', '错误']

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

// 地名映射
export function getPlaceText(place) {
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