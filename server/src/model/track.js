const query = require('./db.js')

class Track{
    async getTrack(day, cluster, timeStart, timeEnd, limit) {
        let sql;
        if (limit === 0){ //全部
            sql = `SELECT id, time, place, label FROM track_day${day}_cluster${cluster} 
            WHERE time >= ${timeStart} AND time <= ${timeEnd}
            AND place!=0 AND place!=21 AND place!=22 AND place!=23 AND place!=24;`
        }
        else {
            sql = `SELECT id, time, place, label FROM track_day${day}_cluster${cluster} 
            WHERE time >= ${timeStart} AND time <= ${timeEnd} 
            AND place!=0 AND place!=21 AND place!=22 AND place!=23 AND place!=24
            LIMIT ${limit};`
        }
        console.log('Track - sql - ', sql);
        let dataList = await query( sql );
        return await dataList;
    }
}

module.exports = new Track();

// SELECT * FROM chinavis2019.trajectory_MergeTime_day1 where time2 >= 50000 and time2 <= 60000 limit 10;

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