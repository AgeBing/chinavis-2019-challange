const map = require('../model/map');


class MapController {
  async grids_floor1(ctx) {
  	let res = await map.getGrids(1)
	ctx.body = res ;
  }
  async grids_floor2(ctx) {
  	let res = await map.getGrids(2)
	ctx.body = res ;
  }
  async rooms_floor1(ctx) {
  	let res = await map.getRooms(1)
	ctx.body = res ;
  }

}


module.exports = new MapController();
