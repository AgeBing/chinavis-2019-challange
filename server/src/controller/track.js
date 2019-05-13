const track = require('../model/track');

class TrackController {
    async getTrack(ctx) {
        const {day, cluster, limit} = ctx.request.body;
        console.log('Track - paramara - ', day, cluster, limit);
        let res = await track.getTrack(day, cluster, limit);
        ctx.body = res;
    }
}

module.exports = new TrackController();