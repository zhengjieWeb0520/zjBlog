/*
 * @Author: 郑杰14
 * @Date: 2021-04-21 16:55:23
 * @LastEditors: 郑杰14
 * @LastEditTime: 2021-04-21 19:07:33
 * @Description: 页面头部
 */
import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import './index.scss'
import logo from '../../../assets/images/logo.png'

const Header:React.FC = () => {
  return (
    <header>
      <Link to="/">
        <img src={logo} alt="" />
        <span>郑杰的个人主页---echarts</span>
      </Link>
    </header>
  )
}

export default Header
