const query = require('./db.js')

class Sankey{
    async getTrack(day, cluster, timeStart, timeEnd, limit) {
        let sql;
        sql = `SELECT id, time, place, label FROM track_day${day}_cluster${cluster} 
        WHERE time >= ${timeStart * 60 } AND time <= ${timeEnd * 60} 
        LIMIT ${limit};`
        let dataList = await query( sql );
        return await dataList;
    }
}

module.exports = new Sankey();
