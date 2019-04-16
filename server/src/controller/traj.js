const traj = require('../model/traj');


class TrajController {
  async trajs(ctx) {
  	const { hour } = ctx.request.body;
  	let res = await traj.getTrajs(hour)
	ctx.body = res ;
  }


}


module.exports = new TrajController();
