/*
 * @Author: 郑杰14
 * @Date: 2020-07-30 16:09:55
 * @LastEditors: 郑杰14
 * @LastEditTime: 2020-07-30 17:23:27
 * @Description:
 */
import Vue from 'vue'
import Router from 'vue-router'
import MainIndex from './../pages/index'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: MainIndex,
      children: []
    }
  ]
})
