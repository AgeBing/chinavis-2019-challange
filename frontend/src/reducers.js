


const initialState = {
	showSensors:true,
	showRooms:true,
	showBricks:true,
	showTrajs:false,
	day:1,
	startHour:9,
	endHour:11
}

function appReducer( state = initialState , action , opation) {

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
		case 'HIDE_TRAJ':
			return {
				...state ,
				showTrajs : false   
			}
		break;


		case 'SWITCH_DAY':
			return {
				...state ,
				day : action.day   
			}
		break;

		case 'SWITCH_HOUR':
			return {
				...state ,
				startHour : action.startHour,
				endHour :  action.endHour,    
			}
		break;


	}

	return state
}

export default appReducer 