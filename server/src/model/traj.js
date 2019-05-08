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
         AND floor2 =${floor} LIMIT 0,100000 `  //LIMIT 0,10000

      let dataList = await query( sql )
      console.log(dataList.length)
    return await dataList;
  }

}

module.exports = new Traj();
