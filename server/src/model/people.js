const query = require('./db.js')

class People{
    async getGroups(uids) {
    	let table = 'cluster_By3'
        let sql = `SELECT * FROM ${table}
        			where id IN (${uids});`
        let dataList = await query( sql );
        return await dataList;
    }

    async getUidByCNum(cnum) {
    	let table = 'cluster_By3'
        let sql = `SELECT * FROM ${table}
        			where cluster =  ${cnum} ;`
        let dataList = await query( sql );
        return await dataList;
    }
}

module.exports = new People();