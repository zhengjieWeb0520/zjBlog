/* eslint-disable */
import React, { Component } from 'react'
import esriLoader from 'esri-loader'
import { Button, message } from 'antd'
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
   * 添加图层
   * @param {*}
   */
  const addLayer = () => {
    esriLoader
      .loadModules([
        'esri/layers/ArcGISDynamicMapServiceLayer',
        'esri/tasks/IdentifyTask',
        'esri/tasks/IdentifyParameters',
        'esri/geometry/webMercatorUtils'
      ])
      .then(([
        ArcGISDynamicMapServiceLayer,
        IdentifyTask,
        IdentifyParameters,
        WebMercatorUtils
      ]) => {
        // 定义图层
        const url = 'http://localhost:6080/arcgis/rest/services/zjBlog/jsBorder/MapServer'
        const dynamicLayer = new ArcGISDynamicMapServiceLayer(url, {
          id: 'dynamicLayer',
          opacity: 0.9
        })
        // 设置各图层表达式
        let layerDefinition = []
        layerDefinition[1] = `Name = '南京市' or Name='扬州市' or Name='连云港市'`
        layerDefinition[2] = `Name = '沛县' or Name='昆山市' or Name='太仓市'`
        dynamicLayer.setLayerDefinitions(layerDefinition)
        mapView.addLayer(dynamicLayer)

        // 图层添加点击事件
        executeDynamicIdentify(url, IdentifyTask, IdentifyParameters, WebMercatorUtils)
      })
  }

  /**
   * dynamic图层点击事件
   * @param {*} url 
   * @param {*} IdentifyTask 
   * @param {*} IdentifyParameters 
   * @param {*} WebMercatorUtils 
   */
  const executeDynamicIdentify = (url, IdentifyTask, IdentifyParameters, WebMercatorUtils) => {
    let identifyTask = new IdentifyTask(url)
    let params = new IdentifyParameters()
    // 地图点击事件
    mapView.on('click', (evt) => {
      let mapPoint = evt.mapPoint
      let mapExtent = mapView.extent
      // 判断点击是否为墨卡托投影
      if (mapPoint.spatialReference.isWebMercator()) {
        mapPoint = WebMercatorUtils.webMercatorToGeographic(mapPoint)
        mapExtent = WebMercatorUtils.webMercatorToGeographic(mapExtent)
      }
      // 设置查询条件（同加载的匹配条件）
      let layerDefinition = []
      layerDefinition[0] = '1 = 1'
      layerDefinition[1] = `Name = '南京市' or Name='扬州市' or Name='连云港市'`
      layerDefinition[2] = `Name = '沛县' or Name='昆山市' or Name='太仓市'`
      params.geometry = mapPoint
      params.mapExtent = mapExtent
      params.tolerance = 5 // 缓冲区范围
      params.layerOption = IdentifyParameters.LAYER_OPTION_VISIBLE
      params.layerDefinitions = layerDefinition
      identifyTask.execute(params).then(result => {
        let content = '点击了'
        result.forEach((item) => {
          content = content + `${item.layerName}图层的${item.value};`
        })
        message.success({
          content,
          className: 'custom-class',
          style: {
            marginTop: '20vh'
          }
        })
      })
    })
  }

  /**
   * 移除图层
   */
  const removeLayer = () => {
    const dynamicLayer = mapView.getLayer('dynamicLayer')
    if (dynamicLayer) {
      mapView.removeLayer(dynamicLayer) // 移除图层
    }
  }
  return (
    <div className="toolbar" style={toolbarStyle}>
      <Button type="info" onClick={addLayer}>添加图层</Button>
      <Button type="info" onClick={removeLayer}>移除图层</Button>
    </div>
  )
}

/* 加载底图 */
export default class InitMap extends Component {
  constructor (props) {
    super(props)
    this.allBaseLayer = [] // 底图数组
    this.initCenter = [119, 33] // 初始化中心经纬度
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
          id: 'gaode_st',
          layertype: 'st',
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
