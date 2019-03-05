import mysql from 'mysql'
let config = {
  host: 'localhost',
  user: 'root',
  password: '123456',
  port: '3306',
  database: 'vue_proj'
}

class Mysql {
  constructor () {
    this.connection = mysql.createConnection(config)
    this.connection.connect()
  }
  async query (sql, param) {
    if (!sql) return
    let result = this.connection ? await this.connection.query(sql, param || []).catch(err => console.error(err)) : []
    return result
  }
  queryStartAtGridNum (gridNum, dcode) {
    let sql = 'select minx,miny,maxx,maxy from region_grid where dcode = ? limit ?,99999'
    return this.query(sql, [dcode, gridNum])
  }
}
export default Mysql
