import React from 'react'
import { Link } from 'react-router-dom'
import './index.scss'
import logo from '../../../images/demo/logo.png'

/* 头部 */
export default function App () {
  return (
    <header>
      <a>
        <Link to='/'>
          <img src={logo} />
          <span>郑杰的个人主页---arcgis api for js 3.x</span>
        </Link>
      </a>
    </header>
  )
}
