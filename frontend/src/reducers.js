let timeSample = {
        day: 1,
        minites: [480, 725],
        times: [],
    }

const initialState = {
    timeInterval: JSON.parse(JSON.stringify(timeSample)),   // 给timeline的
    selectTimeInterval: JSON.parse(JSON.stringify(timeSample)), //给视图作为时间条件的
    rooms: [1, 2, 4],       //给视图作为地理条件
    ids:[],
    stateNodeId: 0,
    opacityTraj: 0.50,
    cluster: 4,

    clusterNum : 0,   //视图联动 用户选择某一各聚类的人员  0表示全部

    selectIdsGlobal: [],  //用户选中的轨迹 id 数组

    mode:'heat'|| 'traj',
    cursorTime:480,  //热力图显示的单个时刻 
};
console.log(initialState)

function appReducer(state = initialState, action, opation) {
    switch (action.type) {
        case "HIDE_SENSOR":
            return {
                ...state, //复制state的所有属性,未修改原state ES6中的共享结构对象
                showSensors: false //将该参数覆盖
            }; // 于是就返回了一个新的 state
            break;

        case "CHANGE_STATE":
            return {
                ...state,
                timeInterval: action.timeInterval,
                stateNodeId: action.stateNodeId,
                rooms: action.rooms,
                ids: action.ids
            };
            break;

        case "CHANGE_OPACITY":
            return {
                ...state,
                opacityTraj: action.opacity
            };
            break;

        case "CHANGE_CLUSTERNUM":
            return {
                ...state,
                clusterNum:action.clusterNum
            }
            break;

        case "CHANGE_SELECT_TRAJ_IDS":
            return {
                ...state,
                selectIdsGlobal: action.ids
            }
            break;
        case "CHANGE_SELECT_TIME":
            return {
                ...state,
                selectTimeInterval:action.timeInterval
            }
            break;

        case "CHANGE_MAP_MODE":
            return {
                ...state,
                mode:action.mode
            }
            break;

        case "CHANGE_CURSOR_TIME":
            return {
                ...state,
                cursorTime:action.cursorTime
            }
            break;

        default:
            return state;

    }

    return state;
}

export default appReducer;
