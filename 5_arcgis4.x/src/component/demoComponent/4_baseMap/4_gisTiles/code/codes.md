```jsx
import React, { useState, Component } from 'react'
import esriLoader from 'esri-loader'
import { Select } from 'antd'

const Option = Select.Option

/* 工具栏 */
function Toolbar (props) {
  // 底图数组属性
  const { mapView } = props
  const [mapType, setMapType] = useState('blue')
  const toolbarStyle = {
    position: 'absolute',
    right: '1rem',
    top: '0.2rem',
    zIndex: 999
  }
  /**
   * 底图切换
   * @param {*} type
   */
  const handleChange = (key) => {
    const baseLayers = mapView.map.basemap.baseLayers.items
    // 全部图层隐藏
    baseLayers.forEach(item => {
      item.visible = false
    })
    // 图层显示
    const visibleLayer = baseLayers.filter(item => item.id === key)
    visibleLayer[0].visible = true
    setMapType(key)
  }
  return (
    <div className="toolbar" style={toolbarStyle}>
      <Select
        style={{ width: '0.8rem' }}
        value={mapType}
        onChange={handleChange}
      >
        <Option key="blue" value="blue">
          蓝色系
        </Option>
        <Option key="warm" value="warm">
          暖色系
        </Option>
        <Option key="terrain" value="terrain">
          地形系
        </Option>
      </Select>
    </div>
  )
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
      .loadModules([
        'esri/Map',
        'esri/Basemap',
        'esri/layers/TileLayer',
        'esri/views/MapView',
        'esri/views/SceneView',
        'dojo/domReady!'
      ], mapOption)
      .then(([map, Basemap, TileLayer, MapView, SceneView]) => {
        // 蓝色系图层
        const blueLayer = new TileLayer({
          url: 'http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer',
          id: 'blue',
          visible: true
        })

        // 暖色系图层
        const warmLayer = new TileLayer({
          url: 'http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetWarm/MapServer',
          id: 'warm',
          visible: false
        })

        // 地形图层
        const terrainLayer = new TileLayer({
          url: 'http://map.geoq.cn/arcgis/rest/services/ChinaOnlineCommunity/MapServer',
          id: 'terrain',
          visible: false
        })

        // 实例化底图对象
        const baseMap = new Basemap({
          baseLayers: [blueLayer, warmLayer, terrainLayer]
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
          center: [108.2, 32.1],
          map: mapControl,
          container: 'mapContent',
          zoom: 1
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
        <Toolbar mapView={mapView} allBaseLayer={this.allBaseLayer}/>
      </div>
    )
  }
}
```