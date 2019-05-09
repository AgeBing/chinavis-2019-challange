const initialState = {
	timeInterval : {
		day : 1,
		minites: [480, 720],
		times:[],
	},
	stateNodeId: 0,
  // rooms:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24],
  rooms:[1,2,4] ,
  opacity: 0.50
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
        rooms:action.rooms
      };
      break;

    case "CHANGE_OPACITY":
      return {
        ...state,
        opacity:action.opacity
      };
      break;


  }

  return state;
}

export default appReducer;
