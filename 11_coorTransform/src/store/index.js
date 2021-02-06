/*
 * @Author: 郑杰14
 * @Date: 2020-07-30 16:09:55
 * @LastEditors: 郑杰14
 * @LastEditTime: 2020-07-30 17:23:48
 * @Description:
 */
import Vue from 'vue'
import Vuex from 'vuex'
import codes from './modules/codes'
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    codes
  }
})