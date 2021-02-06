/*
 * @Author: 郑杰14
 * @Date: 2020-06-09 16:44:02
 * @LastEditors: 郑杰14
 * @LastEditTime: 2020-07-04 12:52:01
 * @Description:
 */
import React, { lazy } from 'react'

const Home = lazy(() => import(/* webpackChunkName: 'home' */ '../../pages/0_home'))
const Summary = lazy(() => import(/* webpackChunkName: 'summary' */ '../../pages/1_summary'))
const MainRoute = lazy(() => import(/* webpackChunkName: 'MainRoute' */ '../../pages/main'))

export default [
  {
    name: '首页',
    path: '/',
    isMenu: false,
    component: <Home />
  },
  {
    name: '主页面',
    path: '/main',
    isMenu: true,
    component: <MainRoute />
  }
]
