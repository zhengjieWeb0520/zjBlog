<!--
 * @Author: 郑杰14
 * @Date: 2020-07-30 16:09:55
 * @LastEditors: 郑杰14
 * @LastEditTime: 2021-09-06 14:35:43
 * @Description:
-->
<template>
  <div class="main-index">
    <Header />
    <page-content></page-content>
    <footer-content></footer-content>
  </div>
</template>

<script type="text/ecmascript-6">
import Header from '../components/0_header/Header'
import PageContent from '../components/coorTransJson/PageContent'
import FooterContent from '../components/0_header/Footer'
export default {
  data () {
    return {
    }
  },
  components: {
    Header,
    PageContent,
    FooterContent
  }
}
</script>

<style scoped lang="scss">
</style>
