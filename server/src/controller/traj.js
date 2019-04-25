const traj = require('../model/traj');


class TrajController {
  async trajs(ctx) {
  	const { startHour,endHour,day,floor } = ctx.request.body;
  	console.log( startHour,endHour,day )
  	let res = await traj.getTrajs(startHour,endHour ,day,floor)
	ctx.body = res ;
  }


}


module.exports = new TrajController();
