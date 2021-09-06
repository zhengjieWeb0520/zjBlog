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
    Point,
    SpatialReference
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
      remove: () => removeLayer('pointLayer')
    }
    excuteMethods[type]()
  }
  /**
   * 添加图层
   */
  const addLayer = () => {
    var new2 = function (func) {
      var o = Object.create(func.prototype)
      var k = func.call(o)
      if (typeof k === 'object') {
        return k
      } else {
        return o
      }
    }
    // 判断图层是否已存在
    let displayLayer = mapView.map.findLayerById('pointLayer')
    if (displayLayer) {
      removeLayer('pointLayer')
    } else {
      displayLayer = new GraphicsLayer({
        id: 'pointLayer'
      })
    }
    // 添加图层
    mapView.map.add(displayLayer)
    axios.get('./data/vector/points.json').then((res) => {
      const { data } = res
      const spatialReference = new SpatialReference({ wkid: 4326 })
      // symbol样式
      const symbol = {
        type: 'simple-marker',
        style: 'square',
        color: 'red',
        size: '10px',
        outline: {
          color: 'blue',
          width: 1
        }
      }
      data.forEach(item => {
        // 实例化点位
        const point = new Point({
          longitude: item.lnglat[0],
          latitude: item.lnglat[1],
          spatialReference: spatialReference
        })

        // 定义属性
        const pointAttr = {
          longitude: item.lnglat[0],
          latitude: item.lnglat[1],
          name: item.name
        }

        // 实例化图形
        const graphic = new Graphic({
          geometry: point,
          symbol: symbol,
          attributes: pointAttr,
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
                  fieldName: 'longitude',
                  label: '经度'
                },
                {
                  fieldName: 'latitude',
                  label: '纬度'
                }
              ]
            }]
          }
        })

        displayLayer.add(graphic)
      })
    })
  }

  /**
   * 显示隐藏图层
   */
  const showHideLayer = () => {
    const displayLayer = mapView.map.findLayerById('pointLayer')
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
      url: 'https://js.arcgis.com/4.14'
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
        'esri/geometry/Point',
        'esri/geometry/SpatialReference',
        'dojo/domReady!'
      ], mapOption)
      .then(([map, Basemap, TileLayer, MapView, SceneView, GraphicsLayer, Graphic, Point, SpatialReference]) => {
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
        const mapView = new SceneView({
          center: this.initCenter,
          map: mapControl,
          container: 'mapContent',
          zoom: this.initZoom
        })
        const mapApi = {
          GraphicsLayer,
          Graphic,
          Point,
          SpatialReference
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
