const query      = require('./db.js')

class Traj{
  async getTrajs(hour) {
      let tableName  = 'trajectories_inf2'
      let id = 19137
      let sql = `SELECT x,y  FROM ${tableName} WHERE 
         floor = 1 AND   hour(time)  = ${hour} `
      
      let dataList = await query( sql )

      console.log(dataList.length)
    return await dataList;
  }
}

module.exports = new Traj();
