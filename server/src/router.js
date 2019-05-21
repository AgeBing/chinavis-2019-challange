const studentController = require("./controller/student");
const MapController = require("./controller/map");
const TrajController = require("./controller/traj");
const Heatmap_gridsController = require("./controller/Heatmap_grids");
const TrackController = require('./controller/track');
const PeopleController = require('./controller/people')
const SankeyController=require('./controller/sankey')

module.exports = router => {
  router.prefix("/api");
  router
    .get("/profile", studentController.profile)
    .post("/stu_overview", studentController.overview)
    .get("/grids1", MapController.grids_floor1)
    .get("/grids2", MapController.grids_floor2)
    .post("/rooms", MapController.rooms_floor)
    .post("/Heatmap_grids", Heatmap_gridsController.Heatmap_grids)
    .post("/trajs", TrajController.trajs)
    .post("/trajs_test", TrajController.trajsTest)
    .post("/trajs_uid", TrajController.trajUids)
    .post("/track", TrackController.getTrack)
    .post("/trajs_info", TrajController.trajInfo)
    .post('/userid_byclurster',PeopleController.getUids)
    .post('/sankey',SankeyController.getTrack)
};
