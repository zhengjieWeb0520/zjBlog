/*
 * @Author: 郑杰14
 * @Date: 2020-07-30 16:09:55
 * @LastEditors: 郑杰14
 * @LastEditTime: 2021-08-02 11:15:18
 * @Description:
 */
import Vue from 'vue'
import Router from 'vue-router'
import JsonCoorTrans from './../pages/JsonCoorTrans'
import ExcelCoorTrans from './../pages/ExcelCoorTrans'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: JsonCoorTrans,
      children: []
    },
    {
      path: '/excelCoorTrans',
      name: 'ExcelCoorTrans',
      component: ExcelCoorTrans,
      children: []
    }
  ]
})
