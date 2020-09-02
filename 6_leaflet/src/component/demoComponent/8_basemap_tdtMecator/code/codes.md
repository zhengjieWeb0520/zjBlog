```jsx
import React, { useEffect } from 'react'
import L from 'leaflet'
import '../../../utils/leafletApi/tools/leaflet_plugins/leaflet-baseMap' // 底图扩展

export default function InitMap () {
  useEffect(() => {
    initMap()
  }, [])

  const initMap = () => {
    // 电子地图
    const tdtNormalMap = L.tileLayer.chinaProvider('TtdMector.Normal.Map', {
      maxZoom: 23,
      minZoom: 0,
      className: 'leaflet-layer'
    })

    // 电子地图标注
    const tdtNormalAnnotion = L.tileLayer.chinaProvider('TtdMector.Normal.Annotion', {
      maxZoom: 23,
      minZoom: 0,
      className: 'leaflet-layer'
    })

    // 地形图
    const tdtTerrainMap = L.tileLayer.chinaProvider('TtdMector.Terrain.Map', {
      maxZoom: 23,
      minZoom: 0,
      className: 'leaflet-layer'
    })

    // 地形图标注
    const tdtTerrainAnnotion = L.tileLayer.chinaProvider(
      'TtdMector.Terrain.Annotion',
      {
        maxZoom: 23,
        minZoom: 0,
        className: 'leaflet-layer'
      }
    )

    // 卫星图层
    const tdtSatelliteMap = L.tileLayer.chinaProvider(
      'TtdMector.Satellite.Map',
      {
        maxZoom: 23,
        minZoom: 0,
        className: 'leaflet-layer'
      }
    )

    // 卫星标注图层
    const tdtSatelliteAnnotion = L.tileLayer.chinaProvider(
      'TtdMector.Satellite.Annotion',
      {
        maxZoom: 23,
        minZoom: 0,
        className: 'leaflet-layer3'
      }
    )

    // 图层组
    const tdtTerrain = L.layerGroup([
      tdtTerrainMap,
      tdtTerrainAnnotion
    ])
    const tdtHybrid = L.layerGroup([
      tdtSatelliteMap,
      tdtSatelliteAnnotion
    ])
    const tdtDigital = L.layerGroup([
      tdtNormalMap,
      tdtNormalAnnotion
    ])

    var baseLayers = {
      '天地图(街道)': tdtDigital,
      '天地图(地形)': tdtTerrain,
      '天地图(卫星)': tdtHybrid
    }

    // 初始化地图
    const leafletMap = L.map('mapContent', {
      center: [35.54, 110.23],
      zoom: 3.4,
      layers: [tdtHybrid],
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