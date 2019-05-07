const initialState = {
	timeInterval : {
		day : 1,
		minites: [480, 720],
		times:[]
	},
	stateNodeId: 0
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
        stateNodeId: action.stateNodeId
      };
      break;

  }

  return state;
}

export default appReducer;
