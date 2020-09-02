/*
 * @Author: 郑杰14
 * @Date: 2020-06-09 16:44:02
 * @LastEditors: 郑杰14
 * @LastEditTime: 2020-07-04 12:48:21
 * @Description:
 */
import React, { lazy } from 'react'

const Summary = lazy(() => import(/* webpackChunkName: 'summary' */ '../../pages/1_summary'))
const DemoApi = lazy(() => import(/* webpackChunkName: 'demoApi' */ '../../pages/2_demoApi'))
export default [
  {
    name: '概述',
    path: '/main/summary',
    isMenu: false,
    icon: 'iconshouye',
    component: <Summary />
  },
  {
    name: 'DemoApi',
    path: '/main/demo',
    isMenu: false,
    icon: 'iconshouye',
    component: <DemoApi />
  }
]
