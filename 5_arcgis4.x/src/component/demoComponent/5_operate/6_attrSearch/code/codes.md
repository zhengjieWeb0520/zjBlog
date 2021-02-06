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
    Polygon,
    GraphicsLayer,
    Graphic,
    QueryTask,
    Query
  } = mapApi

  /**
   * 点击操作
   * @param {*} type
   */
  const handleClick = (evt) => {
    const queryTask = new QueryTask({
      url: 'http://localhost:6080/arcgis/rest/services/zjBlog/jsBorder/MapServer/1'
    })
    const query = new Query()
    query.returnGeometry = true
    query.outFields = ['*']
    query.where = 'Name = \'南京市\' or Name = \'扬州市\' or Name = \'苏州市\''

    queryTask.execute(query).then(res => {
      const { features } = res
      if (features.length > 0) {
        let displayLayer = mapView.map.findLayerById('polygonLayer')
        if (displayLayer) {
          removeLayer('polygonLayer')
        } else {
          displayLayer = new GraphicsLayer({
            id: 'polygonLayer'
          })
        }
        mapView.map.add(displayLayer)

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

        features.forEach((item) => {
          const { attributes, geometry } = item
          // 实例化图形
          // 查询出来的geometry是没有高度信息，如果需要在三维中展示则需要处理rings
          if (mapView.type === '3d') {
            geometry.rings.forEach((ringsItem) => {
              ringsItem.forEach((ringsItemTwo) => {
                ringsItemTwo.push(0)
                ringsItemTwo.push(0)
              })
            })
          }
          geometry.hasZ = true
          geometry.hasM = true
          const graphic = new Graphic({
            geometry,
            symbol: symbol,
            attributes,
            popupTemplate: {
              title: '{name}',
              content: [{
                type: 'fields',
                fieldInfos: [
                  {
                    fieldName: 'Pname',
                    label: '省份'
                  },
                  {
                    fieldName: 'Name',
                    label: '市'
                  },
                  {
                    fieldName: 'ID',
                    label: '编码'
                  }
                ]
              }]
            }
          })
          displayLayer.add(graphic)
        })
      }
    })
    // mapView.popup.open({
    //   title: '距离测量',
    //   location: geometryPoint2,
    //   content: `两点距离为${distance}`
    // })
  }

  const toolbarStyle = {
    position: 'absolute',
    right: '1rem',
    top: '0.2rem',
    zIndex: 999
  }
  return (
    <div className="toolbar" style={toolbarStyle}>
      <Button type="info" onClick={v => handleClick(v)}>属性查询图层</Button>
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
      url: 'https://js.arcgis.com/4.14/'
    }
    esriLoader
      .loadModules([
        'esri/Map',
        'esri/Basemap',
        'esri/layers/TileLayer',
        'esri/views/MapView',
        'esri/views/SceneView',
        'esri/geometry/Point',
        'esri/geometry/Polygon',
        'esri/layers/GraphicsLayer',
        'esri/Graphic',
        'esri/tasks/QueryTask',
        'esri/tasks/support/Query',
        'dojo/domReady!'
      ], mapOption)
      .then(([map, Basemap, TileLayer, MapView, SceneView, Point, Polygon, GraphicsLayer, Graphic, QueryTask, Query]) => {
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
          Polygon,
          GraphicsLayer,
          Graphic,
          QueryTask,
          Query
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