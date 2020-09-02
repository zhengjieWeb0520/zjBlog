```jsx
import React, { useEffect } from 'react'
import L from 'leaflet'
import '../../../utils/leafletApi/tools/leaflet_plugins/leaflet-baseMap' // 底图扩展

export default function InitMap () {
  useEffect(() => {
    initMap()
  }, [])

  const initMap = () => {
    /* ArcGIS底图 */

    // 电子地图
    const arcgisStreets = L.tileLayer.chinaProvider('Arcgis.Normal.Map', {
      maxZoom: 18,
      minZoom: 0,
      className: 'leaflet-layer'
    })

    // 卫星图
    const arcgisSatellite = L.tileLayer.chinaProvider(
      'Arcgis.Satellite.Map',
      {
        maxZoom: 18,
        minZoom: 0,
        className: 'leaflet-layer'
      }
    )
    // 卫星标注
    const arcgisSatelliteAnnotion = L.tileLayer.chinaProvider(
      'Arcgis.Satellite.Annotion',
      {
        maxZoom: 18,
        minZoom: 0,
        className: 'leaflet-layer'
      }
    )

    // 蓝色系图层
    const arcgisBlue = L.tileLayer.chinaProvider(
      'Arcgis.Normal.PurplishBlue',
      {
        maxZoom: 18,
        minZoom: 0,
        className: 'leaflet-layer'
      }
    )

    // 暖色系图层
    const arcgisWarm = L.tileLayer.chinaProvider(
      'Arcgis.Normal.Warm',
      {
        maxZoom: 18,
        minZoom: 0,
        className: 'leaflet-layer'
      }
    )

    // 灰色系图层
    const arcgisGray = L.tileLayer.chinaProvider(
      'Arcgis.Normal.Gray',
      {
        maxZoom: 18,
        minZoom: 0,
        className: 'leaflet-layer'
      }
    )

    // 图层组
    const arcgisHybrid = L.layerGroup([
      arcgisSatellite,
      arcgisSatelliteAnnotion
    ])

    var baseLayers = {
      'Arcgis(街道)': arcgisStreets,
      'Arcgis(卫星)': arcgisSatellite,
      'Arcgis(混合)': arcgisHybrid,
      'Arcgis(蓝色系)': arcgisBlue,
      'Arcgis(暖色系)': arcgisWarm,
      'Arcgis(灰色系)': arcgisGray
    }

    // 初始化地图
    const leafletMap = L.map('mapContent', {
      center: [35.54, 110.23],
      zoom: 3.4,
      layers: [arcgisStreets],
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