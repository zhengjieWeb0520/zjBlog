```jsx
import React, { useEffect } from 'react'
import L from 'leaflet'
import '../../../utils/leafletApi/tools/leaflet_plugins/leaflet-baseMap' // 底图扩展

export default function InitMap () {
  useEffect(() => {
    initMap()
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