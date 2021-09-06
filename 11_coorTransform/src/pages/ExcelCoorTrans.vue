<!--
 * @Author: 郑杰14
 * @Date: 2021-08-02 11:01:14
 * @LastEditors: 郑杰14
 * @LastEditTime: 2021-08-04 10:24:19
 * @Description: excel数据格式坐标转换
-->
<template>
  <div class="main-index">
    <Header />
    <!-- <page-content></page-content> -->
    <div class="page-content">
      <content-title></content-title>
      <coor-desc></coor-desc>
      <coor-trans-excel></coor-trans-excel>
    </div>
    <footer-content></footer-content>
  </div>
</template>

<script type="text/ecmascript-6">
import Header from '../components/0_header/Header'
import FooterContent from '../components/0_header/Footer'
// 头部组件
import ContentTitle from '@/components/common/ContentTitle.vue'
// 描述
import CoorDesc from '@/components/common/CoorDesc.vue'
// excel坐标转换
import CoorTransExcel from '@/components/coorTransExcel'
export default {
  data () {
    return {

    }
  },
  components: {
    Header,
    FooterContent,
    ContentTitle,
    CoorDesc,
    CoorTransExcel
  }
}
</script>

<style scoped lang="scss">
</style>
