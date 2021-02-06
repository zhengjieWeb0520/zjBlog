<!--
 * @Author: 郑杰14
 * @Date: 2020-07-30 10:06:34
 * @LastEditors: 郑杰14
 * @LastEditTime: 2020-08-05 10:56:50
 * @Description: 页面内容
-->
<template>
  <div class="page-content">
    <content-title></content-title>
    <coor-desc></coor-desc>
    <section class="page-top">
      <original-code v-if="btnType === 1"
                     :pageType="pageType"></original-code>
      <validation-results v-if="btnType === 2"></validation-results>
      <article class="trans-image">
        <img :src="transPng"
             alt="">
      </article>
      <transform-code :pageType="pageType"></transform-code>
    </section>
    <footer>
      <el-button type="default"
                 @click="handleClick(2)"
                 v-if="btnType === 1">验证格式</el-button>
      <el-button type="info"
                 @click="handleClick(1)"
                 v-if="btnType === 2">
        返回输入
      </el-button>
      <el-button @click="transformClick">转换</el-button>
    </footer>
  </div>
</template>

<script type="text/ecmascript-6">
import { mapState, mapActions } from 'vuex'
import ContentTitle from './ContentTitle' // 头部
import OriginalCode from './OriginalCode' // 源代码输入组件
import ValidationResults from './ValidationResults' // 验证结果组件
import TransformCode from './TransformCode' // 转换代码组件
import CoorDesc from './CoorDesc' // 坐标系描述
import transPng from '@/assets/images/transPng.png'
import {
  bd09togcj02,
  gcj02tobd09,
  wgs84togcj02,
  gcj02towgs84,
  bd09towgs84,
  wgs84tobd09
} from '@/utils/transformCoor'
export default {
  props: {
    pageType: {
      type: String,
      default: 'BdToGcj02'
    }
  },
  data () {
    return {
      transPng,
      btnType: 1,
      coorInfo: '百度坐标系，在GCJ02坐标系基础上再次加密。其中BD09LL表示百度经纬度坐标，BD09MC表示百度墨卡托米制坐标。百度地图使用的就是百度坐标系。' // 坐标描述
    }
  },
  computed: {
    ...mapState({
      originalCodes: state => state.codes.originalCodes, // 源代码字符串
      validationCodes: state => state.codes.validationCodes, // 源代码验证后对象
      selectedOrigin: state => state.codes.selectedOrigin, // 需转换坐标系
      selectedTransform: state => state.codes.selectedTransform // 转换坐标系
    })
  },

  components: {
    ContentTitle,
    OriginalCode,
    TransformCode,
    ValidationResults,
    CoorDesc
  },
  methods: {
    ...mapActions([
      'saveValidationCodes',
      'saveTransformCodes'
    ]),
    /**
     * 验证和返回输入点击事件
    */
    handleClick (etv) {
      if (etv === 2) {
        this.validate(etv)
      } else {
        // 返回输入，清空代码
        this.btnType = etv
        this.saveTransformCodes(null)
      }
    },

    /**
     * 验证输入json的格式是否正确
    */
    validate (etv) {
      if (typeof this.originalCodes === 'string') {
        try {
          // 输入字符串去除空格符和换行符
          const codesStr = this.originalCodes.replace(/[ ]|[\r\n]/g, '')
          // 字符串转json
          const obj = JSON.parse(codesStr)
          if (typeof obj === 'object' && obj) {
            // 如果是对象格式则验证通过，并将验证的结果存入vuex
            this.$message({
              message: '验证通过',
              type: 'success'
            })
            this.saveValidationCodes(obj)
            this.btnType = etv
          } else {
            this.$message({
              message: '格式不正确，请重新输入',
              type: 'error'
            })
          }
        } catch (e) {
          this.$message({
            message: '格式不正确，请重新输入',
            type: 'error'
          })
        }
      }
    },

    /**
     * 参数不正确提示
    */
    tipWarning () {
      this.$message({
        message: '输入参数不正确，情重新输入',
        type: 'error'
      })
      return null
    },
    /**
     * 点击转换
    */
    transformClick () {
      // 判断选择坐标系是否已选择正确
      if (this.selectedTransform === '') {
        this.$message({
          message: '请选择正确转换坐标系',
          type: 'warning',
          duration: 1000
        })
        this.saveTransformCodes(null)
        return null
      }
      // 判断验证代码块是否为空
      if (Object.keys(this.validationCodes).length === 0) {
        this.$message({
          message: '请先输入正确并验证对象',
          type: 'warning',
          duration: 1000
        })
        return null
      }
      let excuteTransform = null
      if (this.selectedOrigin === 'bd09' && this.selectedTransform === 'gcj02') {
        excuteTransform = bd09togcj02
      } else if (this.selectedOrigin === 'bd09' && this.selectedTransform === 'wgs84') {
        excuteTransform = bd09towgs84
      } else if (this.selectedOrigin === 'gcj02' && this.selectedTransform === 'bd09') {
        excuteTransform = gcj02tobd09
      } else if (this.selectedOrigin === 'gcj02' && this.selectedTransform === 'wgs84') {
        excuteTransform = gcj02towgs84
      } else if (this.selectedOrigin === 'wgs84' && this.selectedTransform === 'bd09') {
        excuteTransform = wgs84tobd09
      } else if (this.selectedOrigin === 'wgs84' && this.selectedTransform === 'gcj02') {
        excuteTransform = wgs84togcj02
      } else {
        // 非以上转换，提示框输入参数不正确
        excuteTransform = this.tipWarning
      }
      // const typeConfig = {
      //   'BdToGcj02': bd09togcj02, // 百度转火星
      //   'BdToWgs84': bd09towgs84, // 百度转wgs84
      //   'Gcj02ToBd': gcj02tobd09, // 火星转百度
      //   'Gcj02ToWgs84': gcj02towgs84, // 火星转wgs84
      //   'Wgs84ToBd': wgs84tobd09, // wgs84转百度
      //   'Wgs84ToGcj02': wgs84togcj02 // wgs84转火星
      // }
      let result = []
      for (const item of this.validationCodes) {
        // 判断lon、longitude、x；lat、latitude、y
        const lon = item.lon ? item.lon : item.longitude ? item.longitude : item.x
        const lat = item.lat ? item.lat : item.latitude ? item.latitude : item.y
        const transCoor = excuteTransform(lon, lat)
        const obj = {
          [item.lon ? 'lon' : item.longitude ? 'longitude' : 'x']: transCoor[0].toFixed(6),
          [item.lat ? 'lat' : item.latitude ? 'latitude' : 'y']: transCoor[1].toFixed(6)
        }
        result.push(obj)
      }
      // 将转换结果存入vuex
      this.saveTransformCodes(result)
    }
  }
}
</script>

<style lang="scss">
.page-content {
  height: calc(100% - 1.76rem);
}

.coor-info {
  text-align: center;
  font-size: 0.16rem;
}

.page-top {
  height: 62%;
  padding: 50px 100px;
  display: flex;
  justify-content: center;

  .page-left {
    width: 400px;
    height: 100%;
    border: 1px solid lightgray;
    overflow-y: auto;
    .el-input--width {
      width: 400px;
    }
    .el-textarea {
      height: 100%;
    }
    .el-textarea__inner {
      height: 100%;
    }
  }

  .trans-image {
    margin: 0 30px;
    display: flex;
    align-items: center;
    img {
      width: 40px;
    }
  }

  .page-right {
    width: 400px;
    height: 100%;
    overflow-y: auto;
    border: 1px solid lightgray;
  }
}

footer {
  text-align: center;
}
</style>
