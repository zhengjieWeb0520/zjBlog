<!--
 * @Author: 郑杰14
 * @Date: 2020-07-30 10:52:30
 * @LastEditors: 郑杰14
 * @LastEditTime: 2020-07-30 17:23:11
 * @Description: 输入框格式验证结果
-->
<template>
  <article class="page-left">
    <vue-json-pretty :path="'res'"
                     :data="validationCodes">
    </vue-json-pretty>
  </article>
</template>

<script type="text/ecmascript-6">
import { mapState } from 'vuex'
import VueJsonPretty from 'vue-json-pretty' // json格式化组件
export default {
  computed: {
    ...mapState({
      validationCodes: state => state.codes.validationCodes
    })
  },
  components: {
    VueJsonPretty
  }
}
</script>

<style scoped lang="scss">
</style>
