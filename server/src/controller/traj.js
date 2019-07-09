const traj = require('../model/traj');

function m_t(min) {
	let h = Math.floor(min / 60),
		m = min - h * 60

	h =  h < 10 ? '0'+ h : ''+h
	m =  m < 10 ? '0'+ m : ''+m 

	return h + ':' +m
}

class TrajController {
	async trajUids(ctx) {
		const { startMiniter,endMiniter,day,rids,floor,ids } = ctx.request.body;

		let uids = []
		let ridsArr = rids
		console.log(startMiniter,endMiniter,day,rids,floor)
		let ridsStr = ridsArr.join(',')

		// 如果有地理条件现实，就去查符合条件的人
		if(rids.length!=0){
			let uidsObj = await traj.getUids(startMiniter,endMiniter,day,ridsStr)
			uids = uidsObj.map((obj)=>obj.id)
		}else if(ids.length != 0){  //将参数中的人拿出来直接去查
			uids = ids
		}

		console.log(uids.length)
		
		if(uids.length ==0){
			ctx.body = []
			return 
		}
		let uidsStr = uids.join(',')


		// 查询所有点
		// 这些人 在 起止时间 经过的
		let points = await traj.getTrajsByTimeAndUid(startMiniter*60,endMiniter*60,floor,day,uidsStr )
		

		// 把点组装成轨迹
		let trajs = []
		points.forEach((p)=>{
			let traj_count = trajs.length

			if( !traj_count || trajs[traj_count - 1][0].id != p.id ){
				trajs.push([])
			}
			trajs[trajs.length - 1].push(p)
		})
		
		console.log('len:',trajs.length)

		ctx.body = trajs;
	}
	async trajInfo(ctx){
		const { startMiniter,endMiniter,day,rids } = ctx.request.body;
		let uids = []
		// 符合地理结果的人员
		let uidsObj = await traj.getUids(startMiniter,endMiniter,day,rids.join(','))
		uids = uidsObj.map((obj)=>obj.id)

		let info = {}
		console.log('user length ',uids.length)
		
		if(uids.length ==0){
			info['length'] = 0
			info['user'] = []
			info['uids'] = []
			info['rooms'] = []
			ctx.body = info
			return 
		}
		info['length'] = uids.length
		info['uids'] = uids
		// 地点统计  统计每个时间段各个放假内的人数
		let rooms = []
		//  时间统计 将时间条件分成固定个数的时间段
		let timeIntervalCount = 15  // 将起始时间和结束时间分词20段 
		let intervals = []
		let interval_length = Math.floor( ( endMiniter  - startMiniter ) / timeIntervalCount)
		if(interval_length <= 0){
			intervals = []
		}else if(interval_length == 1){
			for(let i = 0;i <= timeIntervalCount;i++){
				intervals.push( startMiniter + i  )
			}
		}else{
			for(let i = 0;i <= timeIntervalCount;i++){
				intervals.push( startMiniter + i * interval_length )
			}
		}
		// 查询每个时间段，每个房间的人数
		for(let r = 0;r < rids.length; r++){
				let rid = rids[r]
				let roomName = await traj.getRoomName(rid)
				for(let t = 0;t < intervals.length; t++){
					let s = intervals[t],
					e=s+1
					let c = await  traj.getTrajsCountByTimeIntervalAndRoom(s,e,day,rid)
					rooms.push({
						time : m_t(s),        // 时间段表示的是前后的两个时间节点 这段时间的人数
						name  : roomName['name'],
						count: c
					})

				}
		}
		info['rooms'] = rooms
		ctx.body = info;
	}	
}


module.exports = new TrajController();
