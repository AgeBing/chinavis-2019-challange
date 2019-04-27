const Heatmap_grids = require('../model/Heatmap_grids');


class Heatmap_gridsController {
  async Heatmap_grids(ctx) {
  	const { startHour,endHour,day,floor } = ctx.request.body;
  	console.log( startHour,endHour,day,floor ,'---------------------------------')
  	let res = await Heatmap_grids.getHeatmap_grids(startHour,endHour ,day ,floor)
	ctx.body = res ;
  }


}


module.exports = new Heatmap_gridsController();
