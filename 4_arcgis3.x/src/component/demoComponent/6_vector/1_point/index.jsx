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
        'esri/geometry/Point',
        'esri/InfoTemplate',
        'esri/symbols/SimpleMarkerSymbol',
        'esri/symbols/PictureMarkerSymbol',
        'esri/Color'
      ])
      .then(([
        GraphicsLayer,
        Graphic,
        Point,
        InfoTemplate,
        SimpleMarkerSymbol,
        PictureMarkerSymbol,
        Color
      ]) => {
        var pointLayer = new GraphicsLayer({
          id: 'pointLayer'
        })
        mapView.addLayer(pointLayer)
        const pointsData = [
          {
            name: '南京市',
            lon: 118.796623,
            lat: 32.059352
          },
          {
            name: '扬州市',
            lon: 119.421003,
            lat: 32.393159
          },
          {
            name: '苏州市',
            lon: 120.619585,
            lat: 31.299379
          }
        ]
        pointsData.forEach((item) => {
          // 定义点
          const point = new Point(
            {
              x: item.lon,
              y: item.lat,
              spatialReference: { wkid: 4326 }
            }
          )
          // 定义图形
          // const symbol = new PictureMarkerSymbol({
          //   url: 'graphics/redArrow2.png',
          //   height: 20,
          //   width: 20,
          //   type: 'esriPMS',
          //   angle: -30
          // })
          const symbol = new SimpleMarkerSymbol().setStyle(
            SimpleMarkerSymbol.STYLE_SQUARE).setColor(new Color([255, 0, 0, 0.5]))
          // 定义属性
          const attributes = { name: item.name, lon: item.lon, lat: item.lat }
          // 定义弹框
          var infoTemplate = new InfoTemplate('Vernal Pool Locations')
          // 定义图形
          var graphic = new Graphic(point, symbol, attributes, infoTemplate)
          pointLayer.add(graphic)
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
      <Button type="info" onClick={addLayer}>添加点</Button>
      <Button type="info" onClick={removeLayer}>移除点</Button>
    </div>
  )
}

/* 加载底图 */
export default class InitMap extends Component {
  constructor (props) {
    super(props)
    this.allBaseLayer = [] // 底图数组
    this.initCenter = [119, 34] // 初始化中心经纬度
    this.initZoom = 4 // 初始化缩放级别
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
          'esri/layers/gaodeLayer'
        ],
        mapOption
      )
      .then(([
        map,
        gaodeLayer
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
        const baseLayer = new gaodeLayer({
          id: 'gaode_road',
          layertype: 'road',
          visible: true
        })

        mapView.addLayer(baseLayer)
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
        <Toolbar mapView={mapView} initCenter={this.initCenter} initZoom={this.initZoom} />
      </div>
    )
  }
}
