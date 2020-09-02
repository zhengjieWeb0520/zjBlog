import React, { useEffect, useRef } from 'react'
import './app.scss'
import { toolList } from './assets/toolList'
import loginUser from '../../images/demo/loginUser.jpg'

/* 列表组件 */
function ToolListItem (props) {
  const { icon, name, desc, url } = props.listData
  return (
    <li className="toollist-item">
      <a href={url} target="_blank">
        <div className="toollist-item-title">
          <span className={`icon iconfont ${icon}`}></span>
          <span className="toollist-item-name">{name}</span>
        </div>
        <div className="toollist-item-desc">{desc}</div>
      </a>
    </li>
  )
}

/* 首页 */
function App () {
  return (
    <div className="page page-home">
      <section className="index-title">
        <article className="index-title-content">
          <img src={loginUser} alt="" />
          <h2>郑杰的个人主页</h2>
          <div>基于React框架的前端组件、图表（Echarts）、地图（cesium、leaflet、arcgis api 3.x、arcgis api 4.x、腾讯地图、高德地图、百度地图）...</div>
        </article>
      </section>
      <section className="index-list">
        <ul className="index-list-content clearfix">
          {
            toolList.map(item => {
              return <ToolListItem key={item.name} listData={item} />
            })
          }
        </ul>
      </section>
    </div>
  )
}

export default App
