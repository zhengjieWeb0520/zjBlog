import React, { useEffect, useState } from 'react'
import axios from 'axios'
import CodeBtn from '../../template/codeBtn'
import CodeSource from '../../template/codeSource'
import demoCodes from './code/codes.md'
import L from 'leaflet'
import '../../../utils/leafletApi/tools/leaflet_plugins/leaflet-baseMap' // 底图扩展
import './index.scss'

/* 初始化地图 */
export default function InitMap () {
  const [codes, setCodes] = useState('')

  useEffect(() => {
    initMap()
    readCodes()
  }, [])

  const initMap = () => {
    // 卫星图层
    const googleSatelliteMap = L.tileLayer.chinaProvider(
      'Google.Satellite.Map',
      {
        maxZoom: 23,
        minZoom: 0,
        className: 'leaflet-layer'
      }
    )

    // 卫星标注图层
    const googleSatelliteAnnotion = L.tileLayer.chinaProvider(
      'Google.Satellite.Annotion',
      {
        maxZoom: 23,
        minZoom: 0,
        className: 'leaflet-layer3'
      }
    )

    // 图层组
    const googleHybrid = L.layerGroup([
      googleSatelliteMap,
      googleSatelliteAnnotion
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
      minZoom: 3,
      wheelPxPerZoomLevel: 120
    })

    addPolygonVector(leafletMap)
  }

  // 添加矩形矢量
  const addPolygonVector = (leafletMap) => {
    const latlngs = [
      [
        [[27, 109.05], [31, 109.03], [31, 102.05], [27, 102.04]], // outer ring
        [[27.29, 108.58], [30.71, 108.58], [30.71, 102.5], [27.29, 102.5]] // hole
      ],
      [[[31, 111.03], [35, 111.04], [35, 104.05], [31, 104.05]]]
    ]
    const option = {
      color: 'red',
      fillColor: '#f03',
      fillOpacity: 0.5,
      className: 'polygonLayer'
    }
    const polygon = L.polygon(latlngs, option)
    leafletMap.addLayer(polygon)
    leafletMap.fitBounds(polygon.getBounds())
  }

  const readCodes = () => {
    axios.get(demoCodes).then(res => {
      console.warn(res)
      const { data } = res
      let codes = data.split('---').filter(Boolean)
      codes = codes.map(code => {
        return code
          .replace(/```jsx/, '')
          .replace(/```/, '')
          .trim()
      })
      setCodes(codes)
    })
  }

  return (
    <div className="page-content">
      <CodeSource codes={codes} />
      <div className="map-content" id="mapContent"></div>
      <CodeBtn />
    </div>
  )
}
