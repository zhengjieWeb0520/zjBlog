/*
 * @Author: 郑杰14
 * @Date: 2021-04-13 22:26:21
 * @LastEditors: 郑杰14
 * @LastEditTime: 2021-04-20 10:35:19
 * @Description: 路由配置
 */
import React, { lazy } from 'react'
// import Map from '../pages/map'

const Login = lazy(() => import(/* webpackChunkName: 'login' */ '../pages/login'))
const Main = lazy(() => import(/* webpackChunkName: 'mainPage' */ '../pages/main'))
const Map = lazy(() => import(/* webpackChunkName: 'map' */ '../pages/map'))
const Study = lazy(() => import(/* webpackChunkName: 'study' */ '../pages/study'))
// import Login from '../pages/login'
// import Main from '../pages/main'

const routes = [
  {
    path: '/',
    lazyComponent: <Login />,
    exact: true
  },
  {
    path: '/main',
    lazyComponent: <Main />,
    exact: false,
    children: [
      {
        path: '/main/map',
        lazyComponent: <Map />,
        exact: false
      }
    ]
  },
  {
    path: '/study',
    lazyComponent: <Study />,
    exact: false
  }
]

export { routes }
