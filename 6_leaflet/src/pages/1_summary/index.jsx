import React from 'react'
import './index.scss'
import demo1 from '../../images/demo/demo1.png'
import demo2 from '../../images/demo/demo2.png'
import demo3 from '../../images/demo/demo3.png'
import demo4 from '../../images/demo/demo4.png'
import demo5 from '../../images/demo/demo5.png'
/* 地理信息系统介绍 */
export default function App () {
  return (
    <div className="page page-summary">
      <section className="page page-summary-content">
        <h1>地理信息系统概述</h1>
        <article>
          <p className="page-summary-title">1.1 什么是GIS</p>
          <div className="page-summary-info">
            GIS即地理信息系统（GeographicInformationSystem），是一门集计算机科学、地理学、测绘学、信息学等多学科
            为一体的新兴学科。它是在计算机软件、硬件的支持下，对地球表层和大气层的空间地理信息数据进行采集、存储、管理
            运算、分析、可视化展示的信息系统。GIS的应用领域比较广泛如交通、公安、农业、园林、气象、电力、海洋、城市管理
            、生态环境等。
          </div>
        </article>
        <article>
          <p className="page-summary-title gis-tool">1.2 常见GIS工具</p>
          <div className="page-summary-info gis-tool-content">
            <div>
              <p>1.2.1 平台</p>
              <ul>
                <li>ESRI ArcGIS平台</li>
                <li>超图 SurperMap平台</li>
                <li>Skyline平台</li>
                <li>开源GIS平台（udig、QGIS）</li>
              </ul>
            </div>
            <div>
              <p>1.2.2 服务</p>
              <ul>
                <li>ArcGIS Server</li>
                <li>MapServer</li>
                <li>GeoServer</li>
              </ul>
            </div>
            <div>
              <p>1.2.3 前端引擎</p>
              <ul>
                <li>ArcGIS Api for js</li>
                <li>Cesium、MapBox</li>
                <li>Leaflet、OpenLayers</li>
                <li>互联网高德地图、腾讯地图、百度地图、天地图...</li>
              </ul>
            </div>
          </div>
        </article>
        <article>
          <p className="page-summary-title">1.3 leaflet简介</p>
          <div className="page-summary-info">
            Leaflet 是一个为建设移动设备友好的互动地图，而开发的现代的、开源的 JavaScript 库。它是由 Vladimir Agafonkin 带领一个专业贡献者团队开发，虽然代码仅有 38 KB，但它具有开发人员开发在线地图的大部分功能。
            Leaflet设计坚持简便、高性能和可用性好的思想，在所有主要桌面和移动平台能高效运作，在现代浏览器上会利用HTML5和CSS3的优势，同时也支持旧的浏览器访问。支持插件扩展，有一个友好、易于使用的API文档和一个简单的、可读的源代码。
          </div>
          <ul className="demo-images">
            <li><img src={demo1} /></li>
            <li><img src={demo2} /></li>
            <li><img src={demo3} /></li>
            <li><img src={demo4} /></li>
            <li><img src={demo5} /></li>
          </ul>
        </article>
        <article>
          <p className="page-summary-title">1.4 leaflet学习资料</p>
          <div className="page-summary-info">
            <ul className="demo-images">
              <li><span>leaflet：</span><a href="https://leafletjs.com/">https://leafletjs.com/</a></li>
              <li><span>esri-leaflet：</span><a href="http://esri.github.io/esri-leaflet/">http://esri.github.io/esri-leaflet/</a></li>
            </ul>
          </div>
        </article>
      </section>
    </div>
  )
}
