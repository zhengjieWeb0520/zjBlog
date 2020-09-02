```jsx
import React, { useEffect } from 'react'
import L from 'leaflet'
import '../../../utils/leafletApi/tools/leaflet_plugins/leaflet-baseMap' // 底图扩展
import '../../../utils/leafletApi/tools/leaflet_plugins/leaflet-tilelayer-wmts' // wmts扩展

export default function InitMap () {
  useEffect(() => {
    initMap()
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

  const style = {
    width: '100%',
    height: '100%'
  }

  return (
    <div className="page-content">
      <div className="mapContent" id="mapContent" style={style}></div>
    </div>
  )
}
```