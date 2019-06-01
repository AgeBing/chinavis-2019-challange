const query      = require('./db.js')

class Heatmap_grids{
  async getHeatmap_grids(Heatmap_minutes,day,floor) {//Heatmap_minutes:550,范围:550整个一分钟
      let tableName  = 'trajectories_inf'+day//id,sid,time,floor,x,y
      let sql = `SELECT x,y,(HOUR(time)*60 + MINUTE(time)) as t_minutes,id FROM ${tableName} WHERE 
        (HOUR(time)*60 + MINUTE(time))  >= ${Heatmap_minutes-20} AND
         (HOUR(time)*60 + MINUTE(time))  <= ${(Heatmap_minutes +20)} 
          AND floor=${floor}
         order by id,time` //group by x,y

      let dataList = await query( sql )
      let new_datalist={}//{'x,y':count}
      let bef_id=''//上一个找到正确记录的id
      for (let i=1;i<dataList.length;i++)
      {
        //当前记录的id不是已找到正确记录的最新的id
        if (bef_id!=dataList[i]['id'] && (dataList[i-1]['id']==dataList[i]['id']) && (parseInt(dataList[i]['t_minutes'])>parseInt(Heatmap_minutes)))
          {
            
            bef_id=dataList[i-1]['id']//更新当前已找到正确记录的id
            let cur_key=dataList[i-1]['x']+','+dataList[i-1]['y']
            if(!new_datalist.hasOwnProperty(cur_key)){
              new_datalist[cur_key] = 1
            }
            else
              new_datalist[cur_key] += 1
          }
      }
      let sids= Object.keys(new_datalist) 
      let result=[]
      sids.forEach((sid_str)=>{//sid_str:'x,y'
        let sid=sid_str.split(',')
result.push([parseInt(sid[0]),parseInt(sid[1]),new_datalist[sid_str]])
      })
      
      // console.log('dataList finish',dataList.length,sids.length,result)
    return await result;
  }
}

module.exports = new Heatmap_grids();
