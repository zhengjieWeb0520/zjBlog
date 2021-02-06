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
    GeoJSONLayer
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
      remove: () => removeLayer('geoJsonLayer')
    }
    excuteMethods[type]()
  }
  /**
   * 添加图层
   */
  const addLayer = () => {
    let displayLayer = mapView.map.findLayerById('geoJsonLayer')
    if (displayLayer) {
      removeLayer('geoJsonLayer')
    } else {
      const url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson'
      const template = {
        title: 'Earthquake Info',
        content: 'Magnitude {mag} {type} hit {place} on {time}',
        fieldInfos: [
          {
            fieldName: 'time',
            format: {
              dateFormat: 'short-date-short-time'
            }
          }
        ]
      }
      const renderer = {
        type: 'simple',
        field: 'mag',
        symbol: {
          type: 'simple-marker',
          color: 'orange',
          outline: {
            color: 'white'
          }
        },
        visualVariables: [{
          type: 'size',
          field: 'mag',
          stops: [{
            value: 2.5,
            size: '4px'
          },
          {
            value: 8,
            size: '40px'
          }
          ]
        }]
      }
      displayLayer = GeoJSONLayer({
        id: 'geoJsonLayer',
        url: url,
        copyright: 'USGS Earthquakes',
        popupTemplate: template,
        renderer: renderer // optional
      })
    }
    mapView.map.add(displayLayer)
  }

  /**
   * 显示隐藏图层
   */
  const showHideLayer = () => {
    const displayLayer = mapView.map.findLayerById('geoJsonLayer')
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
    <div className='toolbar' style={toolbarStyle}>
      <Button type='info' onClick={v => handleClick(v, 'add')}>添加图层</Button>
      <Button type='info' onClick={v => handleClick(v, 'showHide')}>{layerState}</Button>
      <Button type='info' onClick={v => handleClick(v, 'remove')}>删除图层</Button>
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
      url: 'https://js.arcgis.com/4.14'
    }
    esriLoader
      .loadModules([
        'esri/Map',
        'esri/Basemap',
        'esri/layers/TileLayer',
        'esri/views/MapView',
        'esri/views/SceneView',
        'esri/layers/GeoJSONLayer',
        'dojo/domReady!'
      ], mapOption)
      .then(([map, Basemap, TileLayer, MapView, SceneView, GeoJSONLayer]) => {
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
          GeoJSONLayer
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