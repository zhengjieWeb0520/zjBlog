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
    TextSymbol,
    ClusterLayer,
    Color
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
      remove: () => removeLayer('clusterLayer')
    }
    excuteMethods[type]()
  }
  /**
   * 添加图层
   */
  const addLayer = () => {
    const displayLayer = mapView.map.findLayerById('clusterLayer')
    if (displayLayer) {
      removeLayer('clusterLayer')
    } else {
      axios.get('./data/vector/clusterData.json')
        .then((res) => {
          const clusterData = res.data.data
          addClusterLayer(displayLayer, clusterData, 'clusterLayer', 55, 'lon', 'lat', 'value', [0, 0, 0, 0.8], 10)
        })
    }
  }

  /**
   * 分蔟图层
   * @param { Object } displayLayer 图层
   * @param { Array } data 数据
   * @param { String } layerName 图层ID
   * @param { Number } clusterRatio 分簇半径
   * @param { String } lon 经纬度健值
   * @param { String } lat 经纬度健值
   * @param { String } value value值健值
   * @param { Array } colorArray 颜色数组
   * @param { Number } fontSize  标注大小
   */
  const addClusterLayer = (displayLayer, data, layerName = '', clusterRatio = 45, lon = 'lon', lat = 'lat', value = 'value', colorArray = [0, 0, 0, 0.8], fontSize = 10) => {
    const maxSingleFlareCount = 8
    const textSymbol = new TextSymbol({
      color: new Color(colorArray),
      font: {
        size: fontSize,
        family: 'arial'
      },
      yoffset: -3 // setting yoffset as vertical alignment doesn't work in IE/Edge
    })
    const options = {
      id: layerName,
      spatialReference: { wkid: 4326 },
      subTypeFlareProperty: 'facilityType',
      singleFlareTooltipProperty: 'name',
      displaySubTypeFlares: true,
      maxSingleFlareCount: maxSingleFlareCount,
      clusterRatio,
      xPropertyName: lon,
      yPropertyName: lat,
      valuePropertyName: value,
      textSymbol: textSymbol,
      data: data
    }
    displayLayer = new ClusterLayer.FlareClusterLayer(options)
    mapView.map.add(displayLayer)
  }
  /**
   * 显示隐藏图层
   */
  const showHideLayer = () => {
    const displayLayer = mapView.map.findLayerById('clusterLayer')
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
    this.initCenter = [120, 33] // 初始化中心经纬度
    this.initZoom = 8 // 初始化缩放级别
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
      url: 'http://www.zjmap88.site/arcgis_js_api/library/4.7/init.js'
    }
    esriLoader
      .loadModules([
        'esri/Map',
        'esri/Basemap',
        'esri/layers/TileLayer',
        'esri/views/MapView',
        'esri/views/SceneView',
        'esri/symbols/TextSymbol',
        'widgets/ClusterLayer_v4',
        'esri/Color',
        'dojo/domReady!'
      ], mapOption)
      .then(([map, Basemap, TileLayer, MapView, SceneView, TextSymbol, ClusterLayer, Color]) => {
        // 蓝色系图层
        const blueLayer = new TileLayer({
          url: 'http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetWarm/MapServer',
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
          TextSymbol,
          ClusterLayer,
          Color
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