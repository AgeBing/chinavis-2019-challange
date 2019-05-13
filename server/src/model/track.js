const query = require('./db.js')

class Track{
    async getTrack(day, cluster, limit) {
        day = day || '1';
        cluster = cluster || '3';
        let sql = ``;
        if (limit === 'all'){
            sql = `SELECT * FROM track_day${day}_cluster${cluster};`
        }
        else {
            sql = `SELECT * FROM track_day${day}_cluster${cluster} LIMIT 0, ${limit};`
        }
        console.log('Track - sql - ', sql);
        let dataList = await query( sql );
        return await dataList;
    }
}

module.exports = new Track();

// LIMIT 0,1000

// let sql = `SELECT id AS id,time AS time,rid AS place 
// FROM ${tableName} LIMIT 0,1000`

// 在数据库中连接两个表后返回，时间消耗大
// traj = traj || '1';
// cluster = cluster || '3';
// let trajTable = 'traj_mergetime_day' + traj;
// let clusterTable = 'cluster_by' + cluster;
// let sql = `SELECT traj.id AS id, traj.time AS time, traj.rid AS place, cluster AS label
//             FROM ${trajTable} AS traj, ${clusterTable} AS cluster
//             WHERE traj.id = cluster.id
//             LIMIT 0,10000;`
// let dataList = await query( sql )
// return await dataList;