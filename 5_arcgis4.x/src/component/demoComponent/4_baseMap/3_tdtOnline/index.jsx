import React, { useState, Component } from 'react'
import esriLoader from 'esri-loader'
import { Select } from 'antd'
import axios from 'axios'
import CodeBtn from '../../../template/codeBtn'
import CodeSource from '../../../template/codeSource'
import demoCodes from './code/codes.md'

const Option = Select.Option

/* 工具栏 */
function Toolbar (props) {
  // 底图数组属性
  const { mapView } = props
  const [mapType, setMapType] = useState('tdt_basemap_satelliteMap')
  const toolbarStyle = {
    position: 'absolute',
    right: '1rem',
    top: '0.2rem',
    zIndex: 999
  }
  /**
   * 底图切换
   * @param {*} key
   */
  const handleChange = (key) => {
    console.warn(key)
    const baseLayers = mapView.map.basemap.baseLayers.items
    // 全部图层隐藏
    baseLayers.forEach(item => {
      item.visible = false
    })
    // 图层显示
    const visibleLayer = baseLayers.filter(item => item.id === key)
    visibleLayer[0].visible = true

    // 显示标注
    const anooMarkerId = key.split('_')[0] + '_' + key.split('_')[1] + '_anooMarkerMap'
    const labelLayer = baseLayers.filter(item => item.id === anooMarkerId)
    labelLayer[0].visible = true
    setMapType(key)
  }
  return (
    <div className="toolbar" style={toolbarStyle}>
      <Select
        style={{ width: '0.8rem' }}
        value={mapType}
        onChange={handleChange}
      >
        <Option key="tdt_basemap_digitalMap" value="tdt_basemap_digitalMap">
          电子地图
        </Option>
        <Option key="tdt_basemap_satelliteMap" value="tdt_basemap_satelliteMap">
          影像图
        </Option>
      </Select>
    </div>
  )
}
const initBaseLayer = (
  mapType,
  corUrl,
  layersUrl,
  WebTileLayer,
  Basemap,
  map,
  SpatialReference,
  Color,
  esriConfig,
  esriRequest
) => {
  // 设置配置跨域地址
  corUrl.forEach(item => {
    esriConfig.request.corsEnabledServers.push(item)
  })
  const tileInfo = {
    rows: 256,
    cols: 256,
    compressionQuality: 0,
    origin: { x: -20037508.342787, y: 20037508.342787 },
    spatialReference: { wkid: 102100 },
    lods: [
      {
        level: 3,
        scale: 73957190.948944,
        resolution: 19567.8792409999
      },
      {
        level: 4,
        scale: 36978595.474472,
        resolution: 9783.93962049996
      },
      {
        level: 5,
        scale: 18489297.737236,
        resolution: 4891.96981024998
      },
      { level: 6, scale: 9244648.868618, resolution: 2445.98490512499 },
      { level: 7, scale: 4622324.434309, resolution: 1222.99245256249 },
      { level: 8, scale: 2311162.217155, resolution: 611.49622628138 },
      { level: 9, scale: 1155581.108577, resolution: 305.748113140558 },
      { level: 10, scale: 577790.554289, resolution: 152.874056570411 },
      { level: 11, scale: 288895.277144, resolution: 76.4370282850732 },
      { level: 12, scale: 144447.638572, resolution: 38.2185141425366 },
      { level: 13, scale: 72223.819286, resolution: 19.1092570712683 },
      { level: 14, scale: 36111.909643, resolution: 9.55462853563415 },
      { level: 15, scale: 18055.954822, resolution: 4.77731426794937 },
      { level: 16, scale: 9027.977411, resolution: 2.38865713397468 },
      { level: 17, scale: 4513.988705, resolution: 1.19432856685505 },
      { level: 18, scale: 2256.994353, resolution: 0.597164283559817 },
      { level: 19, scale: 1128.497176, resolution: 0.298582141647617 }
    ]
  }
  // 实例化影像图层
  const satelliteLayer = new WebTileLayer(layersUrl.satelliteUrl, {
    id: mapType + '_basemap_satelliteMap',
    title: 'satellite',
    subDomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6'],
    tileInfo,
    spatialReference: new SpatialReference({ wkid: 102100 }),
    visible: true
  })
  // 实例化标注图层
  const anooMarkerLayer = new WebTileLayer(layersUrl.anooMarkerUrl, {
    id: mapType + '_basemap_anooMarkerMap',
    title: 'anooMarker',
    subDomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6'],
    tileInfo,
    spatialReference: new SpatialReference({ wkid: 102100 }),
    visible: true
  })
  // 实例化地图图层
  const digitalTileLayer = new WebTileLayer(layersUrl.digitalUrl, {
    id: mapType + '_basemap_digitalMap',
    title: 'digital',
    subDomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6'],
    tileInfo,
    spatialReference: new SpatialReference({ wkid: 102100 }),
    visible: false
  })

  const baseMapLayer = [
    digitalTileLayer,
    satelliteLayer,
    anooMarkerLayer
  ]

  // 实例化Basemap对象
  const baseMap = new Basemap({
    baseLayers: baseMapLayer
  })
  console.warn(baseMapLayer)
  // 实例化Map对象
  const mapControl = new map({
    basemap: baseMap
  })
  return mapControl
}
/* 加载底图 */
export default class InitMap extends Component {
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
      url: 'http://www.zjmap88.site/arcgis_js_api/library/4.7/init.js'
    }
    esriLoader
      .loadModules(
        [
          'esri/views/SceneView',
          'esri/layers/WebTileLayer',
          'esri/Basemap',
          'esri/Map',
          'esri/geometry/SpatialReference',
          'esri/Color',
          'esri/config',
          'esri/request'
        ],
        mapOption
      )
      .then(([
        SceneView,
        WebTileLayer,
        Basemap,
        map,
        SpatialReference,
        Color,
        esriConfig,
        esriRequest
      ]) => {
        const tkKey = '4aef299f1178a8329a9cdc325a055b85'
        const mapControl = initBaseLayer(
          'tdt',
          ['http://t0.tianditu.com', 'http://t1.tianditu.com', 'http://t2.tianditu.com', 'http://t3.tianditu.com', 'http://t4.tianditu.com', 'http://t5.tianditu.com', 'http://t5.tianditu.com'],
          {
            satelliteUrl: 'http://{subDomain}.tianditu.com/DataServer?T=img_w&tk=' + tkKey + '&x={col}&y={row}&l={level}',
            digitalUrl: 'http://{subDomain}.tianditu.com/DataServer?T=vec_w&tk=' + tkKey + '&x={col}&y={row}&l={level}',
            anooMarkerUrl: 'http://{subDomain}.tianditu.com/DataServer?T=cva_w&tk=' + tkKey + '&x={col}&y={row}&l={level}'
          },
          WebTileLayer,
          Basemap,
          map,
          SpatialReference,
          Color,
          esriConfig,
          esriRequest
        )
        const mapView = new SceneView({
          id: '3D',
          map: mapControl,
          container: 'mapContent',
          center: [112, 32],
          zoom: 4
        })
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
