import fs from 'fs'
import { verbose as sqlite3 } from 'sqlite3'
let DB = {}
DB.SqliteDB = file => {
  DB.db = new sqlite3.Database(file)
  DB.exist = fs.existsSync(file)
  if (!DB.exist) {
    console.log('Creating db file!')
    fs.openSync(file, 'w')
  }
}

export default DB
