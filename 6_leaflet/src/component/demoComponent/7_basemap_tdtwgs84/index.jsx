import React, { useEffect, useState } from 'react'
import axios from 'axios'
import CodeBtn from '../../template/codeBtn'
import CodeSource from '../../template/codeSource'
import demoCodes from './code/codes.md'
import L from 'leaflet'
import '../../../utils/leafletApi/tools/leaflet_plugins/leaflet-baseMap' // 底图扩展
import '../../../utils/leafletApi/tools/leaflet_plugins/leaflet-tilelayer-wmts'
import './index.scss'

/* 初始化地图 */
export default function InitMap () {
  const [codes, setCodes] = useState('')

  useEffect(() => {
    initMap()
    readCodes()
  }, [])

  const initMap = () => {
    const vecUrl = 'http://t0.tianditu.gov.cn/vec_c/wmts?tk=4aef299f1178a8329a9cdc325a055b85'

    const cvaUrl = 'http://t0.tianditu.gov.cn/cva_c/wmts?tk=4aef299f1178a8329a9cdc325a055b85'

    const imgUrl = 'http://t0.tianditu.gov.cn/img_c/wmts?tk=4aef299f1178a8329a9cdc325a055b85'

    const ciaUrl = 'http://t0.tianditu.gov.cn/cia_c/wmts?tk=4aef299f1178a8329a9cdc325a055b85'

    // 电子地图
    const vecLayer = new L.tileLayer.wmts(vecUrl,
      {
        tileSize: 512,
        layer: 'vec',
        style: 'default',
        tilematrixSet: 'c',
        format: 'tiles'
      }
    )

    // 电子地图标注
    const cvaLayer = new L.tileLayer.wmts(cvaUrl,
      {
        tileSize: 512,
        layer: 'cva',
        style: 'default',
        tilematrixSet: 'c',
        format: 'tiles'
      }
    )

    // 卫星地图
    const imgLayer = new L.tileLayer.wmts(imgUrl,
      {
        tileSize: 512,
        layer: 'img',
        style: 'default',
        tilematrixSet: 'c',
        format: 'tiles'
      }
    )

    // 卫星地图标注
    const ciaLayer = new L.tileLayer.wmts(ciaUrl,
      {
        tileSize: 512,
        layer: 'cia',
        style: 'default',
        tilematrixSet: 'c',
        format: 'tiles'
      }
    )

    // 图层组
    const tdtDigitalLayer = L.layerGroup([
      vecLayer,
      cvaLayer
    ])

    const tdtSatelliteLayer = L.layerGroup([
      imgLayer,
      ciaLayer
    ])

    const baseLayers = {
      '天地图(电子地图)': tdtDigitalLayer,
      '天地图(影像地图)': tdtSatelliteLayer
    }

    // 初始化地图
    const leafletMap = L.map('mapContent', {
      center: {
        lon: 110.23,
        lat: 35.54
      },
      zoom: 3.4,
      layers: [tdtDigitalLayer],
      zoomControl: false,
      worldCopyJump: true,
      zoomSnap: 0.5,
      zoomDelta: 0.5,
      minZoom: 0,
      crs: L.CRS.EPSG4326, // wgs_84坐标系（天地图）需添加这句
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
