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
  const { mapView, initCenter, initZoom } = props
  const toolbarStyle = {
    position: 'absolute',
    right: '1rem',
    top: '0.2rem',
    zIndex: 999
  }
  /**
   * 执行框选
   * @param {*} type
   */
  const handleExcute = () => {
    esriLoader
      .loadModules([
        'esri/toolbars/draw'
      ])
      .then(([Draw]) => {
        Toolbar.mapDraw = new Draw(mapView, {})
        Toolbar.mapDraw.activate(Draw.EXTENT)
        Toolbar.mapDraw.on('draw-end', evt => {
          mapView.setExtent(evt.geometry, false)
        })
      })
  }

  /**
   * 取消框选
   */
  const handleCancle = () => {
    Toolbar.mapDraw.deactivate()
  }
  return (
    <div className="toolbar" style={toolbarStyle}>
      <Button type="info" onClick={handleExcute}>框选放大</Button>
      <Button type="info" onClick={handleCancle}>取消框选</Button>
    </div>
  )
}
Toolbar.mapDraw = {}

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
        <Toolbar mapView={mapView} />
      </div>
    )
  }
}
