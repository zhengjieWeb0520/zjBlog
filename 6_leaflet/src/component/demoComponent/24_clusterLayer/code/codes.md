```jsx
import React, { useEffect } from 'react'
import L from 'leaflet'
import '../../../utils/leafletApi/tools/leaflet_plugins/leaflet-baseMap' // 底图扩展
import '../../../utils/leafletApi/tools/leaflet_plugins/leaflet-markercluster' // 聚合图层扩展
import '../../../utils/leafletApi/css/leaflet.scss'

export default function InitMap () {
  useEffect(() => {
    initMap()
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
      center: [37.9065173667, 175.4755659333],
      zoom: 8,
      layers: [googleHybrid],
      zoomControl: false,
      worldCopyJump: true,
      zoomSnap: 0.5,
      zoomDelta: 0.5,
      minZoom: 3,
      wheelPxPerZoomLevel: 120
    })

    addClusterLayer(leafletMap)
  }

  // 添加聚合图层
  const addClusterLayer = (leafletMap) => {
    axios.get('./data/vector/cluster.json').then(res => {
      const points = res.data
      console.warn(points)
      const clusterMarkers = L.markerClusterGroup()
      for (var i = 0; i < points.length; i++) {
        var a = points[i]
        var title = a[2]
        var marker = L.marker(new L.LatLng(a[0], a[1]), { title: title })
        marker.bindPopup(title)
        clusterMarkers.addLayer(marker)
      }
      leafletMap.addLayer(clusterMarkers)
    })
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