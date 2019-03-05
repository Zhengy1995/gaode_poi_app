<template>
    <div id="mainHeader">
      <div style="display:inline-block;margin-right:5px">
        <el-select v-model="proVal" disabled placeholder="四川省" size="small">
            <el-option
              v-for="item in province"
              :key="item.value"
              :value="item.value"
              :label="item.label">
            </el-option>
        </el-select>
        <el-select v-model="city" placeholder="请选择市" size="small"
        @change="getRegion()">
            <el-option
              v-for="item in cities"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
        </el-select>
      </div>
        <div style="display:inline-block;width:300px">
            <el-input placeholder="表名" v-model="tbName" size="small">
                <template slot="prepend">请输入表名:</template>
            </el-input>
        </div>
        <span style="display:block;height:10px"></span>
        <div style="display:inline-block;width:350px">
            <el-input placeholder="web服务key" v-model="key" size="small">
                <template slot="prepend">高德key:</template>
            </el-input>
        </div>
        <div style='display:inline-block;margin:0 10px;color:#606266;font-size:13px;background-color:#F2F6FC;border-radius:5px;padding:0 5px;border:1px solid #dcdfe6'>
          <span>第</span>
          <div style="display:inline-block;width:80px">
          <el-input v-model="gridNum" placeholder="默认1" size="small"></el-input>
          </div>
          <span>个网格开始</span>
        </div>
        <el-button type="success" round size="mini" @click="startDownload">下载poi并存为oracle类型sql</el-button>
        <span style="display:block;height:5px"></span>
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选(建议)</el-checkbox>
        <div style="margin: 5px 0;"></div>
        <el-checkbox-group v-model="checkedTypes" @change="handleCheckedCitiesChange">
          <el-checkbox v-for="type in types" :label="type" :key="type">{{type}}</el-checkbox>
        </el-checkbox-group>
    </div>
</template>
<script>
import '@/assets/css/mainHeader.css'
import {message} from '@/components/functions/variables'
import {messageBox} from '@/components/functions/tips'
import {Postgres} from '@/service/Database'
import CoordinateTransform from '@/service/gcj02to84'
import {mapActions, mapState} from 'vuex'
import {remote} from 'electron'
import bus from '@/components/functions/bus'
import fs from 'fs'
export default {
  data () {
    return {
      loading: true,
      tbName: '',
      city: '',
      proVal: '',
      db: new Postgres(),
      checkedTypes: [],
      isIndeterminate: false,
      checkAll: false,
      filename: 'shape.sql',
      gridNum: null,
      key: ''
    }
  },
  computed: mapState('Region', ['region', 'cities', 'types', 'province']),
  mounted () {
    setTimeout(async () => {
      let test = await this.db.testConnection()
      console.log(test[0].out)
    }, 2000)
  },
  methods: {
    ...mapActions('Region', ['someAsyncTask', 'saveStatus']),
    handleCheckAllChange (val) {
      this.checkedTypes = val ? this.types : []
      this.isIndeterminate = false
    },
    handleCheckedCitiesChange (value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === this.types.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.types.length
    },
    async getRegion () {
      bus.$emit('cityChange', this.city)
      let sql = `select minx,miny,maxx,maxy from region_grid where dcode = $1::int`
      let res = await this.db.query(sql, [this.city])
      this.someAsyncTask(res)
    },
    checkConditions () {
      return new Promise((resolve, reject) => {
        if (this.city && this.tbName && this.checkedTypes.length) {
          remote.dialog.showOpenDialog(filename => {
            if (!filename) resolve()
            this.filename = filename[0]
            resolve()
          })
        } else {
          let msg = ''
          msg = this.checkedTypes.length === 0 ? '请至少选择一类poi类型' : ''
          msg = !this.tbName ? '表名不能为空' : msg
          msg = !this.city ? '请先选择城市' : msg
          messageBox(this, message.ERROR, msg)
          reject(msg)
        }
      })
    },
    createSql (data) {
      let sql = ''
      if (data.pois && data.pois.length) {
        data.pois.map(item => {
          sql += `insert into ${this.tbName} (id,address,resname,type,location,dcode,shape) values ('${item.id}','${item.address}','${item.name}','${item.type}','${item.location}',${item.typecode}),sde.st_geomfromtext('POINT(${CoordinateTransform.gcj02to84(...item.location.split(','))})',4326);\n`
        })
      }
      return sql
    },
    saveDataToSql (datas) {
      if (datas === 'clear') {
        fs.writeFile(this.filename, '', (err, data) => {
          if (err) {
            return console.error(err)
          }
          console.log('已清空文件，下载poi中')
        })
        return
      }
      fs.appendFile(this.filename, this.createSql(datas), (err, data) => {
        if (err) {
          return console.error(err)
        }
        console.log('异步读取文件数据: ' + (data ? data.toString() : ''))
      })
    },
    startDownload () {
      this.checkConditions().then(async () => {
        this.saveDataToSql('clear')
        let count = this.region.length
        this.$emit('totalCount', count)
        for (let index = (this.gridNum && this.gridNum - 1) || 0; index < count; index++) {
          let item = this.region[index]
          this.$emit('nowRegion', index + 1)
          let url = `https://restapi.amap.com/v3/place/polygon?polygon=${item.minx},${item.maxy}|${item.maxx},${item.miny}&key=${this.key}&keywords=${this.checkedTypes.join('|')}&offset=25`
          let res = await this.$http.get(url).catch(err => {
            setTimeout(() => {
              this.$emit('setLoading', false)
              messageBox(this, message.ERROR, `格网${index + 1}报错:${err}`)
              console.error(`格网${index + 1}报错:${err}`)
              this.writeLog(`格网${index + 1}报错:${err}`)
            }, 1000)
          })
          if (!res) break
          if (res.data.status === '0') {
            this.$emit('setLoading', false)
            console.error(res.data.info)
            this.writeLog(`格网${index + 1}报错:${res.data.info}`)
            messageBox(this, message.ERROR, res.data.info)
            break
          } else {
            if (res.data.count > 2500) console.log(url)
            if (res.data.count > 25) {
              this.continueRequest(url, res)
            } else if (res.data.count > 0) {
              this.saveDataToSql(res.data)
            }
          }
          index >= count && messageBox(this, message.SUCCESS, '下载完成')
        }
        this.$emit('setLoading', false)
      })
    },
    async continueRequest (url, res) {
      let size = res.data.count * 1
      this.saveDataToSql(res.data)
      for (let page = 2; (page - 1) * 25 < size; page++) {
        let response = await this.$http.get(`${url}&page=${page}`)
        if (response.data.status === '0') {
          messageBox(this, message.ERROR, response.data.info)
          break
        }
        this.saveDataToSql(response.data)
      }
    },
    writeLog (msg) {
      fs.appendFile('log.log', `${new Date()}:${msg}\n`, (err, data) => {
        if (err) {
          return console.error(err)
        }
        console.log('日志已记录')
      })
    }
  }
}
</script>
