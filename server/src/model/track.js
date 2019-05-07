const query = require('./db.js')

class Track{
    async getTrack() {
        let tableName = 'pre_traj_OrderByID_day1'
        let sql = `SELECT id AS id,time AS time,rid AS place 
                    FROM ${tableName} LIMIT 0,1000`
        let dataList = await query( sql )
        // console.log(dataList)
        return await dataList;
    }
}

module.exports = new Track();

// LIMIT 0,1000