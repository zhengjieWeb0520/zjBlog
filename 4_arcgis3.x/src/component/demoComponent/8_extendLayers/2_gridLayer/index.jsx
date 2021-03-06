/* eslint-disable */
import React, { Component } from 'react'
import esriLoader from 'esri-loader'
import { Button } from 'antd'
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
        'esri/SpatialReference',
        'esri/layers/GraphicsLayer',
        'esri/graphic',
        'esri/geometry/Point',
        'esri/geometry/Extent',
        'esri/Color'
      ])
      .then(([
        SpatialReference,
        GraphicsLayer,
        Graphic,
        Point,
        Extent,
        Color
      ]) => {
        // 定义图层
        // const url = 'http://zj-fileserver.oss-cn-shanghai.aliyuncs.com/zjFileServer/datas/gridData.json'
        axios.get('/zjFileServer/datas/gridData.json')
          .then(res => {
            const { status, data } = res
            if (status === 200) {
              const step = 3 / 111 // 3代表3公里分辨率
              const latExtent = [34.587408, 40.746188] // 纬度范围
              const lonExtent = [110.211553, 114.563147] // 经度范围
              const cellCount = [
                Math.ceil((lonExtent[1] - lonExtent[0]) / step),
                Math.ceil((latExtent[1] - latExtent[0]) / step)
              ] // [0] 经度（列） [1] 纬度（行）

              // 绘制栅格点位
              const gridData = []
              for (let i = 0; i < cellCount[1]; i++) {
                // j 经度（列） i 纬度（行）
                for (let j = 0; j < cellCount[0]; j++) {
                  const lon = lonExtent[0] + (j + 1) * step - step / 2
                  const lat = latExtent[0] + (i + 1) * step - step / 2
                  gridData.push([lon, lat, 0])
                }
              }

              // 遍历数据给格点插入数据
              data.forEach(item => {
                const j = Math.floor((item.longitude - lonExtent[0]) / step) // 行
                const i = Math.floor((item.latitude - latExtent[0]) / step) // 列
                const index = i * cellCount[0] + j
                gridData[index][2] = gridData[index][2] + 1
              })

              const distance = step / 2
              // 定义格网图层
              const gridLayer = new GraphicsLayer({
                id: 'gridLayer'
              })

              // 定义标注图层
              const gridLabelLayer = new GraphicsLayer({
                id: 'gridLabelLayer',
                minScale: 200000
              })

              const spatialReference = new SpatialReference({ wkid: 4326 })
              mapView.addLayer(gridLayer)
              mapView.addLayer(gridLabelLayer)

              // 定义渲染颜色
              const allColor = [
                [250, 248, 79],
                [250, 231, 71],
                [251, 209, 60],
                [251, 192, 52],
                [252, 171, 43],
                [252, 162, 38],
                [253, 139, 28],
                [253, 129, 23],
                [253, 101, 9],
                [253, 85, 2],
                [255, 0, 0]
              ]
              function getColor (value) {
                let index = Math.floor(value / 3)
                index = index <= 10 ? index : 10
                return allColor[index]
              }

              gridData.forEach(item => {
                // value不为0值绘制
                if (item[2] !== 0) {
                  const maxx = Number(item[0] + distance)
                  const mimx = Number(item[0] - distance)
                  const maxy = Number(item[1] + distance)
                  const miny = Number(item[1] - distance)
                  const extent = new Extent(mimx, miny, maxx, maxy, spatialReference)
                  const textPoint = new Point({
                    x: Number(item[0]),
                    y: Number(item[1]),
                    spatialReference: spatialReference
                  })
                  // 获取格点颜色
                  const gridColor = getColor(item[2])
                  const gridSymbol = {
                    color: new Color(gridColor),
                    outline: {
                      color: new Color([202, 202, 202, 0.5]),
                      width: 0.5,
                      type: 'esriSLS',
                      style: 'esriSLSSolid'
                    },
                    type: 'esriSFS',
                    style: 'esriSFSSolid'
                  }
                  const labelSymbol = {
                    color: [183, 183, 183, 255],
                    font: { size: 15, style: 'normal', weight: 'bold', family: 'serif' },
                    horizontalAlignment: 'center',
                    kerning: true,
                    rotated: false,
                    text: item[2],
                    type: 'esriTS',
                    yoffset: -5
                  }
                  const gridGraphic = new Graphic({
                    geometry: extent,
                    symbol: gridSymbol
                  })
                  const textGraphic = new Graphic({
                    geometry: textPoint,
                    symbol: labelSymbol
                  })
                  gridLayer.add(gridGraphic)
                  gridLabelLayer.add(textGraphic)
                }
              })
            }
          })
      })
  }

  /**
   * 移除图片图层
   */
  const removeLayer = () => {
    const gridLayer = mapView.getLayer('gridLayer')
    const gridLabelLayer = mapView.getLayer('gridLabelLayer')
    if (gridLayer) {
      gridLayer.clear() // 清除栅格图形
      gridLabelLayer.clear() // 清除标注图形
      mapView.removeLayer(gridLayer) // 移除栅格图层
      mapView.removeLayer(gridLabelLayer) // 移除标注图层
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
    this.initCenter = [112, 37] // 初始化中心经纬度
    this.initZoom = 7 // 初始化缩放级别
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
