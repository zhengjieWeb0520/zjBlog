import React, { Component } from 'react'
import esriLoader from 'esri-loader'
import { Menu, Dropdown, Icon, Button } from 'antd'
import axios from 'axios'
import CodeBtn from '../../../template/codeBtn'
import CodeSource from '../../../template/codeSource'
import demoCodes from './code/codes.md'

/* 工具栏 */
function Toolbar (props) {
  // 底图数组属性
  const { mapView, popup, messureDraw } = props
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
  const measureClick = ({ key }) => {
    esriLoader
      .loadModules([
        'esri/toolbars/draw',
        'esri/symbols/SimpleLineSymbol',
        'esri/graphic',
        'esri/tasks/GeometryService',
        'esri/tasks/LengthsParameters',
        'esri/tasks/AreasAndLengthsParameters',
        'esri/SpatialReference',
        'esri/geometry/Point',
        'esri/Color',
        'esri/geometry/webMercatorUtils'
      ])
      .then(([
        Draw,
        SimpleLineSymbol,
        Graphic,
        GeometryService,
        LengthsParameters,
        AreasAndLengthsParameters,
        SpatialReference,
        Point,
        Color,
        WebMercatorUtils
      ]) => {
        // 测量绘制图层
        const measureGraphicsLayer = mapView.getLayer('measureGraphicsLayer')
        // 清除绘制图层
        measureGraphicsLayer.clear()
        // 弹框隐藏
        popup.hide()
        // 判断测量类型
        switch (key) {
          case 'length':
            messureDraw.activate(Draw.POLYLINE)
            break
          case 'area':
            messureDraw.activate(Draw.POLYGON)
            break
          case 'clear':
            messureDraw.deactivate()
            break
          default:
            return
        }

        let measuregeometry
        // 绘制结束事件
        messureDraw.on('draw-end', (res) => {
          const geometry = res.geometry
          mapView.enableMapNavigation()
          drawMeatureGraphic(geometry)
        })

        // 绘制测量的图形
        function drawMeatureGraphic (geometry) {
          measureGraphicsLayer.clear()
          let symbol
          switch (geometry.type) {
            case 'polyline':
              symbol = new SimpleLineSymbol(
                SimpleLineSymbol.STYLE_SOLID,
                new Color([8, 105, 250]),
                2
              )
              break
            case 'polygon':
              symbol = new SimpleLineSymbol(
                SimpleLineSymbol.STYLE_SOLID,
                new Color([8, 105, 250]),
                2
              )
              break
            default:
              break
          }

          const graphic = new Graphic(geometry, symbol)
          measureGraphicsLayer.add(graphic)
          excuteMeasure(geometry)
        }

        // 执行图形计算
        function excuteMeasure (geometry) {
          const isMercator = geometry.spatialReference.isWebMercator()
          geometry = isMercator ? WebMercatorUtils.webMercatorToGeographic(geometry) : geometry
          measuregeometry = geometry
          const geometryService = new GeometryService('http://localhost:6080/arcgis/rest/services/Utilities/Geometry/GeometryServer')
          if (geometry.type === 'polyline') {
            // 距离测量
            const lengthParams = new LengthsParameters()
            lengthParams.polylines = [geometry]
            lengthParams.lengthUnit = GeometryService.UNIT_METER
            // lengthParams.geodesic = true;
            lengthParams.calculationType = 'preserveShape'
            geometryService.lengths(lengthParams)
            lengthParams.polylines[0].spatialReference = new SpatialReference(4326)
            geometryService.lengths(lengthParams)
            geometryService.on('lengths-complete', outputDistance)
          } else if (geometry.type === 'polygon') {
            // 面积测量
            const areasAndLengthParams = new AreasAndLengthsParameters()
            areasAndLengthParams.lengthUnit = GeometryService.UNIT_METER
            areasAndLengthParams.areaUnit = GeometryService.UNIT_SQUARE_METERS
            const outSR = new SpatialReference({ wkid: 4326 })
            geometryService.project([geometry], outSR, function (geometry) {
              geometryService.simplify(geometry, function (simplifiedGeometries) {
                areasAndLengthParams.polygons = simplifiedGeometries
                areasAndLengthParams.polygons[0].spatialReference = new SpatialReference(4326)
                geometryService.areasAndLengths(areasAndLengthParams)
              })
            })
            geometryService.on('areas-and-lengths-complete', outputAreaAndLength)
          }
        }

        // 距离测量结果
        function outputDistance (res) {
          if (parseInt(String(res.result.lengths[0])) !== 0) {
            let length = Number(res.result.lengths[0])
            length = length > 1000 ? (length / 1000).toFixed(2) + ' 千米' : length.toFixed(2) + ' 米'
            const curX = measuregeometry.paths[0][measuregeometry.paths[0].length - 1][0]
            const curY = measuregeometry.paths[0][measuregeometry.paths[0].length - 1][1]
            const curPos = new Point(
              curX,
              curY,
              new SpatialReference({ wkid: 4326 })
            )
            popup.setTitle('距离测量')
            popup.setContent(
              ' 测 量 长 度 ： ' + length
            )
            popup.show(curPos)
          }
        }

        // 面积测量结果
        function outputAreaAndLength (res) {
          let area = Number(res.result.areas[0])
          let length = Number(res.result.lengths[0])
          area = area > 1000000 ? (area / 1000000).toFixed(2) + ' 平方千米' : area.toFixed(2) + ' 平方米'
          length = length > 1000 ? (length / 1000).toFixed(2) + ' 千米' : length.toFixed(2) + ' 米'
          const pointXY = measuregeometry.rings[0][0]
          const curPos = new Point(
            pointXY[0],
            pointXY[1],
            new SpatialReference({ wkid: 4326 })
          )
          popup.setTitle('面积测量')
          const content = `面积: ${area}</br>
            周长： ${length}
          `
          popup.setContent(content)
          popup.show(curPos)
        }
      })
  }
  const measure = (
    <Menu onClick={measureClick} className="layerClass">
      <Menu.Item key="length">测量距离</Menu.Item>
      <Menu.Item key="area">测量面积</Menu.Item>
      <Menu.Item key="clear">清除</Menu.Item>
    </Menu>
  )
  return (
    <div className="toolbar" style={toolbarStyle}>
      <Dropdown overlay={measure} trigger={['click']}>
        <span>
          <Button>测量工具</Button>
          <Icon type="down" />
        </span>
      </Dropdown>
    </div>
  )
}

/* 加载底图 */
export default class InitMap extends Component {
  constructor (props) {
    super(props)
    this.allBaseLayer = [] // 底图数组
    this.initCenter = [119, 34] // 初始化中心经纬度
    this.initZoom = 4 // 初始化缩放级别
    this.popup = null
    this.measureGraphicsLayer = null
    this.messureDraw = null
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
        <Toolbar mapView={mapView} popup={this.popup} messureDraw={this.messureDraw} />
      </div>
    )
  }
}
