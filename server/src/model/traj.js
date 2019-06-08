const query      = require('./db.js')

class Traj{
  async getTrajs(startHour,endHour,day,floor) {
      let tableName  = 'traj_sort_by_onehour'

      let sql = `SELECT *  FROM ${tableName} WHERE 
         day = ${day} AND   hour >= ${startHour} AND hour <= ${endHour}
         AND floor =${floor}`
      let dataList = await query( sql )
      console.log(dataList.length)
    return await dataList;
  }

  async getTrajsTest(startMiniter,endHMiniter,floor,day) {
      let tableName  = 'base_trajectory_day'+day
      let sql = `SELECT *  FROM ${tableName} WHERE 
         time1 >= ${startMiniter} AND time2 <= ${endHMiniter}
         AND floor2 =${floor} LIMIT 0,800000 `  //LIMIT 0,10000

      let dataList = await query( sql )
    return await dataList;
  }


  async getUids(startMiniter,endHMiniter,day,rids) {
      //之前的可能会导致找不到符合条件的记录，因为时间被合并了，
      //例如记录为9点和12点，而约束为10点和11,但当前的算法误差也较小，可以不改
      let tableName  = 'try_traj_mergetime_day'+day,//'trajectories_inf'+day,
          sql
      if(!rids){ // rids 为空表示 无地点限制
       sql = `SELECT DISTINCT  id  FROM ${tableName} WHERE 
        (
        (HOUR(time)*60 + MINUTE(time))  >= ${startMiniter}  AND 
        (HOUR(time)*60 + MINUTE(time))  <= ${endHMiniter}
        )
        OR 
        (
        (HOUR(time)*60 + MINUTE(time))  < ${startMiniter} AND 
        (HOUR(time)*60 + MINUTE(time)+SECOND(time)/60+len_minutes)  >= ${endHMiniter}
        )`  
         //记录的起始时刻早于start，但是终止时刻晚于end     
      }else{
          sql = `SELECT DISTINCT  id  FROM ${tableName} WHERE 
        (
        (HOUR(time)*60 + MINUTE(time))  >= ${startMiniter}  AND 
        (HOUR(time)*60 + MINUTE(time))  <= ${endHMiniter}  
        OR 
        ((HOUR(time)*60 + MINUTE(time))  < ${startMiniter} AND 
        (HOUR(time)*60 + MINUTE(time)+SECOND(time)/60+len_minutes)  >= ${endHMiniter})
        )
        AND
        rid in (${rids}) `
      }
      let dataList = await query( sql )
    return await dataList;
  }

  async getTrajsByTimeAndUid(startMiniter,endHMiniter,floor,day,uids) {
      let tableName  = 'base_trajectory_day'+day
      let sql = `SELECT *  FROM ${tableName} WHERE id IN (${uids})  AND 
         time1 >= ${startMiniter} AND time2 <= ${endHMiniter}
         AND floor2=${floor}`// LIMIT 0,8000


      let dataList = await query( sql )
    return await dataList;
  }

  // 获取某一时间段内 某个房间的访问人数
  async getTrajsCountByTimeIntervalAndRoom(startMiniter,endHMiniter,day,rid) {
      let tableName  = 'try_traj_mergetime_day'+day
      let sql = `SELECT DISTINCT id  FROM ${tableName} WHERE 
       (
        ((HOUR(time)*60 + MINUTE(time))  >= ${startMiniter}  AND 
        (HOUR(time)*60 + MINUTE(time))  <= ${endHMiniter} )
        OR 
        ((HOUR(time)*60 + MINUTE(time))  < ${startMiniter} AND 
        (HOUR(time)*60 + MINUTE(time)+SECOND(time)/60+len_minutes)  >= ${endHMiniter})
       )
         AND
        rid = ${rid} `

    let dataList = await query( sql )

    return await dataList.length;
  }

  // 获取某一时间段内 某些房间的访问情况
  async getTrajsByTimeIntervalAndRooms(startMiniter,endHMiniter,day,rids,uids) {
      let tableName  = 'try_traj_mergetime_day'+day
      let sql
      if( uids ){
         sql = `SELECT  id , rid    FROM ${tableName} WHERE 
           (
            ((HOUR(time)*60 + MINUTE(time))  >= ${startMiniter}  AND 
            (HOUR(time)*60 + MINUTE(time))  <= ${endHMiniter} )
            OR 
            ((HOUR(time)*60 + MINUTE(time))  < ${startMiniter} AND 
            (HOUR(time)*60 + MINUTE(time)+SECOND(time)/60+len_minutes)  >= ${endHMiniter})
           )
            AND id IN (${uids})
             AND rid in (${rids}) order by id 
             `
            // console.log('sql1')
      }else{
            sql = `SELECT  id , rid    FROM ${tableName} WHERE 
               (
                ((HOUR(time)*60 + MINUTE(time))  >= ${startMiniter}  AND 
                (HOUR(time)*60 + MINUTE(time))  <= ${endHMiniter} )
                OR 
                ((HOUR(time)*60 + MINUTE(time))  < ${startMiniter} AND 
                (HOUR(time)*60 + MINUTE(time)+SECOND(time)/60+len_minutes)  >= ${endHMiniter})
               )
                 AND
                rid in (${rids}) order by id `
                // console.log('sql2')
      }

    let dataList = await query( sql )

    return await dataList;
  }



  async getRoomName(rid) {
    let tableName  = 'room'
    let sql = `SELECT name FROM ${tableName} WHERE id = ${rid}`
    let dataList = await query( sql )

    return await dataList[0];
  }

}

module.exports = new Traj();
