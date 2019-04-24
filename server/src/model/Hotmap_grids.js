const query      = require('./db.js')

class Hotmap_grids{
  async getHotmap_grids(startHour,endHour,day,floor) {
      let tableName  = 'sensor_count_byhour'
      let sql = `SELECT *  FROM ${tableName} WHERE 
         day = ${day} AND   time >= ${startHour} AND time <= ${endHour} AND floor=${floor}` 
      console.log(sql)
      let dataList = await query( sql )
      console.log(dataList)
      console.log(dataList.length)
    return await dataList;
  }
}

module.exports = new Hotmap_grids();
