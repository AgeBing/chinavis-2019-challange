const query      = require('./db.js')
const tableName  = 'student_info'
class Student {
  async getOverview(grade) {
      let term = '2018-2019-1'
      // let grade = '高二'
      let sql = `SELECT *  FROM ${tableName} WHERE 
          cla_term LIKE '${term}' AND
          cla_Name LIKE '%${grade}%'
          `
      
      let dataList = await query( sql )
      
      let list = dataList.map((d)=>{
        return {
          sex: d.bf_sex,
          cla: d.cla_Name
        }
      })
      console.log(grade,list)
    return await list;
  }
}

module.exports = new Student();
