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
  Extent,
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
    origin: { x: 21643124, y: 5181589 },
    spatialReference: { wkid: 21421 },
    lods: [
      { level: 0, scale: 50000, resolution: 21.1666666666667 },
      { level: 1, scale: 20000, resolution: 7.9375 },
      { level: 2, scale: 15000, resolution: 3.968754 },
      { level: 3, scale: 7000, resolution: 2.11666666666667 },
      { level: 4, scale: 5000, resolution: 1.05833333333333 }
    ]
  }
  const fullExtent = new Extent({
    xmin: 21643124,
    ymin: 5167000,
    xmax: 21664773,
    ymax: 5181589,
    spatialReference: {
      wkid: 21421
    }
  })
  // 实例化影像图层
  const baseLayer = new WebTileLayer(layersUrl, {
    id: mapType + '_basemap_satelliteMap',
    title: 'satellite',
    tileInfo,
    fullExtent,
    spatialReference: new SpatialReference({ wkid: 21421 }),
    visible: true
  })

  const baseMapLayer = [
    baseLayer
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
  console.warn(mapControl)
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
      url: 'https://js.arcgis.com/4.14/'
    }
    esriLoader
      .loadModules(
        [
          'esri/views/SceneView',
          'esri/views/MapView',
          'esri/layers/WebTileLayer',
          'esri/Basemap',
          'esri/Map',
          'esri/geometry/SpatialReference',
          'esri/geometry/Extent',
          'esri/Color',
          'esri/config',
          'esri/request'
        ],
        mapOption
      )
      .then(([
        SceneView,
        MapView,
        WebTileLayer,
        Basemap,
        map,
        SpatialReference,
        Extent,
        Color,
        esriConfig,
        esriRequest
      ]) => {
        const tkKey = '4aef299f1178a8329a9cdc325a055b85'
        const mapControl = initBaseLayer(
          'tdt',
          ['http://111.40.89.154:8001'],
          'http://111.40.89.154:8001/Cache.aspx?Layer=gis1&image=0&l={level}&r={row}&c={col}',
          WebTileLayer,
          Basemap,
          map,
          SpatialReference,
          Extent,
          Color,
          esriConfig,
          esriRequest
        )
        const extent = new Extent({
          xmin: 21643124,
          ymin: 5167000,
          xmax: 21664773,
          ymax: 5181589,
          spatialReference: {
            wkid: 21421
          }
        })
        const mapView = new MapView({
          id: '2D',
          map: mapControl,
          container: 'mapContent'
          // center: [21643424, 5167600],
          // extent
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
