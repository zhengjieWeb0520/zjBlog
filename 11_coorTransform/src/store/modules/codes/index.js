/*
 * @Author: 郑杰14
 * @Date: 2020-07-30 13:45:09
 * @LastEditors: 郑杰14
 * @LastEditTime: 2020-07-30 17:29:00
 * @Description:
 */
import mutations from './mutations'
import * as actions from './actions'

export default {
  state: {
    originalCodes: '', // 源输入代码字符串,
    validationCodes: {}, // 验证后的json对象串
    transformCodes: null, // 转换后的json对象串
    selectedOrigin: 'bd09', // 需转换的坐标系
    selectedTransform: '' // 转为的坐标系
  },
  mutations,
  actions
}