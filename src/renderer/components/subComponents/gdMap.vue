<template>
    <div id="gdMap">
    </div>
</template>
<script>
// /* global AMap */
import '@/assets/css/gdMap.css'
import bus from '@/components/functions/bus'
// import VueAMap from 'vue-amap'
export default {
  data () {
    return {
      map: null
    }
  },
  created () {
    bus.$on('cityChange', city => {
      this.map.setCity(city)
    })
  },
  mounted () {
    setTimeout(() => {
      this.map = new AMap.Map('gdMap', {
        resizeEnable: true,
        center: [116.405285, 39.904989]
      })
    }, 1500)
  }
}
</script>