import React, { Component } from 'react'
import esriLoader from 'esri-loader'
import { Button } from 'antd'
import axios from 'axios'
import CodeBtn from '../../../template/codeBtn'
import CodeSource from '../../../template/codeSource'
import demoCodes from './code/codes.md'

/* 热力图，次方法只适用于二维 */
/* 工具栏 */
function Toolbar (props) {
  // 底图数组属性
  const { mapView, mapApi } = props
  const {
    FeatureLayer,
    HeatmapRenderer
  } = mapApi
  /**
   * 添加图层
   * @param {*}
   */
  const addLayer = () => {
    const heatmapRenderer = new HeatmapRenderer({
      colorStops: [
        { ratio: 0.4, color: 'rgba(0, 255, 0, 0)' },
        { ratio: 0.75, color: 'rgba(255, 140, 0, 1)' },
        { ratio: 0.9, color: 'rgba(255, 0,   0, 1)' }
      ],
      blurRadius: 8,
      maxPixelIntensity: 230,
      minPixelIntensity: 0
    })
    // const url = 'http://zj-fileserver.oss-cn-shanghai.aliyuncs.com/zjFileServer/datas/heatMapData.json'
    axios.get('./data/vector/heatJson.json')
      .then(res => {
        const { status, data } = res
        if (status === 200) {
          // 处理数据
          const features = []
          // 遍历数据赋值给热力图数据集合
          data.heatData.forEach((item, index) => {
            const featureItem = {
              geometry: {
                type: 'point',
                x: Number(item.lng),
                y: Number(item.lat)
              },
              attributes: {
                ObjectID: index
              }
            }
            features.push(featureItem)
          })
          const featureLayer = new FeatureLayer({
            id: 'heatLayer',
            source: features,
            title: '热力图',
            objectIdField: 'ObjectID',
            renderer: heatmapRenderer
          })
          console.warn(featureLayer)
          mapView.map.add(featureLayer)
        }
      })
  }

  /**
   * 移除图片图层
   */
  const removeLayer = () => {
    const displayLayer = mapView.map.findLayerById('heatLayer')
    displayLayer && mapView.map.remove(displayLayer)
  }
  const toolbarStyle = {
    position: 'absolute',
    right: '1rem',
    top: '0.2rem',
    zIndex: 999
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
    this.initCenter = [120.122849, 28.228594] // 初始化中心经纬度
    this.initZoom = 8 // 初始化缩放级别
  }

  state = {
    mapView: {}, // 地图对象
    mapApi: {},
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
      url: 'https://js.arcgis.com/4.14/'
    }
    esriLoader
      .loadModules([
        'esri/Map',
        'esri/Basemap',
        'esri/layers/TileLayer',
        'esri/views/MapView',
        'esri/views/SceneView',
        'esri/layers/FeatureLayer',
        'esri/renderers/HeatmapRenderer',
        'dojo/domReady!'
      ], mapOption)
      .then(([map, Basemap, TileLayer, MapView, SceneView, FeatureLayer, HeatmapRenderer]) => {
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
        const mapView = new MapView({
          center: this.initCenter,
          map: mapControl,
          container: 'mapContent',
          zoom: this.initZoom
        })

        const mapApi = {
          FeatureLayer,
          HeatmapRenderer
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
