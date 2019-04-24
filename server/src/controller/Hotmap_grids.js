const Hotmap_grids = require('../model/Hotmap_grids');


class Hotmap_gridsController {
  async Hotmap_grids(ctx) {
  	const { startHour,endHour,day,floor } = ctx.request.body;
  	console.log( startHour,endHour,day,floor ,'---------------------------------')
  	let res = await Hotmap_grids.getHotmap_grids(startHour,endHour ,day ,floor)
	ctx.body = res ;
  }


}


module.exports = new Hotmap_gridsController();
