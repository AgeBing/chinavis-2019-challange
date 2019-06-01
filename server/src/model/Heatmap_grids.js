const query      = require('./db.js')

class Heatmap_grids{
  async getHeatmap_grids(Heatmap_minutes,day,floor) {//Heatmap_minutes:550,范围:550整个一分钟
      let tableName  = 'trajectories_inf'+day//id,sid,time,floor,x,y
      let start_time=Heatmap_minutes/60+":"+Heatmap_minutes%60+":00"
      let end_=Heatmap_minutes+1
      let end_time=end_/60+":"+end_%60+":00"
      let sql = `SELECT x,y,count(id) as count FROM ${tableName} WHERE 
        (HOUR(time)*60 + MINUTE(time))  >= ${Heatmap_minutes} AND
         (HOUR(time)*60 + MINUTE(time))  <= ${(Heatmap_minutes + 1)} 
          AND floor=${floor}
         group by x,y` 

      let dataList = await query( sql )
      // console.log(dataList)
      // console.log(dataList.length)
      console.log('dataList',dataList)
    return await dataList;
  }
}

module.exports = new Heatmap_grids();
