<!--
 * @Author: 郑杰14
 * @Date: 2020-07-30 16:42:30
 * @LastEditors: 郑杰14
 * @LastEditTime: 2020-08-05 10:41:47
 * @Description: 内容头部
-->
<template>
  <div class="page-title">
    <section class="title-select">
      <el-select v-model="originCoor"
                 placeholder="请选择">
        <el-option v-for="item in coorList"
                   :key="item.value"
                   :label="item.label"
                   :value="item.value">
        </el-option>
      </el-select>
      <img :src="transPng"
           alt="">
      <el-select v-model="transforCoor"
                 placeholder="请选择">
        <el-option v-for="item in coorList"
                   :key="item.value"
                   :label="item.label"
                   :value="item.value">
        </el-option>
      </el-select>
    </section>
  </div>
</template>

<script type="text/ecmascript-6">
import { mapActions } from 'vuex'
import transPng from '@/assets/images/transPng.png'
export default {
  data () {
    return {
      transPng,
      coorList: [
        {
          label: '百度坐标系',
          value: 'bd09'
        },
        {
          label: 'wgs84坐标系',
          value: 'wgs84'
        },
        {
          label: '火星坐标系',
          value: 'gcj02'
        }
      ], // 坐标系列表
      originCoor: 'bd09', // 需要转换的坐标系
      transforCoor: '' // 转换后坐标系
    }
  },
  methods: {
    ...mapActions([
      'saveOriginCoor',
      'saveTransformCoor'
    ])
  },
  watch: {
    originCoor (val) {
      this.saveOriginCoor(val)
    },
    transforCoor (val) {
      if (val === this.originCoor) {
        // 如果转换坐标系与源坐标系相同，则告警，置空
        this.$message({
          message: '转换坐标系不能与源坐标系相同，请重新选择',
          type: 'warning',
          duration: 1000
        })
        this.transforCoor = ''
      } else {
        this.saveTransformCoor(val)
      }
    }
  }
}
</script>

<style scoped lang="scss">
.page-title {
  height: 0.5rem;
  text-align: center;

  img {
    width: 0.2rem;
    margin: 0 0.1rem;
    vertical-align: middle;
  }
}
</style>
