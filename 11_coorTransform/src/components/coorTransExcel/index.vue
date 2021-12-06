/* eslint-disable */
<!--
 * @Author: 郑杰14
 * @Date: 2021-07-30 17:46:05
 * @LastEditors: 郑杰14
 * @LastEditTime: 2021-09-06 14:39:08
 * @Description: excel坐标转换内容
-->
<template>
  <div class="excel-content">
    <section class="excel-upload">
      <div>
        <el-upload 　　　　action="/"
                   　　　　:on-change="uploadChange"
                   　　　　:show-file-list="false"
                   :file-list="fileList"
                   　　　　accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
                   　　　　:auto-upload="false">
          　　　　<el-button class="trans-btn"
                     icon="el-icon-upload"
                     type="info">导入数据</el-button>
          　　 </el-upload>
        <ul>
          <li v-for="item of fileList"
              :key="item.list">{{item.name}}</li>
        </ul>
      </div>
      <el-button class="trans-btn"
                 icon="el-icon-upload"
                 type="success"
                 @click="transClick">转换</el-button>
      <div class="remark">
        <ul>
          <h2>备注：</h2>
          <li><i>*</i>EXCEL必须包含带有经度的字段，限制经度字段名称为"lon"、"longitude"、"x"</li>
          <li><i>*</i>EXCEL必须包含带有纬度的字段，限制纬度字段名称为"lat"、"latitude"、"y"</li>
          <li><i>*</i>除了经纬度字段，其他字段支持中文名称</li>
        </ul>
      </div>
    </section>
  </div>
</template>

<script type="text/ecmascript-6">
import Xlsx from 'xlsx'
import { mapState } from 'vuex'
import {
  bd09togcj02,
  gcj02tobd09,
  wgs84togcj02,
  gcj02towgs84,
  bd09towgs84,
  wgs84tobd09,
  lonlat2mercator,
  mercator2lonlat
} from '@/utils/transformCoor'
export default {
  data () {
    return {
      xlscList: [],
      fileList: []
    }
  },
  computed: {
    ...mapState({
      selectedOrigin: state => state.codes.selectedOrigin, // 需转换坐标系
      selectedTransform: state => state.codes.selectedTransform // 转换坐标系
    })
  },
  methods: {
    /**
     * @description: 
     * @param {*} 文件上传
     * @return {*}
     */
    uploadChange (file) {
      this.fileList = []
      this.fileList.push({
        name: file.name,
        url: file.url
      })
      let self = this;
      const types = file.name.split('.')[1];
      const fileType = ['xlsx', 'xlc', 'xlm', 'xls', 'xlt', 'xlw', 'csv'].some(item => {
        return item === types
      });
      if (!fileType) {
        this.$message.error('文件格式错误，请重新选择文件！')
      }
      this.file2Xce(file).then(tab => {
        // console.log(tab)
        // 过滤，转化正确的JSON对象格式
        if (tab && tab.length > 0) {
          tab[0].sheet.forEach(item => {
            if ((item.lon || item.longitude || item.x) && (item.lat || item.latitude || item.y)) {
              self.xlscList.push(item)
            } else {
              this.$message.error('文件没有经纬度字段，请重新选择文件！')
              return
            }
          });
          // console.log(self.xlscList)

          if (self.xlscList.length) {
            this.$message.success('上传成功')
            // 获取数据后，下一步操作
          } else {
            this.$message.error('空文件或数据缺失，请重新选择文件！')
          }
        }
      })
    },
    /**
     * @description: 
     * @param {*} 读取文件
     * @return {*}
     */
    file2Xce (file) {
      return new Promise(function (resolve, reject) {
        const reader = new FileReader();
        reader.onload = function (e) {
          const data = e.target.result;
          this.wb = Xlsx.read(data, {
            type: "binary"
          });
          const result = [];
          this.wb.SheetNames.forEach(sheetName => {
            result.push({
              sheetName: sheetName,
              sheet: Xlsx.utils.sheet_to_json(this.wb.Sheets[sheetName])
            })
          })
          resolve(result)
        }
        reader.readAsBinaryString(file.raw)
      })
    },
    /**
     * @description: 
     * @param {*} 转换
     * @return {*}
     */
    transClick () {
      if (!(this.selectedOrigin && this.selectedTransform)) {
        this.$message('请先选择转换的坐标！！！')
      }
      const that = this
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
      } else if (this.selectedOrigin === 'wgs84' && this.selectedTransform === 'mercator') {
        excuteTransform = lonlat2mercator
      } else if (this.selectedOrigin === 'mercator' && this.selectedTransform === 'wgs84') {
        excuteTransform = mercator2lonlat
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
      for (const item of this.xlscList) {
        // 判断lon、longitude、x；lat、latitude、y
        const lon = item.lon || item.longitude || item.x
        const lat = item.lat || item.latitude || item.y
        const transCoor = excuteTransform(Number(lon), Number(lat))
        const obj = {
          ...item,
          [item.lon ? 'lon' : item.longitude ? 'longitude' : 'x']: transCoor[0].toFixed(6),
          [item.lat ? 'lat' : item.latitude ? 'latitude' : 'y']: transCoor[1].toFixed(6)
        }
        result.push(obj)
      }
      this.downExcle(result)
    },
    /**
     * @description:下载exel
     * @param {*}
     * @return {*}
     */
    downExcle (result) {
      const outputXlsxFile = (data, header, xlsxName) => {
        const ws = Xlsx.utils.json_to_sheet(data, header)
        const wb = Xlsx.utils.book_new()
        Xlsx.utils.book_append_sheet(wb, ws, xlsxName)
        Xlsx.writeFile(wb, xlsxName + '.xlsx')
      };

      // 　　const mapList = {
      // 　　　　"type": "类型",
      // 　　　　"id": "ID",
      // 　　　　"name": "名称"
      // 　　} 
      let header = {
        header: Object.keys(result[0])  // 获取中文表头
      }
      // 调用filterJson函数进行JSON转化
      // outputXlsxFile(this.filterJson(mapList), header, '标签批量模版')
      outputXlsxFile(result, header, this.fileList[0].name.split('.')[0])
    },
    // 将中文映射成英文键
    // 　filterJson(mapList) {  
    // 　　　let res = []
    // 　　　this.xlxsData.map(item => { // 对源数据处理，将英文键转化成中文
    //   　　　let obj = {}
    //   　　　for (let key in mapList){
    //   　　　　　obj[mapList[key]] = item[key] // 保持xlxsMap的键和源数据一致，否则会有数据会缺少
    //   　　　}
    // 　　　　res.push(obj)
    // 　　　})
    // 　　　return res
    // 　}   
  },
  /**
   * @description:参数不正确提示 
   * @param {*}
   * @return {*}
   */
  tipWarning () {
    this.$message({
      message: '输入参数不正确，请重新输入',
      type: 'error'
    })
    return null
  },
}
</script>

<style lang="scss">
.excel-upload {
  margin-top: 60px;
  text-align: center;
  > div {
    margin-bottom: 60px;
  }
  .trans-btn {
    width: 100px;
  }
}
.remark {
  margin-top: 120px;
  display: flex;
  justify-content: center;
  ul {
    width: 700px;
    h2 {
      text-align: left;
    }
    li {
      text-align: left;
      margin-top: 8px;
      font-size: 15px;
      i {
        color: red;
        margin-right: 5px;
      }
    }
  }
}
</style>
