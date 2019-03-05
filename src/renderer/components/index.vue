<template>
  <div id="index"
        v-loading="loading"
        :element-loading-text="text"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        style="width: 100%">
    <mainHeader @totalCount="getTotalCount" @nowRegion="getRegion" @setLoading="setLoading"></mainHeader>
    <gdMap></gdMap>
  </div>
</template>

<script>
  import mainHeader from './subComponents/mainHeader'
  import gdMap from './subComponents/gdMap'
  import '@/assets/css/index.css'
  // import { setInterval, setTimeout, clearInterval } from 'timers'
  export default {
    name: 'index',
    components: { mainHeader, gdMap },
    data () {
      return {
        text: `正在下载第0/0个区域的数据`,
        loading: false,
        count: 0
      }
    },
    methods: {
      getTotalCount (count) {
        this.count = count
        this.setLoading(true)
      },
      getRegion (region) {
        this.text = `正在下载第${region}/${this.count}个区域的数据`
        this.setLoading(region !== this.count)
      },
      setLoading (bool) {
        this.loading = bool
      }
    }
  }
</script>
