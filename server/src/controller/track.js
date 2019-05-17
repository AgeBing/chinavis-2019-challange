const track = require('../model/track');

class TrackController {
    async getTrack(ctx) {
        const {day, cluster, timeStart, timeEnd, limit} = ctx.request.body;
        console.log('Track - paramara - ', day, cluster, timeStart, timeEnd, limit);
        let res = await track.getTrack(day, cluster, timeStart, timeEnd, limit);
        ctx.body = res;
    }
}

module.exports = new TrackController();