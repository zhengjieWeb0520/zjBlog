<!--
 * @Author: 郑杰14
 * @Date: 2020-07-30 09:56:10
 * @LastEditors: 郑杰14
 * @LastEditTime: 2020-08-05 11:10:36
 * @Description: 转换后的代码
-->
<template>
  <article class="page-right">
    <el-button v-clipboard:copy="jsonCodes"
               v-clipboard:success="onCopy"
               type="primary"
               v-clipboard:error="onError">复制</el-button>
    <vue-json-pretty :path="'res'"
                     :data="transformCodes">
    </vue-json-pretty>
  </article>
</template>

<script type="text/ecmascript-6">
import { mapState } from 'vuex'
import VueJsonPretty from 'vue-json-pretty' // json格式化组件
export default {
  data () {
    return {
      jsonCodes: ''
    }
  },
  props: {
    pageType: {
      type: String,
      default: 'BdToGcj02'
    }
  },
  computed: {
    ...mapState({
      transformCodes: state => state.codes.transformCodes // 转换的数据
    })
  },
  components: {
    VueJsonPretty
  },
  watch: {
    // 监听转换坐标系转为字符串
    transformCodes (val) {
      this.jsonCodes = JSON.stringify(val)
    }
  },
  methods: {
    // 复制
    onCopy () {
      this.$message({
        message: '复制成功',
        type: 'success'
      })
    },
    // 复制错误
    onError () {
      this.$message({
        message: '复制失败',
        type: 'error'
      })
    }
  }
}
</script>

<style scoped lang="scss">
.page-right {
  position: relative;

  button {
    position: absolute;
    right: 0;
    cursor: pointer;
    z-index: 9999;
  }
}
</style>
