```jsx
import React, { Component } from 'react'
import esriLoader from 'esri-loader'
import { Button } from 'antd'

/* 工具栏 */
function Toolbar (props) {
  const [layerState, setLayerState] = useState('隐藏图层')
  // 底图数组属性
  const { mapView, mapApi } = props

  const {
    MapImageLayer,
    IdentifyTask,
    IdentifyParameters,
    webMercatorUtils
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
      remove: () => removeLayer('mapImageLayer')
    }
    excuteMethods[type]()
  }
  /**
   * 添加图层
   */
  const addLayer = () => {
    const url = 'http://localhost:6080/arcgis/rest/services/zjBlog/jsBorder/MapServer'
    let displayLayer = mapView.map.findLayerById('mapImageLayer')
    if (displayLayer) {
      removeLayer('mapImageLayer')
    } else {
      displayLayer = new MapImageLayer({
        id: 'mapImageLayer',
        url,
        sublayers: [
          {
            id: 2,
            visible: false
          },
          {
            id: 1,
            visible: true
            // definitionExpression: 'Name = \'南京市\' or Name = \'扬州市\' or Name = \'苏州市\''
          },
          {
            id: 0,
            visible: true
          }
        ]
      })
    }

    // 获取ID为1的图层
    const citiesLayer = displayLayer.findSublayerById(1)
    citiesLayer.definitionExpression = 'Name = \'南京市\' or Name = \'扬州市\' or Name = \'苏州市\''

    // 获取索引为0的图层
    const provinceLayer = displayLayer.sublayers.getItemAt(0)
    provinceLayer.visible = true
    mapView.map.add(displayLayer)

    // 图层添加点击事件
    executeDynamicIdentify(url, IdentifyTask, IdentifyParameters, webMercatorUtils)
  }

  const executeDynamicIdentify = (url, IdentifyTask, IdentifyParameters, webMercatorUtils) => {
    const identifyTask = new IdentifyTask(url)
    const params = new IdentifyParameters()
    // 视图点击
    mapView.on('click', (evt) => {
      console.warn(evt)
      let mapPoint = evt.mapPoint
      let mapExtent = mapView.extent
      if (mapPoint.spatialReference.isWebMercator) {
        mapPoint = webMercatorUtils.webMercatorToGeographic(mapPoint)
        mapExtent = webMercatorUtils.webMercatorToGeographic(mapExtent)
      }
      // 点击的点位
      params.geometry = mapPoint
      // 地图范围
      params.mapExtent = mapExtent
      // 缓冲区范围
      params.tolerance = 5
      // 点击查询的图层id
      params.layerIds = ['1']
      // 图层的属性
      params.layerOption = 'visible' // "top"|"visible"|"all"
      // 是否返回字段
      params.returnFieldName = true
      // 是否返回图形
      params.returnGeometry = true
      // 执行点击
      identifyTask.execute(params)
        .then((res) => {
          const { Name, ID, Pname } = res.results[res.results.length - 1].feature.attributes
          mapView.popup.open({
            title: Name,
            location: evt.mapPoint,
            content: `省：${Pname}<br/>市：${Name}<br/>编码：${ID}`
          })
        })
    })
  }
  /**
   * 显示隐藏图层
   */
  const showHideLayer = () => {
    const displayLayer = mapView.map.findLayerById('mapImageLayer')
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
}

  state = {
    mapView: {}, // 地图对象
    mapApi: {}, // 地图api对象
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
      url: 'https://js.arcgis.com/4.14'
    }
    esriLoader
      .loadModules([
        'esri/Map',
        'esri/Basemap',
        'esri/layers/TileLayer',
        'esri/views/MapView',
        'esri/views/SceneView',
        'esri/layers/MapImageLayer',
        'esri/tasks/IdentifyTask',
        'esri/tasks/support/IdentifyParameters',
        'esri/geometry/support/webMercatorUtils',
        'dojo/domReady!'
      ], mapOption)
      .then(([map, Basemap, TileLayer, MapView, SceneView, MapImageLayer, IdentifyTask, IdentifyParameters, webMercatorUtils]) => {
        // 蓝色系图层
        const blueLayer = new TileLayer({
          url: 'http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetWarm/MapServer',
          id: 'warm',
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
        const mapView = new SceneView({
          center: this.initCenter,
          map: mapControl,
          container: 'mapContent',
          zoom: this.initZoom
        })
        const mapApi = {
          MapImageLayer,
          IdentifyTask,
          IdentifyParameters,
          webMercatorUtils
        }
        this.setState({
          mapView,
          mapApi
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
        <Toolbar mapView={mapView} mapApi={mapApi} />
      </div>
    )
  }
}
```