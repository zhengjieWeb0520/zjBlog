import React, { useEffect, useState } from 'react'
import axios from 'axios'
import CodeBtn from '../../template/codeBtn'
import CodeSource from '../../template/codeSource'
import demoCodes from './code/codes.md'
import L from 'leaflet'
import '../../../utils/leafletApi/tools/leaflet_plugins/leaflet-baseMap' // 底图扩展
import '../../../utils/leafletApi/tools/leaflet_plugins/leaflet-heat' // 热力图扩展
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
      center: [30.245853, 120.109947],
      zoom: 15,
      layers: [googleHybrid],
      zoomControl: false,
      worldCopyJump: true,
      zoomSnap: 0.5,
      zoomDelta: 0.5,
      minZoom: 3,
      wheelPxPerZoomLevel: 120
    })

    addHeatMapLayer(leafletMap)
  }

  // 加载热力图
  const addHeatMapLayer = (leafletMap) => {
    axios.get('./data/vector/heatMap.json').then(res => {
      const data = res.data
      let pointsData = []
      data.forEach(element => {
        element.forEach(item => {
          const itemData = [item.coord[1], item.coord[0], item.elevation]
          pointsData.push(itemData)
        })
      })
      const options = {
        minOpacity: 0.05,
        maxZoom: 18,
        radius: 40,
        blur: 20,
        max: 1.0
      }

      pointsData = pointsData.map(function (p) {
        return [p[0], p[1]]
      })
      L.heatLayer(pointsData, options).addTo(leafletMap)
    })
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
