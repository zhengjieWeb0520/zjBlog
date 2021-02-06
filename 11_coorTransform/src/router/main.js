/*
 * @Author: 郑杰14
 * @Date: 2020-07-30 16:09:55
 * @LastEditors: 郑杰14
 * @LastEditTime: 2020-07-30 16:27:46
 * @Description: 
 */
import Vue from 'vue'
import Router from 'vue-router'
import TodoList from './../pages/1_todoList/TodoList'
import Slot from './../pages/2_slot/Slot'
import Animate from './../pages/3_animate/Animate'
import Vuex from './../pages/4_vuex/vuex'
import UserInfo from './../pages/5_userInfo/userInfo'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/index',
      name: 'TodoList',
      component: TodoList,
      meta: {
        keepAlive: true // 缓存   
      }
    }
  ]
})
