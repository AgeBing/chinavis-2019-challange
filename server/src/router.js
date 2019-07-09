const MapController = require("./controller/map");
const TrajController = require("./controller/traj");
const Heatmap_gridsController = require("./controller/Heatmap_grids");
const SankeyController=require('./controller/sankey')

module.exports = router => {
  router.prefix("/api");
  router
    .post("/rooms", MapController.rooms_floor)
    .post("/Heatmap_grids", Heatmap_gridsController.Heatmap_grids)
    .post("/trajs_uid", TrajController.trajUids)
    .post("/trajs_info", TrajController.trajInfo)
    .post('/sankey_test',SankeyController.getSankeyData)
};
