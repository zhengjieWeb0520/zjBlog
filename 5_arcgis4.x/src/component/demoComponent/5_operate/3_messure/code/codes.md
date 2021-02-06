```jsx
import React, { Component, useEffect } from 'react'
import esriLoader from 'esri-loader'
import { Button } from 'antd'

/* 工具栏 */
function Toolbar (props) {
  // 底图数组属性
  const { mapView, mapApi } = props
  let messureMethod = '' //  测量方法
  let inputPt = [] // 测量点
  let totalDistance = 0 // 总距离
  let totalLenGraphic = null // 距离测量结果图形
  const geometryUrl = 'http://localhost:6080/arcgis/rest/services/Utilities/Geometry/GeometryServer'
  const {
    GeometryService,
    SketchViewModel,
    SimpleMarkerSymbol,
    GraphicsLayer,
    TextSymbol,
    Graphic,
    Font,
    Point,
    Polyline,
    LengthsParameters,
    AreasAndLengthsParameters
  } = mapApi
  const toolbarStyle = {
    position: 'absolute',
    right: '1rem',
    top: '0.2rem',
    zIndex: 999
  }

  // 添加测量图层
  const measureLayer = new GraphicsLayer({ id: 'measureLayer' })
  mapView.map.add(measureLayer)

  // 测量对象
  const sketch = new SketchViewModel({
    layer: measureLayer,
    view: mapView
  })

  // 默认字体
  const defaultFont = new Font({
    size: '12px',
    weight: 'bold'
  })

  // 默认点图形
  const defaultMarkSymbol = new SimpleMarkerSymbol({
    style: 'circle',
    color: 'red',
    size: '7px',
    outline: {
      color: [255, 0, 0],
      width: 1
    }
  })

  useEffect(() => {
    sketch.on('create', (evt) => {
      const excute = {
        measureLength: () => handleLengthMeasure(evt),
        measureArea: () => handleAreaMeasure(evt),
        clear: () => handleClear()
      }
      excute[messureMethod]()
    })
  }, [])
  /**
   * 点击操作
   * @param {*} type
   */
  const handleClick = async (evt, type) => {
    inputPt = []
    totalDistance = 0
    totalLenGraphic = null
    measureLayer.removeAll()
    if (type === 'clear') {
      return
    }
    messureMethod = type
    if (type === 'measureLength') {
      sketch.create('polyline', { mode: 'click' })
    } else if (type === 'measureArea') {
      sketch.create('polygon', { mode: 'click' })
    }
  }
  /**
   * 测量距离
   * @param {*} evt
   */
  const handleLengthMeasure = (evt) => {
    if (evt.toolEventInfo && evt.toolEventInfo.type === 'vertex-add') {
      var pt = {
        type: 'point',
        x: evt.toolEventInfo.added[0],
        y: evt.toolEventInfo.added[1],
        spatialReference: mapView.spatialReference
      }
      handleLengthPt(pt)
    }
  }
  /**
   * 测量距离结果
   * @param {*} pt
   */
  const handleLengthPt = (pt) => {
    inputPt.push(pt)
    let textSymbol
    if (inputPt.length === 1) {
      textSymbol = new TextSymbol({
        text: '起点',
        font: defaultFont,
        color: [255, 0, 0],
        xoffset: 0,
        yoffset: -20
      })
      measureLayer.add(new Graphic({ geometry: pt, symbol: textSymbol }))
    }
    measureLayer.add(new Graphic({ geometry: pt, symbol: defaultMarkSymbol }))

    if (inputPt.length >= 2) {
      const params = new LengthsParameters()
      const geoservice = new GeometryService(geometryUrl)
      params.distanceUnit = GeometryService.UNIT_METER
      params.calculationType = 'preserveShape'
      const p1 = inputPt[inputPt.length - 2]
      const p2 = inputPt[inputPt.length - 1]
      const polyline = new Polyline({ spatialReference: mapView.spatialReference })
      polyline.addPath([[p1.x, p1.y], [p2.x, p2.y]])
      params.polylines = [polyline]
      geoservice.lengths(params).then((distance) => {
        const dis = distance.lengths[0]
        totalDistance = totalDistance + dis
        const total = totalDistance > 1000 ? (totalDistance / 1000).toFixed(4) + '千米' : totalDistance.toFixed(4) + '米'
        if (totalLenGraphic) {
          measureLayer.remove(totalLenGraphic)
        }
        const totalSymbol = new TextSymbol({
          text: total,
          font: defaultFont,
          color: [255, 0, 0],
          xoffset: 140,
          yoffset: 200
        })
        totalLenGraphic = new Graphic({ geometry: p2, symbol: totalSymbol })
        measureLayer.add(totalLenGraphic)
      })
    }
  }

  /**
   * 测量面积
   * @param {*} evt
   */
  const handleAreaMeasure = (evt) => {
    if (evt.state === 'complete') {
      const geometry = evt.graphic.geometry
      const params = new AreasAndLengthsParameters()
      const geoservice = new GeometryService(geometryUrl)
      params.lengthUnit = GeometryService.UNIT_METER
      params.areaUnit = GeometryService.UNIT_SQUARE_METERS
      params.calculationType = 'preserveShape'
      geoservice.simplify([geometry]).then((simplifiedGeo) => {
        params.polygons = simplifiedGeo
        geoservice.areasAndLengths(params).then((res) => {
          const { areas } = res

          const font = new Font({
            size: '18px'
          })

          const areaSymbol = new TextSymbol({
            text: areas[0] > 1000000 ? (areas[0] / 1000000).toFixed(4) + '平方千米' : areas[0].toFixed(4) + '平方米',
            font: font,
            color: [255, 0, 0]
          })

          const pt = new Point({
            x: geometry.centroid.x,
            y: geometry.centroid.y,
            spatialReference: mapView.spatialReference
          })

          measureLayer.add(new Graphic({ geometry: pt, symbol: areaSymbol }))
        })
      })
    }
  }

  const handleClear = () => { }
  return (
    <div className="toolbar" style={toolbarStyle}>
      <Button type="info" onClick={v => handleClick(v, 'measureLength')}>测量距离</Button>
      <Button type="info" onClick={v => handleClick(v, 'measureArea')}>测量面积</Button>
      <Button type="info" onClick={v => handleClick(v, 'clear')}>清除</Button>
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
      url: 'https://js.arcgis.com/4.14/'
    }
    esriLoader
      .loadModules([
        'esri/Map',
        'esri/Basemap',
        'esri/layers/TileLayer',
        'esri/views/MapView',
        'esri/views/SceneView',
        'esri/tasks/GeometryService',
        'esri/widgets/Sketch/SketchViewModel',
        'esri/symbols/SimpleMarkerSymbol',
        'esri/layers/GraphicsLayer',
        'esri/symbols/TextSymbol',
        'esri/Graphic',
        'esri/symbols/Font',
        'esri/geometry/Point',
        'esri/geometry/Polyline',
        'esri/tasks/support/LengthsParameters',
        'esri/tasks/support/AreasAndLengthsParameters',
        'dojo/domReady!'
      ], mapOption)
      .then(([
        map,
        Basemap,
        TileLayer,
        MapView,
        SceneView,
        GeometryService,
        SketchViewModel,
        SimpleMarkerSymbol,
        GraphicsLayer,
        TextSymbol,
        Graphic,
        Font,
        Point,
        Polyline,
        LengthsParameters,
        AreasAndLengthsParameters
      ]) => {
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
        // 地图api对象
        const mapApi = {
          GeometryService,
          SketchViewModel,
          SimpleMarkerSymbol,
          GraphicsLayer,
          TextSymbol,
          Graphic,
          Font,
          Point,
          Polyline,
          LengthsParameters,
          AreasAndLengthsParameters
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
        { Object.keys(mapView).length !== 0 ? <Toolbar mapView={mapView} mapApi={mapApi} /> : null}
      </div>
    )
  }
}
```