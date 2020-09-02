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
    /* 高德底图 */

    // 电子地图
    const gaoDeNormalMap = L.tileLayer.chinaProvider('GaoDe.Normal.Map', {
      maxZoom: 18,
      minZoom: 3,
      className: 'leaflet-layer'
    })

    // 卫星
    const gaoDeSatelliteMap = L.tileLayer.chinaProvider('GaoDe.Satellite.Map', {
      maxZoom: 18,
      minZoom: 0,
      className: 'leaflet-layer'
    })

    // 卫星标注
    const gaoDeSatelliteAnnotion = L.tileLayer.chinaProvider(
      'GaoDe.Satellite.Annotion',
      {
        maxZoom: 18,
        minZoom: 0,
        className: 'leaflet-layer'
      }
    )

    // 图层组
    const gaodeHybrid = L.layerGroup([
      gaoDeSatelliteMap,
      gaoDeSatelliteAnnotion
    ])

    var baseLayers = {
      '高德地图(街道)': gaoDeNormalMap,
      '高德地图(卫星)': gaoDeSatelliteMap,
      '高德地图(混合)': gaodeHybrid
    }

    // 初始化地图
    const leafletMap = L.map('mapContent', {
      center: [35.54, 110.23],
      zoom: 3.4,
      layers: [gaodeHybrid],
      zoomControl: false,
      worldCopyJump: true,
      zoomSnap: 0.5,
      zoomDelta: 0.5,
      minZoom: 3,
      wheelPxPerZoomLevel: 120
    })

    const layerControl = L.control.layers(baseLayers)
    leafletMap.addControl(layerControl)
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
