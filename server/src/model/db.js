const mysql      = require('mysql')
const pool = mysql.createPool({
  host     : '115.159.202.238',   // 数据库地址
  user     : 'chinavis',    // 数据库用户
  password : 'chinavis2019' ,  // 数据库密码
  database : 'chinavis2019'  // 选中数据库
})
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