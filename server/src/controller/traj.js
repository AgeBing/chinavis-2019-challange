const traj = require('../model/traj');


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
	
}


module.exports = new TrajController();
