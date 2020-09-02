```jsx
import React, { useState, Component } from 'react'
import esriLoader from 'esri-loader'
import { Button } from 'antd'

/* 工具栏 */
function Toolbar (props) {
  // 底图数组属性
  const { mapView } = props
  const toolbarStyle = {
    position: 'absolute',
    right: '1rem',
    top: '0.2rem',
    zIndex: 999
  }
  /**
   * 点击操作
   * @param {*}
   */
  const addLayer = () => {
    esriLoader
      .loadModules([
        'esri/layers/GraphicsLayer',
        'esri/graphic',
        'esri/InfoTemplate'
      ])
      .then(([
        GraphicsLayer,
        Graphic,
        InfoTemplate
      ]) => {
        var polylineLayer = new GraphicsLayer({
          id: 'polylineLayer'
        })
        mapView.addLayer(polylineLayer)
        const lineData = [
          {
            name: '南京市->扬州市',
            path: [
              [
                [118.796623, 32.059352],
                [119.421003, 32.393159]
              ]
            ]
          },
          {
            name: '南京市->苏州市',
            path: [
              [
                [118.796623, 32.059352],
                [120.619585, 31.299379]
              ]
            ]
          }
        ]
        lineData.forEach((item) => {
          // 定义属性
          const attributes = { name: item.name }
          // 定义弹框
          const infoTemplate = new InfoTemplate('Vernal Pool Locations')
          // 定义图形
          const line = {
            geometry: {
              paths: item.path,
              spatialReference: { wkid: 4326 }
            },
            symbol: {
              color: [0, 0, 0, 255],
              width: 1,
              type: 'esriSLS',
              style: 'esriSLSSolid'
            },
            attributes,
            infoTemplate
          }
          const graphic = new Graphic(line)
          polylineLayer.add(graphic)
        })
      })
  }

  /**
   * 移除点图层
   */
  const removeLayer = () => {
    const pointLayer = mapView.getLayer('pointLayer')
    if (pointLayer) {
      pointLayer.clear() // 清除图形
      mapView.removeLayer(pointLayer) // 移除图层
    }
  }
  return (
    <div className="toolbar" style={toolbarStyle}>
      <Button type="info" onClick={addLayer}>添加线</Button>
      <Button type="info" onClick={removeLayer}>移除线</Button>
    </div>
  )
}

  /**
   * 移除点图层
   */
  const removeLayer = () => {
    const pointLayer = mapView.getLayer('pointLayer')
    if (pointLayer) {
      pointLayer.clear() // 清除图形
      mapView.removeLayer(pointLayer) // 移除图层
    }
  }
  return (
    <div className="toolbar" style={toolbarStyle}>
      <Button type="info" onClick={addLayer}>添加点</Button>
      <Button type="info" onClick={removeLayer}>移除点</Button>
    </div>
  )
}

/* 加载底图 */
export default class InitMap extends Component {
  constructor (props) {
    super(props)
    this.allBaseLayer = [], // 底图数组
    this.initCenter = [119, 32] // 初始化中心经纬度
    this.initZoom = 11 // 初始化缩放级别
  }

  state = {
    mapView: {} // 地图对象
  }

  componentDidMount () {
    // 初始化地图
    this.initMap()
  }

  /**
   * 初始化地图
   */
  initMap = () => {
    const mapOption = {
      url: 'http://www.zjmap88.site/arcgis_js_api/library/3.26/3.26/init.js'
    }
    esriLoader
      .loadModules(
        [
          'esri/map',
          'esri/layers/googleLayer'
        ],
        mapOption
      )
      .then(([
        map,
        googleLayer
      ]) => {
        const mapView = new map('mapContent', {
          logo: false,
          slider: false,
          showAttribution: false,
          showLabels: true,
          zoom: this.initZoom,
          center: this.initCenter,
          // infoWindow: this.popup,
          minZoom: 2, // 最小空间等级
          maxZoom: 18 // 最大空间等级
        })

        // 定义图层
        const googleDigitalLayer = new googleLayer({
          id: 'google_road',
          layertype: 'road',
          visible: true
        })

        mapView.addLayer(googleDigitalLayer)
        this.setState({
          mapView
        })
      })
  }

  render () {
    const mapStyle = {
      width: '100%',
      height: '100%'
    }
    const { codes, mapView } = this.state
    return (
      <div className="page-content">
        <div id="mapContent" className="map-content" style={mapStyle}></div>>
        <Toolbar mapView={mapView} />
      </div>
    )
  }
}
```