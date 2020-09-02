```jsx
import React, { useEffect } from 'react'
import L from 'leaflet'
import '../../../utils/leafletApi/tools/leaflet_plugins/leaflet-baseMap' // 底图扩展

export default function InitMap () {
  let leafletMap = {}
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
    leafletMap = L.map('mapContent', {
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

    requestPointsData()
  }

  // 请求点位数据
  const requestPointsData = () => {
    axios.get('./data/vector/markers.json').then(res => {
      if (res.status === 200) {
        const data = res.data
        const iconSize = [36, 36]
        const option = {
          className: 'markerGroupLayer'
        }
        addMultiMarkerLayer(
          data,
          'lon',
          'lat',
          iconSize,
          option
        )
      }
    })
  }

  /**
   * 添加多个标记图层
   * @param {Array} latlngs 标记的数据
   * @param {String} x 经度
   * @param {String} y 纬度
   * @param {Array} iconSize 图标大小
   * @param {Object} option 参数
   */
  const addMultiMarkerLayer = (
    latlngs,
    x = 'lon',
    y = 'lat',
    iconSize = [20, 20],
    option
  ) => {
    const markerLayerGroup = new L.featureGroup()
    markerLayerGroup.clearLayers()
    latlngs.forEach(element => {
      const latlng = [element[y], element[x]]
      // 自定义一个maker
      const greenIcon = L.icon({
        iconUrl: markerIcon,
        iconSize: iconSize, // size of the icon
        popupAnchor: [0, -10] // point from which the popup should open relative to the iconAnchor
      })
      const markerOption = Object.assign(option, { icon: greenIcon })
      // pop
      const content = `<div><p>${
        element.name
        }</p><div><span>经度：</span><span>${
        element.lon
        }</span></div><div><span>纬度：</span><span>${
        element.lat
        }</span></div></div>`
      const marker = L.marker(latlng, markerOption)
        .bindTooltip(`${element.name}`, { direction: 'left' })
        .openTooltip()
      marker.bindPopup(content)
      markerLayerGroup.addLayer(marker)
    })
    leafletMap.addLayer(markerLayerGroup)
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