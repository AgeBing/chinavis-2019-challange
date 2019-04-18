const query      = require('./db.js')

class Traj{
  async getTrajs(startHour,endHour,day) {
      let tableName  = 'traj_sort_by_onehour'

      let sql = `SELECT *  FROM ${tableName} WHERE 
         day = ${day} AND   hour >= ${startHour} AND hour <= ${endHour}`
      let dataList = await query( sql )
      console.log(dataList.length)
    return await dataList;
  }
}

module.exports = new Traj();
