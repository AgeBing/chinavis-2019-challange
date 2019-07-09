const mysql      = require('mysql')
const poolRemote = mysql.createPool({
  host     : '',   // 数据库地址
  user     : '',    // 数据库用户
  password : '' ,  // 数据库密码
  database : ''  // 选中数据库
})

const poolLocal = mysql.createPool({   //本地
  host     : 'localhost',  
  user     : 'root',    
  password : 'root' ,  // 数据库密码 改成自己的密码
  database : 'chinavis2019'  // 选中数据库
})

// let pool = poolRemote
let pool = poolLocal

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