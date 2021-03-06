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
   * 添加图层
   * @param {*}
   */
  const addLayer = () => {
    esriLoader
      .loadModules([
        'esri/layers/MapImageLayer',
        'esri/layers/MapImage'
      ])
      .then(([
        MapImageLayer,
        MapImage
      ]) => {
        // 定义图层
        const imageLayer = new MapImageLayer({
          id: 'imageLayer',
          opacity: 0.9
        })
        mapView.addLayer(imageLayer, 5)
        const url = 'http://zj-fileserver.oss-cn-shanghai.aliyuncs.com/zjFileServer/images/20190624MYD.png'
        const extent = {
          xmin: 117.325157,
          xmax: 126.605055,
          ymin: 18.488356,
          ymax: 41.736681
        }
        // 定义图片
        const image = new MapImage({
          extent,
          href: url
        })
        imageLayer.addImage(image)
      })
  }

  /**
   * 移除图片图层
   */
  const removeLayer = () => {
    const imageLayer = mapView.getLayer('imageLayer')
    if (imageLayer) {
      imageLayer.removeAllImages() // 清除图片
      mapView.removeLayer(imageLayer) // 移除图层
    }
  }
  return (
    <div className="toolbar" style={toolbarStyle}>
      <Button type="info" onClick={addLayer}>添加图片图层</Button>
      <Button type="info" onClick={removeLayer}>移除图片图层</Button>
    </div>
  )
}

/* 加载底图 */
export default class InitMap extends Component {
  constructor (props) {
    super(props)
    this.allBaseLayer = [], // 底图数组
    this.initCenter = [119, 34] // 初始化中心经纬度
    this.initZoom = 4 // 初始化缩放级别
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