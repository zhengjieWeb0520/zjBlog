import React from 'react'
import './index.scss'
import demo1 from '../../images/demo/demo1.png'
import demo2 from '../../images/demo/demo2.png'
import demo3 from '../../images/demo/demo3.png'
import demo4 from '../../images/demo/demo4.png'
import demo5 from '../../images/demo/demo5.png'
import demo6 from '../../images/demo/demo6.png'
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
                <li>ArcGIS Api</li>
                <li>Cesium、MapBox</li>
                <li>Leaflet、OpenLayers</li>
                <li>互联网高德地图、腾讯地图、百度地图、天地图...</li>
              </ul>
            </div>
          </div>
        </article>
        <article>
          <p className="page-summary-title">1.3 arcgis api简介</p>
          <div className="page-summary-info">
            ArcGIS API for JavaScript是ESRI公司用JavaScipt语言编写的一套程序接口。用户可以通过调用API获取ArcGIS server提供的服务，例如浏览、编辑、渲染地图，以及一些常用的空间分析功能。ArcGIS API for JavaScript是跟随ArcGIS 9.3同时发布的，已经升级了多个版本，目前最新版本是4.16。
            ArcGIS API for JavaScript到底可以实现什么功能呢?
            <p>1.快速创建交互式的地图应用，包括缩放、平移、查询、定位等功能。</p>
            <p>2.调用ArcGIS server 的GP（地理处理）功能，提供专业的分析结果。</p>
            <p>3.使用ArcGIS Server 的REST API，提供显示、查询、分析等功能。</p>
            <p>4.可以同时调用多个ArcGIS Server的多个服务，轻松实现Mashup。</p>
            <p>5.测绘矢量数据、卫星云图、气象栅格数据、遥感卫星数据、BIM、倾斜测量数据的可视化展示。</p>
          </div>
          <ul className="demo-images">
            <li><img src={demo1} /></li>
            <li><img src={demo2} /></li>
            <li><img src={demo3} /></li>
            <li><img src={demo4} /></li>
            <li><img src={demo5} /></li>
            <li><img src={demo6} /></li>
          </ul>
        </article>
        <article>
          <p className="page-summary-title">1.4 arcgis api学习资料</p>
          <div className="page-summary-info">
            <ul className="demo-images">
              <li><span>arcgis api 3.x：</span><a href="https://developers.arcgis.com/javascript/3/">https://developers.arcgis.com/javascript/3/</a></li>
              <li><span>arcgis api 4.x：</span><a href="https://developers.arcgis.com/javascript/">https://developers.arcgis.com/javascript/</a></li>
            </ul>
          </div>
        </article>
      </section>
    </div>
  )
}
