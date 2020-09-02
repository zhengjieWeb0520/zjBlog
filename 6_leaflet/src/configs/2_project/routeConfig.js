import { lazy } from 'react'

const Login = lazy(() => import(/* webpackChunkName: 'home' */ '../../pages/0_login'))
const Home = lazy(() => import(/* webpackChunkName: 'home' */ '../../pages/1_home'))
const ReactHooks = lazy(() => import(/* webpackChunkName: 'home' */ '../../pages/2_react_hooks'))

export default [
  {
    
  },
  {
    name: '首页',
    path: '/',
    component: <Home />
  },
  {
    name: 'react hooks',
    path: '/hooks',
    component: <ReactHooks />
  }
]
