const initialState = {
    timeInterval: {
        day: 1,
        minites: [480, 1080],
        times: [],
    },
    ids:[],
    stateNodeId: 0,
    // rooms:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24],
    rooms: [1, 2, 4],
    opacity: 0.50,
    cluster: 4,

    clusterNum : 0,   //视图联动 用户选择某一各聚类的人员  0表示全部

    selectIdsGlobal: []  //用户选中的轨迹 id 数组
};

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
                opacity: action.opacity
            };
            break;

        case "CHANGE_CLUSTERNUM":
            return {
                ...state,
                clusterNum:action.clusterNum
            }

        case "CHANGE_SELECT_TRAJ_IDS":
            return {
                ...state,
                selectIdsGlobal: action.ids
            }
        default:
            return state;

    }

    return state;
}

export default appReducer;
