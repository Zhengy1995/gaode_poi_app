import pg from 'pg'
let config = {
  user: 'postgres',
  host: '10.45.59.178',
  password: 'postgis',
  database: 'postgresforgis',
  port: 5432,
  max: 20,
  idleTimeoutMillis: 3000
}

class Postgres {
  constructor () {
    this.pool = new pg.Pool(config)
    this.client = null
    this.getConnection()
  }
  async getConnection () {
    this.client = await this.pool.connect().catch(err => {
      console.log(err)
    })
  }
  async testConnection () {
    let sql = 'SELECT $1::varchar AS OUT'
    let result = this.client ? await this.client.query(sql, ['Hello World']).catch(err => console.error(err)) : []
    return result.rows || result
  }
  async query (sql, param) {
    if (!sql) return
    let result = this.client ? await this.client.query(sql, param || []).catch(err => console.error(err)) : []
    return result.rows || result
  }
  queryStartAtGridNum (gridNum, dcode) {
    let sql = 'select minx,miny,maxx,maxy from region_grid where dcode = $1::int offset $2::int limit 99999'
    return this.query(sql, [dcode, gridNum])
  }
}

export default Postgres
