const query      = require('./db.js')

class Map{
  async getGrids(floor) {
      let tableName  = 'sensor'
      let sql = `SELECT *  FROM ${tableName} WHERE 
          floor =  ${floor}`

      let dataList = await query( sql )
    return await dataList;
  }

  async getRooms(floor) {
      let tableName  = 'room'
      let sql = `SELECT *  FROM ${tableName} WHERE 
          floor =  ${floor}`
      
      let dataList = await query( sql )

      // console.log(dataList)
    return await dataList;
  }
}

module.exports = new Map();
