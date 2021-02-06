```jsx
import React, { Component } from 'react'
import esriLoader from 'esri-loader'
import { Button } from 'antd'

/* 工具栏 */
function Toolbar (props) {
  // 底图数组属性
  const { mapView, mapApi } = props
  const {
    Point,
    geometryEngine,
    webMercatorUtils
  } = mapApi

  /**
   * 点击操作
   * @param {*} type
   */
  const handleClick = (evt) => {
    const point1 = {
      x: 112.35,
      y: 32
    }
    const point2 = {
      x: 111.45,
      y: 32.5
    }

    // 实例化点位
    const geometryPoint1 = new Point({
      longitude: point1.x,
      latitude: point1.y,
      spatialReference: { wkid: 4326 }
    })
    const geometryPoint2 = new Point({
      longitude: point2.x,
      latitude: point2.y,
      spatialReference: { wkid: 4326 }
    })

    // 转为墨卡托投影
    const geometry1 = webMercatorUtils.geographicToWebMercator(geometryPoint1)
    const geometry2 = webMercatorUtils.geographicToWebMercator(geometryPoint2)

    // 计算亮点的距离
    const length = geometryEngine.distance(geometry1, geometry2)
    const distance = length > 1000 ? (length / 1000).toFixed(4) + '千米' : length.toFixed(4) + '米'
    mapView.popup.open({
      title: '距离测量',
      location: geometryPoint2,
      content: `两点距离为${distance}`
    })
  }

  const toolbarStyle = {
    position: 'absolute',
    right: '1rem',
    top: '0.2rem',
    zIndex: 999
  }
  return (
    <div className="toolbar" style={toolbarStyle}>
      <Button type="info" onClick={v => handleClick(v)}>计算距离</Button>
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
    this.Zoom = null // zoom对象
  }
}

  state = {
    mapView: {}, // 地图对象
    mapApi: {} // 地图api类
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
        'esri/geometry/Point',
        'esri/geometry/geometryEngine',
        'esri/geometry/support/webMercatorUtils',
        'dojo/domReady!'
      ], mapOption)
      .then(([map, Basemap, TileLayer, MapView, SceneView, Point, geometryEngine, webMercatorUtils]) => {
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
          Point,
          geometryEngine,
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