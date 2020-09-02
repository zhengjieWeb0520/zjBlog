```jsx
import React, { useEffect } from 'react'
import L from 'leaflet'
import '../../../utils/leafletApi/tools/leaflet_plugins/leaflet-baseMap' // 底图扩展

export default function InitMap () {
  let leafletMap = {}
  let gridLayerGroup = {}
  let gridMarkerLayerGroup = {}
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

    // 地图缩放监听
    leafletMap.on('zoomend', res => {
      const zoom = leafletMap.getZoom()
      toggleGridLabelLayer(zoom) // 格点标注图层显影
    })

    // 请求格网数据
    requestGridData()
  }

  // 请求格网数据
  const requestGridData = () => {
    axios.get('./data/vector/grid.json').then(res => {
      const gridData = res.data
      const step = 3 / 111 // 3代表3公里分辨率
      var latExtent = [34.587408, 40.746188] // 纬度范围
      var lonExtent = [110.211553, 114.563147] // 经度范围
      var cellCount = [
        Math.ceil((lonExtent[1] - lonExtent[0]) / step),
        Math.ceil((latExtent[1] - latExtent[0]) / step)
      ] // [0] 经度（列） [1] 纬度（行）

      const data = []
      for (let i = 0; i < cellCount[1]; i++) {
        // j 经度（列） i 纬度（行）
        for (let j = 0; j < cellCount[0]; j++) {
          // data.push([j, i, 0]) // echarts bining
          const lon = lonExtent[0] + (j + 1) * step - step / 2
          const lat = latExtent[0] + (i + 1) * step - step / 2
          data.push([lon, lat, 0])
        }
      }
      // 遍历数据给格点数据插入数据
      gridData.forEach(item => {
        const j = Math.floor((item.longitude - lonExtent[0]) / step) // 行
        const i = Math.floor((item.latitude - latExtent[0]) / step) // 列
        const index = i * cellCount[0] + j
        data[index][2] = data[index][2] + 1
      })
      addGridLayer(
        leafletMap,
        data,
        step / 2,
        'gridLayer'
      )
    })
  }

  /**
   * 添加格网图层
   * @param { Object } leafletMap 地图对象
   * @param { Arrary } dataInfo 格网数据
   * @param {Number} distance 格网分辨率
   */
  const addGridLayer = (leafletMap, dataInfo = [], distance) => {
    gridLayerGroup = new L.featureGroup()
    gridLayerGroup.clearLayers()
    gridMarkerLayerGroup = new L.featureGroup()
    gridMarkerLayerGroup.clearLayers()

    dataInfo.forEach(item => {
      if (item[2] !== 0) {
        const maxx = Number(item[0] + distance)
        const mimx = Number(item[0] - distance)
        const maxy = Number(item[1] + distance)
        const miny = Number(item[1] - distance)
        const bounds = [[miny, mimx], [maxy, maxx]]
        const color = getColor(item[2])
        const rectangle = L.rectangle(bounds, { color: color, weight: 1 })
        const label = addTextLayer(
          item[2],
          item[1],
          item[0],
          'my-div-icon',
          60
        )
        gridMarkerLayerGroup.addLayer(label)
        gridLayerGroup.addLayer(rectangle)
      }
    })
    leafletMap.addLayer(gridLayerGroup)
  }

  /**
   * 添加标注
   * @param {String} label 标记的值
   * @param {Number} lat 纬度
   * @param {Number} lon 经度
   * @param {String} className 类名
   */
  const addTextLayer = (label, lat, lon, className, iconSize) => {
    var myIcon = L.divIcon({
      html: label,
      className,
      iconSize
    })
    return L.marker([lat, lon], { icon: myIcon })
  }

  /**
  * 添加标注
  * @param { Number } zoom 缩放值
  */
  const toggleGridLabelLayer = (zoom) => {
    if (
      zoom > 12 &&
      leafletMap.hasLayer(gridLayerGroup) &&
      !leafletMap.hasLayer(gridMarkerLayerGroup)
    ) {
      leafletMap.addLayer(gridMarkerLayerGroup)
    }

    if (zoom < 12 && leafletMap.hasLayer(gridMarkerLayerGroup)) {
      gridMarkerLayerGroup.remove()
    }
  }

  /**
  * 获取渲染颜色
  * @param { Number } value 数值
  */
  const getColor = (value) => {
    const allColor = [
      '#FAF84F',
      '#FAE846',
      '#FBD13C',
      '#FABF34',
      '#FCAC2B',
      '#FCA326',
      '#FD8B1C',
      '#FC8217',
      '#FD6509',
      '#FC5603',
      '#FA0000'
    ]
    let index = Math.floor(value / 3)
    index = index <= 10 ? index : 10
    return allColor[index]
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