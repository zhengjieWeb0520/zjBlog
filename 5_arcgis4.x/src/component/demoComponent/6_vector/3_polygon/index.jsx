import React, { Component, useState } from 'react'
import esriLoader from 'esri-loader'
import { Button } from 'antd'
import axios from 'axios'
import CodeBtn from '../../../template/codeBtn'
import CodeSource from '../../../template/codeSource'
import demoCodes from './code/codes.md'

/* 工具栏 */
function Toolbar (props) {
  const [layerState, setLayerState] = useState('隐藏图层')
  // 底图数组属性
  const { mapView, mapApi } = props

  const {
    GraphicsLayer,
    Graphic,
    Polygon
  } = mapApi

  const toolbarStyle = {
    position: 'absolute',
    right: '1rem',
    top: '0.2rem',
    zIndex: 999
  }
  /**
   * 点击操作
   * @param {*} type
   */
  const handleClick = (evt, type) => {
    const excuteMethods = {
      add: () => addLayer(),
      showHide: () => showHideLayer(),
      remove: () => removeLayer('polygonLayer')
    }
    excuteMethods[type]()
  }
  /**
   * 添加图层
   */
  const addLayer = () => {
    let displayLayer = mapView.map.findLayerById('polygonLayer')
    if (displayLayer) {
      removeLayer('polygonLayer')
    } else {
      displayLayer = new GraphicsLayer({
        id: 'polygonLayer'
      })
    }
    mapView.map.add(displayLayer)

    axios.get('./data/vector/polygon.json').then((res) => {
      const { data } = res
      // 定义图形样式
      const symbol = {
        type: 'simple-fill',
        color: [51, 51, 204, 0.9],
        style: 'solid',
        outline: {
          color: 'white',
          width: 1
        }
      }
      data.forEach(item => {
        // 实例化面图层
        const polygon = new Polygon({
          hasZ: false,
          hasM: false,
          rings: item.rings,
          spatialReference: { wkid: 4326 }
        })
        // 实例化图形
        const graphic = new Graphic({
          geometry: polygon,
          symbol: symbol,
          attributes: item.attribute,
          popupTemplate: {
            title: '{name}',
            content: [{
              type: 'fields',
              fieldInfos: [
                {
                  fieldName: 'name',
                  label: '名称'
                },
                {
                  fieldName: 'desc',
                  label: '描述'
                }
              ]
            }]
          }
        })
        displayLayer.add(graphic)
      })
      console.warn(displayLayer)
    })
  }

  /**
   * 显示隐藏图层
   */
  const showHideLayer = () => {
    const displayLayer = mapView.map.findLayerById('polygonLayer')
    if (layerState === '隐藏图层') {
      displayLayer.visible = false
      setLayerState('显示图层')
    } else {
      displayLayer.visible = true
      setLayerState('隐藏图层')
    }
  }

  /**
   * 移除图层
   */
  const removeLayer = (layerId) => {
    const displayLayer = mapView.map.findLayerById(layerId)
    displayLayer && mapView.map.remove(displayLayer)
  }
  return (
    <div className="toolbar" style={toolbarStyle}>
      <Button type="info" onClick={v => handleClick(v, 'add')}>添加图层</Button>
      <Button type="info" onClick={v => handleClick(v, 'showHide')}>{layerState}</Button>
      <Button type="info" onClick={v => handleClick(v, 'remove')}>删除图层</Button>
    </div>
  )
}

/* 加载底图 */
export default class InitMap extends Component {
  constructor (props) {
    super(props)
    this.allBaseLayer = [] // 底图数组
    this.initCenter = [109, 34] // 初始化中心经纬度
    this.initZoom = 4 // 初始化缩放级别
  }

  state = {
    mapView: {}, // 地图对象
    mapApi: {}, // 地图api对象
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
      url: 'http://www.zjmap88.site/arcgis_js_api/library/4.7/init.js'
    }
    esriLoader
      .loadModules([
        'esri/Map',
        'esri/Basemap',
        'esri/layers/TileLayer',
        'esri/views/MapView',
        'esri/views/SceneView',
        'esri/layers/GraphicsLayer',
        'esri/Graphic',
        'esri/geometry/Polygon',
        'dojo/domReady!'
      ], mapOption)
      .then(([map, Basemap, TileLayer, MapView, SceneView, GraphicsLayer, Graphic, Polygon, SimpleLineSymbol, SpatialReference]) => {
        // 蓝色系图层
        const blueLayer = new TileLayer({
          url: 'http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer',
          id: 'blue',
          visible: true
        })

        // 实例化底图对象
        const baseMap = new Basemap({
          baseLayers: [blueLayer]
        })
        // 实例化地图对象
        const mapControl = new map({
          basemap: baseMap
        })
        // 实例化view
        // 2D
        // const view2D = new MapView({
        //   center: [108.2, 32.1],
        //   map: map,
        //   container: 'mapContent',
        //   zoom: 5
        // })
        // 3D
        const mapView = new MapView({
          center: this.initCenter,
          map: mapControl,
          container: 'mapContent',
          zoom: this.initZoom
        })
        const mapApi = {
          GraphicsLayer,
          Graphic,
          Polygon
        }
        this.setState({
          mapView,
          mapApi
        })
      })
  }

  /**
   * 读取代码
   */
  readCodes = () => {
    axios.get(demoCodes).then(res => {
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
    const { codes, mapView, mapApi } = this.state
    return (
      <div className="page-content">
        <CodeSource codes={codes} />
        <div id="mapContent" className="map-content" style={mapStyle}></div>
        <CodeBtn />
        <Toolbar mapView={mapView} mapApi={mapApi} />
      </div>
    )
  }
}
