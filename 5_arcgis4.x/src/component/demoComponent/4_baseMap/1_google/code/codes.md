```jsx
import React, { useState, Component } from 'react'
import esriLoader from 'esri-loader'
import { Select } from 'antd'

const Option = Select.Option

/* 工具栏 */
function Toolbar (props) {
  // 底图数组属性
  const { mapView } = props
  const [mapType, setMapType] = useState('google_basemap_satelliteMap')
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

    // 谷歌地图和高德影像显示标注
    if (key === 'google_basemap_satelliteMap') {
      const anooMarkerId = key.split('_')[0] + '_' + key.split('_')[1] + '_anooMarkerMap'
      const labelLayer = baseLayers.filter(item => item.id === anooMarkerId)
      labelLayer[0].visible = true
    }
    setMapType(key)
  }
  return (
    <div className="toolbar" style={toolbarStyle}>
      <Select
        style={{ width: '0.8rem' }}
        value={mapType}
        onChange={handleChange}
      >
        <Option key="google_basemap_digitalMap" value="google_basemap_digitalMap">
          电子地图
        </Option>
        <Option key="google_basemap_satelliteMap" value="google_basemap_satelliteMap">
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
  BaseTileLayer,
  Basemap,
  map,
  Color,
  esriConfig,
  esriRequest
) => {
  // 配置BaseTileLayer
  const TintLayer = BaseTileLayer.createSubclass({
    properties: {
      urlTemplate: null,
      tint: {
        value: null,
        type: Color
      }
    },
    // generate the tile url for NumericalForecastSlide given level, row and column
    getTileUrl: function (level, row, col) {
      return this.urlTemplate
        .replace('{z}', level)
        .replace('{x}', col)
        .replace('{y}', row)
    },
    fetchTile: function (level, row, col) {
      const url = this.getTileUrl(level, row, col)
      return esriRequest(url, {
        responseType: 'image',
        allowImageDataAccess: true
      }).then(
        function (response) {
          // when esri request resolves successfully
          // get the image from the response
          const image = response.data
          const width = this.tileInfo.size[0]
          const height = this.tileInfo.size[0]

          // create NumericalForecastSlide canvas with 2D rendering context
          const canvas = document.createElement('canvas')
          const context = canvas.getContext('2d')
          canvas.width = width
          canvas.height = height

          // Draw the blended image onto the canvas.
          context.drawImage(image, 0, 0, width, height)

          return canvas
        }.bind(this)
      )
    }
  })
  // 设置配置跨域地址
  corUrl.forEach(item => {
    esriConfig.request.corsEnabledServers.push(item)
  })

  // 实例化影像图层
  const satelliteLayer = new TintLayer({
    urlTemplate: layersUrl.satelliteUrl,
    tint: new Color('#004FBB'),
    title: 'satellite',
    id: mapType + '_basemap_satelliteMap',
    visible: true
  })
  // 实例化标注图层
  const anooMarkerLayer = new TintLayer({
    urlTemplate: layersUrl.anooMarkerUrl,
    tint: new Color('#004FBB'),
    title: 'anooMarker',
    id: mapType + '_basemap_anooMarkerMap',
    visible: true
  })
  // 实例化地图图层
  const digitalTileLayer = new TintLayer({
    urlTemplate: layersUrl.digitalUrl,
    tint: new Color('#004FBB'),
    title: 'digital',
    id: mapType + '_basemap_digitalMap'
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
    basemap: baseMap
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
          'esri/views/SceneView',
          'esri/layers/BaseTileLayer',
          'esri/Basemap',
          'esri/Map',
          'esri/Color',
          'esri/config',
          'esri/request'
        ],
        mapOption
      )
      .then(([
        SceneView,
        BaseTileLayer,
        Basemap,
        map,
        Color,
        esriConfig,
        esriRequest
      ]) => {
        const mapControl = initBaseLayer(
          'google',
          ['http://www.google.cn'],
          {
            satelliteUrl: 'http://www.google.cn/maps/vt?lyrs=s@800&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}',
            digitalUrl: 'http://www.google.cn/maps/vt/lyrs=m@226000000&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}&s=Galil',
            anooMarkerUrl: 'http://www.google.cn/maps/vt/lyrs=h@177000000&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}&s=Galil'
          },
          BaseTileLayer,
          Basemap,
          map,
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