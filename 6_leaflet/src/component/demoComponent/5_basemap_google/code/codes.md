```jsx
import React, { useEffect } from 'react'
import L from 'leaflet'
import '../../../utils/leafletApi/tools/leaflet_plugins/leaflet-baseMap' // 底图扩展

export default function InitMap () {
  useEffect(() => {
    initMap()
  }, [])

  const initMap = () => {
    // 街道图层
    const googleNormalMap = L.tileLayer.chinaProvider('Google.Normal.Map', {
      maxZoom: 23,
      minZoom: 0,
      className: 'leaflet-layer'
    })

    // 地形图
    const googleTerrainMap = L.tileLayer.chinaProvider('Google.Terrain.Map', {
      maxZoom: 23,
      minZoom: 0,
      className: 'leaflet-layer'
    })

    // 地形图标注
    const googleTerrainAnnotion = L.tileLayer.chinaProvider(
      'Google.Terrain.Annotion',
      {
        maxZoom: 23,
        minZoom: 0,
        className: 'leaflet-layer'
      }
    )

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
    const googleterrain = L.layerGroup([
      googleTerrainMap,
      googleTerrainAnnotion
    ])
    const googleHybrid = L.layerGroup([
      googleSatelliteMap,
      googleSatelliteAnnotion
    ])

    var baseLayers = {
      '谷歌地图(街道)': googleNormalMap,
      '谷歌地图(地形)': googleterrain,
      '谷歌地图(卫星)': googleSatelliteMap,
      '谷歌地图(混合)': googleHybrid
    }

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