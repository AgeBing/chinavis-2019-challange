const traj = require('../model/traj');
const people = require('../model/people');


function m_t(min) {
	let h = Math.floor(min / 60),
		m = min - h * 60

	h =  h < 10 ? '0'+ h : ''+h
	m =  m < 10 ? '0'+ m : ''+m 

	return h + ':' +m
}

class TrajController {
  async trajs(ctx) {
  	const { startHour,endHour,day,floor } = ctx.request.body;
  	console.log( startHour,endHour,day )
  	let res = await traj.getTrajs(startHour,endHour ,day,floor)
	ctx.body = res ;
  }
  async trajsTest(ctx) {
  	const { startMiniter,endMiniter,day,floor } = ctx.request.body;

  	let res = await traj.getTrajsTest(startMiniter*60,endMiniter*60 ,floor ,day)
	
	let trajs = []
	res.forEach((p)=>{
		let traj_count = trajs.length

		if( !traj_count || trajs[traj_count - 1][0].id != p.id ){
			trajs.push([])
		}
		trajs[trajs.length - 1].push(p)
	})
	ctx.body = trajs ;
  }

	async trajUids(ctx) {
		const { startMiniter,endMiniter,day,rids,floor } = ctx.request.body;

		let ridsArr = rids
		console.log(startMiniter,endMiniter,day,rids,floor)

		let ridsStr = ridsArr.join(',')

		let uidsObj = await traj.getUids(startMiniter,endMiniter,day,ridsStr)

		let uids = uidsObj.map((obj)=>obj.id)


		console.log(uids.length)
		
		if(uids.length ==0){
			
			ctx.body = []
			return 
		}
		let uidsStr = uids.join(',')


		let points = await traj.getTrajsByTimeAndUid(startMiniter*60,endMiniter*60,floor,day,uidsStr )
		


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
		
		// 符合地理结果的人员
		let uidsObj = await traj.getUids(startMiniter,endMiniter,day,rids.join(','))

		let uids = uidsObj.map((obj)=>obj.id)

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

		// 人员统计  饼图
		// 按照 聚类结果 统计人员比例
		// let groups = [] , groupsCount = []
		// let peopleGroups  = await people.getGroups( uids.join(',') )
		
		// peopleGroups.forEach((p)=>{
		// 	let i = p.cluster
		// 	if(!groupsCount[i])  groupsCount[i] = 1
		// 	else groupsCount[i]++ 
		// })

		// groupsCount.forEach((v,i)=>{
		// 	groups.push({
		// 		cluster : "聚类"+(i + 1),     // 手动加一  从 1 开始数  
		// 		count : v
		// 	})
		// })

		info['length'] = uids.length

		info['uids'] = uids

		// 时间统计  每五分钟的活跃人数


		// 地点统计  统计每个时间段各个放假内的人数
		let rooms = []
		let timeIntervalCount = 15  // 将起始时间和结束时间分词20段 
		let intervals = []
		let interval_length = Math.floor( ( endMiniter  - startMiniter ) / timeIntervalCount)
		if(interval_length <= 0){
			intervals = []
		}else if(interval_length == 1){
			// intervals = [startMiniter,endMiniter]
			for(let i = 0;i <= timeIntervalCount;i++){
				intervals.push( startMiniter + i  )
			}
		}else{
			for(let i = 0;i <= timeIntervalCount;i++){
				intervals.push( startMiniter + i * interval_length )
			}

		}
		for(let r = 0;r < rids.length; r++){
				let rid = rids[r]
				let roomName = await traj.getRoomName(rid)
				for(let t = 0;t < intervals.length; t++){
					let s = intervals[t],
					e=s+1
						// m = intervals[t],
						// e = intervals[t]
					// let d1 = datetime.datetime.strptime(s, '%H:%M:%S')+datetime.timedelta(minutes=1)
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
