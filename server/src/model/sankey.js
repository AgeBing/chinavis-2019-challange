const query = require('./db.js')

class Sankey{
    async getTrack(day, cluster, timeStart, timeEnd, limit) {
        let beginTime = +new Date();
        let sql,sql_cluster;
        //place ==rid
        //by xwx
        // let tableName='traj_mergetime_day'+day
        // let cluster_type='cluster_By'+cluster
        sql = `SELECT id, (HOUR(time)*3600 + MINUTE(time)*60+SECOND(time)) as time, place,label  FROM traj_day${day}_cluster${cluster}
         WHERE 
        (
        (HOUR(time)*60 + MINUTE(time))  >= ${timeStart}  AND 
        (HOUR(time)*60 + MINUTE(time))  <= ${timeEnd}
        )
        OR 
        (
        (HOUR(time)*60 + MINUTE(time))  < ${timeStart} AND 
        (HOUR(time)*60 + MINUTE(time)+SECOND(time)/60+len_minutes)  >= ${timeEnd}
        )
        LIMIT ${limit};`
        // console.log(sql)  
        // sql = `SELECT id, time, place, label FROM track_day${day}_cluster${cluster} 
        // WHERE time >= ${timeStart * 60 } AND time <= ${timeEnd * 60} 
        // LIMIT ${limit};`
        
        let dataList = await query( sql );
        let endTime = +new Date();
        console.log("sankey用时共计"+(endTime-beginTime)+"ms",dataList.length);
        return await dataList;
    }

    async getRooms(){
    	let sql;
    	sql = `SELECT id, name FROM room;`
    	let dataList = await query( sql )
    	return await dataList
    }

}

module.exports = new Sankey();
