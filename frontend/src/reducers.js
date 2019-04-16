


const initialState = {
	showSensors:true,
	showRooms:true,
	showBricks:true,
	showTrajs:false,
}

function appReducer( state = initialState , action) {

	switch( action.type ){
		case 'HIDE_SENSOR':
			return {
				...state ,    //复制state的所有属性,未修改原state ES6中的共享结构对象
				showSensors : false  //将该参数覆盖 
			}// 于是就返回了一个新的 state 
		break;
		case 'SHOW_SENSOR':
			return {
				...state ,
				showSensors : true   
			}
		break;

		case 'SHOW_ROOM':
			return {
				...state ,
				showRooms : true   
			}
		break;
		case 'HIDE_ROOM':
			return {
				...state ,
				showRooms : false   
			}
		break;

		case 'SHOW_TRAJ':
			return {
				...state ,
				showTrajs : true   
			}
		break;
		case 'HIDE_ROOM':
			return {
				...state ,
				showTrajs : false   
			}
		break;


	}

	return state
}

export default appReducer 