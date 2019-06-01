const query      = require('./db.js')

class Heatmap_grids{
  async getHeatmap_grids(Heatmap_minutes,day,floor) {//Heatmap_minutes:550,范围:550整个一分钟
      let tableName  = 'trajectories_inf'+str(day)//id,sid,time,floor,x,y
      let start_time=str(int(Heatmap_minutes/60))+":"+str(Heatmap_minutes%60)+":00"
      let end_=Heatmap_minutes+1
      let end_time=str(int(end_/60))+":"+str(end_%60)+":00"
      let sql = `SELECT x,y,count(id)  FROM ${tableName} WHERE 
         time >= ${startHour} AND time <= ${endHour} AND floor=${floor}
         group by x,y` 
      console.log(sql)
      let dataList = await query( sql )
      // console.log(dataList)
      // console.log(dataList.length)
      console.log('dataList',dataList)
    return await dataList;
  }
}

module.exports = new Heatmap_grids();
