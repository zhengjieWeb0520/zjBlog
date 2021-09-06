<!--
 * @Author: 郑杰14
 * @Date: 2020-08-05 10:05:41
 * @LastEditors: 郑杰14
 * @LastEditTime: 2021-08-04 10:23:57
 * @Description: 坐标系描述
-->
<template>
  <article class="coor-info">{{coorInfo}}</article>
</template>

<script type="text/ecmascript-6">
import { mapState } from 'vuex'
export default {
  data () {
    return {
      coorInfo: '百度坐标系，在GCJ02坐标系基础上再次加密。其中BD09LL表示百度经纬度坐标，BD09MC表示百度墨卡托米制坐标。百度地图使用的就是百度坐标系。' // 坐标描述
    }
  },
  computed: {
    ...mapState({
      selectedOrigin: state => state.codes.selectedOrigin // 需转换坐标系
    })
  },

  watch: {
    // 监听源坐标系变化
    selectedOrigin (val) {
      const desc = {
        bd09: '百度坐标系，在GCJ02坐标系基础上再次加密。其中BD09LL表示百度经纬度坐标，BD09MC表示百度墨卡托米制坐标。百度地图使用的就是百度坐标系。',
        wgs84: 'wgs84坐标系为一种大地坐标系，也是目前广泛使用的GPS全球卫星定位系统使用的坐标系。目前常用的天地图等使用的就是WGS84坐标系。',
        gcj02: '火星坐标系，是由中国国家测绘局制定的地理坐标系统，是由WGS84加密后得到的坐标系。高德地图、谷歌地图等使用的就是火星坐标系。'
      }
      this.coorInfo = desc[val]
    }
  }
}
</script>

<style scoped lang="scss">
.coor-info {
  text-align: center;
  font-size: 0.16rem;
}
</style>
