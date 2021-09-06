/*
 * @Author: 郑杰14
 * @Date: 2021-04-13 22:26:21
 * @LastEditors: 郑杰14
 * @LastEditTime: 2021-04-22 16:03:24
 * @Description: 路由配置
 */
import React, { lazy } from 'react'
// import Map from '../pages/map'

const Home = lazy(() => import(/* webpackChunkName: 'home' */ '../pages/0_home'))
const Main = lazy(() => import(/* webpackChunkName: 'mainPage' */ '../pages/main'))
const Demo = lazy(() => import(/* webpackChunkName: 'demo' */ '../pages/demo'))
const Study = lazy(() => import(/* webpackChunkName: 'study' */ '../pages/study'))
// import Login from '../pages/login'
// import Main from '../pages/main'

const routes = [
  {
    path: '/',
    lazyComponent: <Home />,
    exact: true
  },
  {
    path: '/main',
    lazyComponent: <Main />,
    exact: false,
    children: [
      {
        path: '/main/demo',
        lazyComponent: <Demo />,
        exact: false,
        children: [
          // {
          //   path: '/main/demo/chart/:id'
          // }
        ]
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
