import React, { useState, Component } from 'react'
import esriLoader from 'esri-loader'
import { Button } from 'antd'
import axios from 'axios'
import CodeBtn from '../../../template/codeBtn'
import CodeSource from '../../../template/codeSource'
import demoCodes from './code/codes.md'

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
        const polygonLayer = new GraphicsLayer({
          id: 'polygonLayer'
        })
        mapView.addLayer(polygonLayer)
        const polygonData = [
          {
            name: '南京市->扬州市->苏州市',
            rings: [
              [
                [118.796623, 32.059352],
                [119.421003, 32.393159],
                [120.619585, 31.299379],
                [118.796623, 32.059352]
              ]
            ]
          },
          {
            name: '徐州->淮安市->盐城',
            rings: [
              [
                [117.184811, 34.261792],
                [119.021265, 33.597506],
                [120.139998, 33.377631],
                [117.184811, 34.261792]
              ]
            ]
          }
        ]
        polygonData.forEach((item) => {
          // 定义属性
          const attributes = { name: item.name }
          // 定义弹框
          const infoTemplate = new InfoTemplate('Vernal Pool Locations')
          // 定义图形
          const polygon = {
            geometry: {
              paths: item.rings,
              spatialReference: { wkid: 4326 }
            },
            symbol: {
              color: [0, 0, 0, 64],
              outline: {
                color: [0, 0, 0, 255],
                width: 1,
                type: 'esriSLS',
                style: 'esriSLSSolid'
              },
              type: 'esriSFS',
              style: 'esriSFSSolid'
            },
            attributes,
            infoTemplate
          }

          const graphic = new Graphic(polygon)
          polygonLayer.add(graphic)
        })
      })
  }

  /**
   * 移除点图层
   */
  const removeLayer = () => {
    const polygonLayer = mapView.getLayer('polygonLayer')
    if (polygonLayer) {
      polygonLayer.clear() // 清除图形
      mapView.removeLayer(polygonLayer) // 移除图层
    }
  }
  return (
    <div className="toolbar" style={toolbarStyle}>
      <Button type="info" onClick={addLayer}>添加面</Button>
      <Button type="info" onClick={removeLayer}>移除面</Button>
    </div>
  )
}

/* 加载底图 */
export default class InitMap extends Component {
  constructor (props) {
    super(props)
    this.allBaseLayer = [] // 底图数组
    this.initCenter = [119, 32] // 初始化中心经纬度
    this.initZoom = 8 // 初始化缩放级别
  }

  state = {
    mapView: {}, // 地图对象
    codes: ''
  }

  componentDidMount () {
    // 初始化地图
    this.initMap()
    this.readCodes()
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

  /**
   * 读取代码
   */
  readCodes = () => {
    axios.get(demoCodes).then(res => {
      console.warn(res)
      const { data } = res
      let codes = data.split('---').filter(Boolean)
      codes = codes.map(code => {
        return code
          .replace(/```jsx/, '')
          .replace(/```/, '')
          .trim()
      })
      this.setState({
        codes
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
        <CodeSource codes={codes} />
        <div id="mapContent" className="map-content" style={mapStyle}></div>
        <CodeBtn />
        <Toolbar mapView={mapView} />
      </div>
    )
  }
}
