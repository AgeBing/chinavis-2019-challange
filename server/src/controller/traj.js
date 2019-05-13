const traj = require('../model/traj');
const people = require('../model/people');



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
		
		// 人员统计  饼图
		// 按照 聚类结果 统计人员比例
		let groups = [] , groupsCount = []
		let peopleGroups  = await people.getGroups( uids.join(',') )
		
		peopleGroups.forEach((p)=>{
			let i = p.cluster
			if(!groupsCount[i])  groupsCount[i] = 1
			else groupsCount[i]++ 
		})

		groupsCount.forEach((v,i)=>{
			groups.push({
				cluster : "聚类"+i,
				count : v
			})
		})

		info['length'] = uids.length
		info['user'] = groups
		
		ctx.body = info;

		// 时间统计  每五分钟的活跃人数


		// 地点统计  高峰时段的人数


	}

	
}


module.exports = new TrajController();
