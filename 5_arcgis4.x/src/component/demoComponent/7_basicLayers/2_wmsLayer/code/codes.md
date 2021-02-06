```jsx
import React, { Component } from 'react'
import esriLoader from 'esri-loader'
import axios from 'axios'
import { Button } from 'antd'

/* 工具栏 */
function Toolbar (props) {
  const [layerState, setLayerState] = useState('隐藏图层')
  // 底图数组属性
  const { mapView, mapApi } = props

  const {
    WMSLayer,
    webMercatorUtils
  } = mapApi

  const toolbarStyle = {
    position: 'absolute',
    right: '1rem',
    top: '0.2rem',
    zIndex: 999
  }
  /**
   * 点击操作
   * @param {*} type
   */
  const handleClick = (evt, type) => {
    const excuteMethods = {
      add: () => addLayer(),
      showHide: () => showHideLayer(),
      remove: () => removeLayer('wmsLayer')
    }
    excuteMethods[type]()
  }
  /**
   * 添加图层
   */
  const addLayer = () => {
    const url = 'http://47.101.174.142:16080/geoserver/zjServer/wms'
    let displayLayer = mapView.map.findLayerById('wmsLayer')
    if (displayLayer) {
      removeLayer('wmsLayer')
    } else {
      displayLayer = new WMSLayer({
        url,
        sublayers: [
          {
            name: 'zjServer:jsBorder'
          }
        ]
      })
    }
    mapView.map.add(displayLayer)
    // 执行查询
    executeIdentify()
  }
  const executeIdentify = () => {
    const spatialUrl = 'http://47.101.174.142:16080/geoserver/zjServer/wfs?SERVICE=WFS&VERSION=1.1.1&REQUEST=GetFeature&outputformat=json'
    const geomType = 'the_geom'
    const layerName = 'zjServer:AreaCity'
    mapView.on('click', (evt) => {
      let mapPoint = evt.mapPoint
      if (mapPoint.spatialReference.isWebMercator) {
        mapPoint = webMercatorUtils.webMercatorToGeographic(mapPoint)
      }
      const { x, y } = mapPoint
      // 运用wfs执行查询
      // const filter = `${spatialUrl}&typename=${layerName}&Filter=<Filter xmlns="http://www.opengis.net/ogc" xmlns:gml="http://www.opengis.net/gml"><Intersects><PropertyName>${geomType}</PropertyName><gml:Point><gml:coordinates>${x},${y}</gml:coordinates></gml:Point></Intersects></Filter>`
      const filter = `${spatialUrl}&typename=${layerName}&Filter=%3CFilter%20xmlns:ogc=%22http://www.opengis.net/ogc%22%20xmlns:gml=%22http://www.opengis.net/gml%22%3E%3CIntersects%3E%20%3CPropertyName%3E${geomType}%3C/PropertyName%3E%20%3Cgml:Envelope%20srsName=%22EPSG:4326%22%3E%09%20%3Cgml:lowerCorner%3E${x - 0.0002709031105}%20${y - 0.0002709031105}%3C/gml:lowerCorner%3E%20%09%20%3Cgml:upperCorner%3E${x + 0.0002709031105}%20${y + 0.0002709031105}%3C/gml:upperCorner%3E%20%3C/gml:Envelope%3E%3C/Intersects%3E%3C/Filter%3E`
      axios.post(filter).then((res) => {
        if (res.status === 200) {
          const { Name, ID } = res.data.features[0].properties
          mapView.popup.open({
            title: Name,
            location: mapPoint,
            content: `名称：${Name}<br/>编码：${ID}`
          })
        }
      })
    })
  }
  /**
   * 显示隐藏图层
   */
  const showHideLayer = () => {
    const displayLayer = mapView.map.findLayerById('featureLayer')
    if (layerState === '隐藏图层') {
      displayLayer.visible = false
      setLayerState('显示图层')
    } else {
      displayLayer.visible = true
      setLayerState('隐藏图层')
    }
  }

  /**
   * 移除图层
   */
  const removeLayer = (layerId) => {
    const displayLayer = mapView.map.findLayerById(layerId)
    displayLayer && mapView.map.remove(displayLayer)
  }
  return (
    <div className="toolbar" style={toolbarStyle}>
      <Button type="info" onClick={v => handleClick(v, 'add')}>添加图层</Button>
      <Button type="info" onClick={v => handleClick(v, 'showHide')}>{layerState}</Button>
      <Button type="info" onClick={v => handleClick(v, 'remove')}>删除图层</Button>
    </div>
  )
}

/* 加载底图 */
export default class InitMap extends Component {
  constructor (props) {
    super(props)
    this.allBaseLayer = [] // 底图数组
    this.initCenter = [120, 33] // 初始化中心经纬度
    this.initZoom = 8 // 初始化缩放级别
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
      url: 'https://js.arcgis.com/4.14'
    }
    esriLoader
      .loadModules([
        'esri/Map',
        'esri/Basemap',
        'esri/layers/TileLayer',
        'esri/views/MapView',
        'esri/views/SceneView',
        'esri/layers/WMSLayer',
        'esri/geometry/support/webMercatorUtils',
        'dojo/domReady!'
      ], mapOption)
      .then(([map, Basemap, TileLayer, MapView, SceneView, WMSLayer, webMercatorUtils]) => {
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
        const mapApi = {
          WMSLayer,
          webMercatorUtils
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
        <Toolbar mapView={mapView} mapApi={mapApi} />
      </div>
    )
  }
}
```