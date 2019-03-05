import oracledb from 'oracledb'
let config = {
  user: 'sde',
  password: 'sde',
  connectString: '10.45.59.170:1521/gisdb'
}

class Oracle {
  constructor () {
    this.connection = null
    this.getConnection()
  }
  getConnection () {
    oracledb.getConnection(config, (err, connection) => {
      if (err) {
        console.error(err.message)
        return
      }
      this.connection = connection
    })
  }
  testConnection () {
    this.connection && this.connection.execute('select 1 from dual', (err, result) => {
      if (err) {
        console.error(err.message)
        this.doRelease(this.connection)
        return
      }
      // 打印返回的表结构
      console.log(result.metaData)
      // 打印返回的行数据
      console.log(result.rows)
    })
  }
  static doRelease (connection) {
    connection && connection.close(err => {
      if (err) {
        console.error(err.message)
      }
    })
  }
}
export default Oracle
