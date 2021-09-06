/*
 * @Author: 郑杰14
 * @Date: 2021-04-14 14:06:13
 * @LastEditors: 郑杰14
 * @LastEditTime: 2021-04-23 12:01:41
 * @Description: 地图主页
 */
import React, { useContext } from 'react'
import Header from '../../component/template/header'
import Menu from '../../component/template/menu'
// import Menu from '../../component/template/menu'
import { appContext } from '../../context/AppContext'
import './index.scss'

export default function index() {
  const context = useContext(appContext)
  return (
    <div className="demo-page">
      <Header />
      <div className="demo-page-content">
        <Menu />
      </div>
    </div>
  )
}
