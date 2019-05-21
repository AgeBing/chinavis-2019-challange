const sankey = require('../model/sankey');

class SankeyController {
    async getTrack(ctx) {
        const { day, cluster, timeStart, timeEnd, limit} = ctx.request.body;
        let res = await sankey.getTrack(day, cluster, timeStart, timeEnd, limit);

        let timeInit = timeStart,
        	timeInterval = 30,
        	map = {}

        // 计算一定时间间隔内某人  主要在哪个房间 
        // 输出一个稀疏矩阵
        res.forEach((r)=>{
        	let { id,time,place,label } = r
        	time = Math.floor(time / 60)

        	let arr = map[id]
        	if(!map.hasOwnProperty(id)){
        		map[id] = []
        		arr = map[id]
			}

			let intervalIndex = Math.floor( (time - timeInit )/ timeInterval ),
				stayInterval = time - timeInterval * intervalIndex - timeInit 

			if( !arr[intervalIndex] || 
				( arr[intervalIndex] && stayInterval > arr[intervalIndex].stay) ){

				arr[intervalIndex] = {
					stay : stayInterval,
					place,
					label
				}
			}
        })


        function findNearst(id,index){
        	let arr = map[id]
        	for(let i = index;i >= 0;i--)
        		if(arr[i]) return arr[i].place

        	for(let i = index+1;i < arr.length;i++)
        		if(arr[i]) return arr[i].place
        }

        let ids = Object.keys(map)

        let room = {}

        // 时间间隔 到 房间 的矩阵
        // 也是稀疏矩阵
        ids.forEach((_id)=>{
        	let timeArr = map[_id]
        	timeArr.forEach((record,index)=>{
        		let place
        		if(!record){
        			place  = findNearst(id,index)
        		}else{
        			place = record.place
        		}
        		if(!room.hasOwnProperty(place)){
        			room[place] = []
        		}
        		room[place][index] = room[place][index] == null ? 1 : room[place][index]+1
        	})
        })




        ctx.body = { room };
    }
}

module.exports = new SankeyController();