import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Button } from 'antd'
import CodeBtn from '../../template/codeBtn'
import CodeSource from '../../template/codeSource'
import demoCodes from './code/codes.md'
import L from 'leaflet'
import '../../../utils/leafletApi/tools/leaflet_plugins/leaflet-baseMap' // 底图扩展
import './index.scss'

/* 工具条组件 */
function ToolBar (props) {
  const { mapView, initParams } = props
  // 放大
  const zoomIn = () => {
    mapView.zoomIn()
  }
  // 缩小
  const zoomOut = () => {
    mapView.zoomOut()
  }
  // 恢复
  const recover = () => {
    mapView.flyTo(L.latLng(initParams.center[0], initParams.center[1]), initParams.zoom)
    // mapView.setView(L.latLng(initParams.center[0], initParams.center[1]), initParams.zoom)
  }
  const style = {
    position: 'absolute',
    top: '0.8rem',
    right: '1rem',
    zIndex: 999
  }
  return (
    <div className="toolbar" style={style}>
      <Button onClick={zoomIn}>放大</Button>
      <Button onClick={zoomOut}>缩小</Button>
      <Button onClick={recover}>恢复</Button>
    </div>
  )
}

/* 地图组件 */
export default function InitMap () {
  const [codes, setCodes] = useState('')
  const [mapView, setMapView] = useState({})
  const initParams = {
    center: [35.54, 110.23],
    zoom: 3.5
  }
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
      center: initParams.center,
      zoom: initParams.zoom,
      layers: [googleHybrid],
      zoomControl: false,
      worldCopyJump: true,
      zoomSnap: 0.5,
      zoomDelta: 0.5,
      minZoom: 3,
      wheelPxPerZoomLevel: 120
    })
    setMapView(leafletMap)
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
      <ToolBar mapView={mapView} initParams={initParams}/>
      <CodeBtn />
    </div>
  )
}
