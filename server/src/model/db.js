const mysql      = require('mysql')
const poolRemote = mysql.createPool({
  host     : '115.159.202.238',   // 数据库地址
  user     : 'chinavis',    // 数据库用户
  password : 'chinavis2019' ,  // 数据库密码
  database : 'chinavis2019'  // 选中数据库
})

const poolLocal = mysql.createPool({   //本地
  host     : '127.0.0.1',  
  user     : 'root',    
  password : 'qweasd9095' ,  // 数据库密码 改成自己的密码
  database : 'chinavis2019'  // 选中数据库
})

let pool = poolRemote
// let pool = poolLocal

let query = function( sql, values ) {
  return new Promise(( resolve, reject ) => {
    pool.getConnection(function(err, connection) {
      if (err) {
        reject( err )
      } else {
        connection.query(sql, values, ( err, rows) => {

          if ( err ) {
            reject( err )
          } else {
            resolve( rows )
          }
          connection.release()
        })
      }
    })
  })
}



module.exports = query