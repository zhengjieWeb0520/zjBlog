```jsx
import React, { useState, Component } from 'react'
import esriLoader from 'esri-loader'
import { Select } from 'antd'

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
    dpi: 90.71428571427429,
    rows: 256,
    cols: 256,
    compressionQuality: 0,
    origin: { x: -180, y: 90 },
    spatialReference: { wkid: 4326 },
    lods: [
      { level: 2, levelValue: 2, resolution: 0.3515625, scale: 147748796.52937502 },
      { level: 3, levelValue: 3, resolution: 0.17578125, scale: 73874398.264687508 },
      { level: 4, levelValue: 4, resolution: 0.087890625, scale: 36937199.132343754 },
      { level: 5, levelValue: 5, resolution: 0.0439453125, scale: 18468599.566171877 },
      { level: 6, levelValue: 6, resolution: 0.02197265625, scale: 9234299.7830859385 },
      { level: 7, levelValue: 7, resolution: 0.010986328125, scale: 4617149.8915429693 },
      { level: 8, levelValue: 8, resolution: 0.0054931640625, scale: 2308574.9457714846 },
      { level: 9, levelValue: 9, resolution: 0.00274658203125, scale: 1154287.4728857423 },
      { level: 10, levelValue: 10, resolution: 0.001373291015625, scale: 577143.73644287116 },
      { level: 11, levelValue: 11, resolution: 0.0006866455078125, scale: 288571.86822143558 },
      { level: 12, levelValue: 12, resolution: 0.00034332275390625, scale: 144285.93411071779 },
      { level: 13, levelValue: 13, resolution: 0.000171661376953125, scale: 72142.967055358895 },
      { level: 14, levelValue: 14, resolution: 8.58306884765625e-005, scale: 36071.483527679447 },
      { level: 15, levelValue: 15, resolution: 4.291534423828125e-005, scale: 18035.741763839724 },
      { level: 16, levelValue: 16, resolution: 2.1457672119140625e-005, scale: 9017.8708819198619 },
      { level: 17, levelValue: 17, resolution: 1.0728836059570313e-005, scale: 4508.9354409599309 },
      { level: 18, levelValue: 18, resolution: 5.3644180297851563e-006, scale: 2254.4677204799655 },
      { level: 19, levelValue: 19, resolution: 2.68220901489257815e-006, scale: 1127.23386023998275 },
      { level: 20, levelValue: 2, resolution: 1.341104507446289075e-006, scale: 563.616930119991375 }
    ]
  }
  // 实例化影像图层
  const satelliteLayer = new WebTileLayer(layersUrl.satelliteUrl, {
    id: mapType + '_basemap_satelliteMap',
    title: 'satellite',
    subDomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6'],
    tileInfo,
    spatialReference: new SpatialReference({ wkid: 4326 }),
    visible: true
  })
  // 实例化标注图层
  const anooMarkerLayer = new WebTileLayer(layersUrl.anooMarkerUrl, {
    id: mapType + '_basemap_anooMarkerMap',
    title: 'anooMarker',
    subDomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6'],
    tileInfo,
    spatialReference: new SpatialReference({ wkid: 4326 }),
    visible: true
  })
  // 实例化地图图层
  const digitalTileLayer = new WebTileLayer(layersUrl.digitalUrl, {
    id: mapType + '_basemap_digitalMap',
    title: 'digital',
    subDomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6'],
    tileInfo,
    spatialReference: new SpatialReference({ wkid: 4326 }),
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
  // 实例化Map对象
  const mapControl = new map({
    basemap: baseMap,
    spatialReference: {
      wkid: 4326
    }
  })
  return mapControl
}

/* 加载底图 */
export default class InitMap extends Component {

  state = {
    mapView: {} // 地图对象
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
      .loadModules(
        [
          'esri/views/MapView',
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
        MapView,
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
            satelliteUrl: 'http://{subDomain}.tianditu.com/DataServer?T=img_c&tk=' + tkKey + '&x={col}&y={row}&l={level}',
            digitalUrl: 'http://{subDomain}.tianditu.com/DataServer?T=vec_c&tk=' + tkKey + '&x={col}&y={row}&l={level}',
            anooMarkerUrl: 'http://{subDomain}.tianditu.com/DataServer?T=cva_c&tk=' + tkKey + '&x={col}&y={row}&l={level}'
          },
          WebTileLayer,
          Basemap,
          map,
          SpatialReference,
          Color,
          esriConfig,
          esriRequest
        )
        const mapView = new MapView({
          id: '2D',
          map: mapControl,
          container: 'mapContent',
          spatialReference: {
            wkid: 4326
          },
          center: [112, 32],
          zoom: 4
        })
        this.setState({
          mapView
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
        <Toolbar mapView={mapView} />
      </div>
    )
  }
}
```