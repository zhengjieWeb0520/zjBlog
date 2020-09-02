import React, { useEffect } from 'react'
import { useHistory, Link } from 'react-router-dom'
import L from 'leaflet'
import '../../utils/leafletApi/tools/leaflet_plugins/leaflet-baseMap' // 底图扩展
import '../../utils/leafletApi/tools/leaflet_plugins/leaflet-css/leaflet.scss'
import Header from '../../component/template/header'
import './index.scss'

/* 首页 */
export default (props) => {
  const history = useHistory()
  useEffect(() => {
    // 初始化地图
    initMap()
  }, [])

  const initMap = () => {
    const GoogleSatelliteMap = L.tileLayer.chinaProvider(
      'Google.Satellite.Map',
      {
        maxZoom: 23,
        minZoom: 0,
        className: 'leaflet-layer'
      }
    ) // 卫星
    const GoogleSatelliteAnnotion = L.tileLayer.chinaProvider(
      'Google.Satellite.Annotion',
      {
        maxZoom: 23,
        minZoom: 0,
        className: 'leaflet-layer'
      }
    ) // 卫星标注
    const googleHybrid = L.layerGroup([
      GoogleSatelliteMap,
      GoogleSatelliteAnnotion
    ])
    // 初始化地图
    const leafletMap = L.map('mapContent', {
      center: [35.54, 110.23],
      zoom: 3.4,
      layers: [googleHybrid],
      zoomControl: false,
      worldCopyJump: true,
      zoomSnap: 0.5,
      zoomDelta: 0.5,
      // crs: L.CRS.EPSG4326, // wgs_84坐标系（天地图）需添加这句
      minZoom: 3,
      wheelPxPerZoomLevel: 120
    })
  }
  return (
    <div className="page page-index">
      <Header />
      <section className="page-index-content">
        <ul>
          <li>
            <Link to='/main/summary'>介绍</Link>
          </li>
          <li>
            <Link to='/main/demo'>
              demo
            </Link>
          </li>
          <li>下载</li>
        </ul>
      </section>
      <div id="mapContent" className="map-content"></div>
    </div>
  )
}
