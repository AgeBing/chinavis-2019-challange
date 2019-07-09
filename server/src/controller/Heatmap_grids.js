const Heatmap_grids = require('../model/Heatmap_grids');


class Heatmap_gridsController {
  async Heatmap_grids(ctx) {
  	const {Heatmap_minutes,day,floor } = ctx.request.body;
  	let res = await Heatmap_grids.getHeatmap_grids(Heatmap_minutes ,day ,floor)
	ctx.body = res ;
  }
}


module.exports = new Heatmap_gridsController();
