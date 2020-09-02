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
        'esri/layers/FeatureLayer',
        'esri/tasks/FeatureSet',
        'esri/renderers/HeatmapRenderer'
      ])
      .then(([
        FeatureLayer,
        FeatureSet,
        HeatmapRenderer
      ]) => {
        // const url = 'http://zj-fileserver.oss-cn-shanghai.aliyuncs.com/zjFileServer/datas/heatMapData.json'
        axios.get('/zjFileServer/datas/heatMapData.json')
          .then(res => {
            const { status, data } = res
            if (status === 200) {
              // 处理数据
              const heatMapPoints = []
              // 遍历数据赋值给热力图数据集合
              data.forEach((item) => {
                item.forEach((element) => {
                  const obj = {
                    lon: element.coord[0],
                    lat: element.coord[1],
                    value: element.elevation
                  }
                  heatMapPoints.push(obj)
                })
              })

              // 添加热力图
              const features = []
              const blurRadius = 4 // 缓冲区半径
              const maxPixelIntensity = 100 // 最大识别像素
              const minPixelIntensity = 0 // 最小识别像素
              const fieldName = 'VALUE' // 渲染的字段
              heatMapPoints.forEach((item, index) => {
                const attribute = {
                  FID: index.toString(),
                  LON: item.lon.toString(),
                  LAT: item.lat.toString(),
                  VALUE: item.value
                }
                const graphic = {
                  geometry: {
                    x: item.lon,
                    y: item.lat
                  },
                  attributes: attribute
                }
                features.push(graphic)
              })

              const fields = [
                {
                  name: 'FID',
                  type: 'esriFieldTypeOID',
                  alias: 'FID'
                },
                {
                  name: 'LON',
                  type: 'esriFieldTypeString',
                  alias: 'LON',
                  length: 100
                },
                {
                  name: 'LAT',
                  type: 'esriFieldTypeString',
                  alias: 'LAT',
                  length: 100
                },
                {
                  name: 'VALUE',
                  type: 'esriFieldTypeDouble',
                  alias: 'VALUE'
                }
              ]

              const option = {
                // 数据的基本属性
                displayFieldName: '',
                fieldAliases: {
                  FID: 'FID',
                  LON: 'LON',
                  LAT: 'LAT',
                  VALUE: 'VALUE'
                },
                geometryType: 'esriGeometryPoint',
                spatialReference: {
                  wkid: 4326,
                  latestWkid: 4326
                },
                // 所含有的字段信息
                fields: fields,
                // 所含有的集合要素集
                features: features
              }
              const featureSet = new FeatureSet(option)

              const layerDefinition = {
                geometryType: 'esriGeometryPoint',
                fields: fields
              }
              const featureCollection = {
                layerDefinition: layerDefinition,
                featureSet: featureSet
              }
              const heatmapFeatureLayerOptions = {
                id: 'gisHeatLayer',
                mode: FeatureLayer.MODE_SNAPSHOT,
                outFields: ['FID', 'VALUE']
                // infoTemplate: infoTemplate
              }

              const heatmapFeatureLayer = new FeatureLayer(featureCollection, heatmapFeatureLayerOptions)
              const heatmapRenderer = new HeatmapRenderer({
                field: fieldName,
                blurRadius: blurRadius,
                maxPixelIntensity: maxPixelIntensity,
                minPixelIntensity: minPixelIntensity
              })

              heatmapFeatureLayer.setRenderer(heatmapRenderer)
              mapView.addLayer(heatmapFeatureLayer)
            }
          })
      })
  }

  /**
   * 移除图片图层
   */
  const removeLayer = () => {
    const gisHeatLayer = mapView.getLayer('gisHeatLayer')
    if (gisHeatLayer) {
      mapView.removeLayer(gisHeatLayer) // 移除图层
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
    this.initCenter = [120.122849, 30.228594] // 初始化中心经纬度
    this.initZoom = 14 // 初始化缩放级别
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
          'esri/layers/googleLayer'
        ],
        mapOption
      )
      .then(([
        map,
        googleLayer
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
        const googleDigitalLayer = new googleLayer({
          id: 'google_st',
          layertype: 'st',
          visible: true
        })

        mapView.addLayer(googleDigitalLayer)
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
        <Toolbar mapView={mapView} />
      </div>
    )
  }
}
