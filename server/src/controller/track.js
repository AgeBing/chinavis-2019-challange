const track = require('../model/track');

class TrackController {
    async getTrack(ctx) {
        let res = await track.getTrack()
        // console.log('233')
        // console.log(res)
        ctx.body = res;
    }
}

module.exports = new TrackController();