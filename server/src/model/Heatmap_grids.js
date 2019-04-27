const query      = require('./db.js')

class Heatmap_grids{
  async getHeatmap_grids(startHour,endHour,day,floor) {
      let tableName  = 'sensor_count_byhour'
      let sql = `SELECT *  FROM ${tableName} WHERE 
         day = ${day} AND   time >= ${startHour} AND time <= ${endHour} AND floor=${floor}` 
      console.log(sql)
      let dataList = await query( sql )
      // console.log(dataList)
      // console.log(dataList.length)
    return await dataList;
  }
}

module.exports = new Heatmap_grids();
