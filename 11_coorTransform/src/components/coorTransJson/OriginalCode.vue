<!--
 * @Author: 郑杰14
 * @Date: 2020-07-30 09:54:41
 * @LastEditors: 郑杰14
 * @LastEditTime: 2020-07-30 17:22:59
 * @Description: 原始代码
-->
<template>
  <article class="page-left">
    <el-input class="el-textarea--height el-input--width"
              type="textarea"
              :rows="4"
              :count="100000"
              placeholder="请输入"
              v-model="textarea"></el-input>
  </article>
</template>

<script type="text/ecmascript-6">
import { mapActions } from 'vuex'
export default {
  props: {
    pageType: {
      type: String,
      default: 'BdToGcj02'
    }
  },
  data () {
    return {
      textarea:
        `[
    {
      "lon": 121,
      "lat": 34
    }
]`
    }
  },
  methods: {
    ...mapActions([
      'saveOriginalCodes'
    ])
  },
  watch: {
    // 监听输入框的改变存入vuex
    textarea (val) {
      this.saveOriginalCodes(val)
    }
  },
  mounted () {
    this.saveOriginalCodes(this.textarea)
  }
}
</script>

<style scoped lang="scss">
</style>
