/*
 * @Author: 郑杰14
 * @Date: 2020-06-09 16:44:02
 * @LastEditors: 郑杰14
 * @LastEditTime: 2020-07-04 12:52:14
 * @Description:
 */
import React from 'react'
import MainRoute from '../../router/index_router/routers'
import Header from '../../component/template/header'

/* 主路由入口 */
export default () => (
  <div className="main" id="main">
    <Header />
    <MainRoute />
  </div>
)
