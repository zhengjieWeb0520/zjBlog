import React, { Component, useState } from 'react'
import esriLoader from 'esri-loader'
import { Button } from 'antd'
import axios from 'axios'
import CodeBtn from '../../../template/codeBtn'
import CodeSource from '../../../template/codeSource'
import demoCodes from './code/codes.md'

/* 工具栏 */
function Toolbar (props) {
  const [layerState, setLayerState] = useState('隐藏图层')
  // 底图数组属性
  const { mapView, mapApi } = props

  const {
    FlareClusterLayer,
    ClassBreaksRenderer,
    SimpleMarkerSymbol,
    SimpleFillSymbol,
    SimpleLineSymbol,
    PopupTemplate
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
      remove: () => removeLayer('clusterLayer')
    }
    excuteMethods[type]()
  }
  /**
   * 添加图层
   */
  const addLayer = () => {
    const displayLayer = mapView.map.findLayerById('clusterLayer')
    if (displayLayer) {
      removeLayer('clusterLayer')
    } else {
      axios.get('./data/vector/flareClusterData.json')
        .then((res) => {
          const clusterData = res.data
          addClusterLayer(displayLayer, clusterData, 'clusterLayer', 55, 'x', 'y')
        })
    }
  }

  /**
   * 分蔟图层
   * @param { Object } displayLayer 图层
   * @param { Array } data 数据
   * @param { String } layerName 图层ID
   * @param { Number } clusterRatio 分簇半径
   * @param { String } lon 经纬度健值
   * @param { String } lat 经纬度健值
   * @param { String } value value值健值
   * @param { Array } colorArray 颜色数组
   * @param { Number } fontSize  标注大小
   */
  const addClusterLayer = (displayLayer, data, layerName = '', clusterRatio = 45, lon = 'x', lat = 'y') => {
    const maxSingleFlareCount = 8
    const areaDisplayMode = 'activated'

    const defaultSym = new SimpleMarkerSymbol({
      size: 6,
      color: '#FF0000',
      outline: null
    })

    const renderer = new ClassBreaksRenderer({
      defaultSymbol: defaultSym
    })

    renderer.field = 'clusterCount'
    const smSymbol = new SimpleMarkerSymbol({
      size: 22,
      outline: new SimpleLineSymbol({ color: [221, 159, 34, 0.8] }),
      color: [255, 204, 102, 0.8]
    })
    const mdSymbol = new SimpleMarkerSymbol({
      size: 24,
      outline: new SimpleLineSymbol({ color: [82, 163, 204, 0.8] }),
      color: [102, 204, 255, 0.8]
    })
    const lgSymbol = new SimpleMarkerSymbol({
      size: 28,
      outline: new SimpleLineSymbol({ color: [41, 163, 41, 0.8] }),
      color: [51, 204, 51, 0.8]
    })
    const xlSymbol = new SimpleMarkerSymbol({
      size: 32,
      outline: new SimpleLineSymbol({ color: [200, 52, 59, 0.8] }),
      color: [250, 65, 74, 0.8]
    })

    renderer.addClassBreakInfo(0, 19, smSymbol)
    renderer.addClassBreakInfo(20, 150, mdSymbol)
    renderer.addClassBreakInfo(151, 1000, lgSymbol)
    renderer.addClassBreakInfo(1001, Infinity, xlSymbol)

    // if area display mode is set.Create a renderer to display cluster areas.Use SimpleFillSymbols as the areas are polygons
    const defaultAreaSym = new SimpleFillSymbol({
      style: 'solid',
      color: [0, 0, 0, 0.2],
      outline: new SimpleLineSymbol({ color: [0, 0, 0, 0.3] })
    })

    const areaRenderer = new ClassBreaksRenderer({
      defaultSymbol: defaultAreaSym
    })
    areaRenderer.field = 'clusterCount'

    const smAreaSymbol = new SimpleFillSymbol({
      color: [255, 204, 102, 0.4],
      outline: new SimpleLineSymbol({
        color: [221, 159, 34, 0.8],
        style: 'dash'
      })
    })
    const mdAreaSymbol = new SimpleFillSymbol({
      color: [102, 204, 255, 0.4],
      outline: new SimpleLineSymbol({
        color: [82, 163, 204, 0.8],
        style: 'dash'
      })
    })
    const lgAreaSymbol = new SimpleFillSymbol({
      color: [51, 204, 51, 0.4],
      outline: new SimpleLineSymbol({
        color: [41, 163, 41, 0.8],
        style: 'dash'
      })
    })
    const xlAreaSymbol = new SimpleFillSymbol({
      color: [250, 65, 74, 0.4],
      outline: new SimpleLineSymbol({
        color: [200, 52, 59, 0.8],
        style: 'dash'
      })
    })

    areaRenderer.addClassBreakInfo(0, 19, smAreaSymbol)
    areaRenderer.addClassBreakInfo(20, 150, mdAreaSymbol)
    areaRenderer.addClassBreakInfo(151, 1000, lgAreaSymbol)
    areaRenderer.addClassBreakInfo(1001, Infinity, xlAreaSymbol)

    // Set up another class breaks renderer to style the flares individually
    const flareRenderer = new ClassBreaksRenderer({
      defaultSymbol: renderer.defaultSymbol
    })
    flareRenderer.field = 'clusterCount'

    const smFlareSymbol = new SimpleMarkerSymbol({
      size: 14,
      color: [255, 204, 102, 0.8],
      outline: new SimpleLineSymbol({ color: [221, 159, 34, 0.8] })
    })
    const mdFlareSymbol = new SimpleMarkerSymbol({
      size: 14,
      color: [102, 204, 255, 0.8],
      outline: new SimpleLineSymbol({ color: [82, 163, 204, 0.8] })
    })
    const lgFlareSymbol = new SimpleMarkerSymbol({
      size: 14,
      color: [51, 204, 51, 0.8],
      outline: new SimpleLineSymbol({ color: [41, 163, 41, 0.8] })
    })
    const xlFlareSymbol = new SimpleMarkerSymbol({
      size: 14,
      color: [250, 65, 74, 0.8],
      outline: new SimpleLineSymbol({ color: [200, 52, 59, 0.8] })
    })

    flareRenderer.addClassBreakInfo(0, 19, smFlareSymbol)
    flareRenderer.addClassBreakInfo(20, 150, mdFlareSymbol)
    flareRenderer.addClassBreakInfo(151, 1000, lgFlareSymbol)
    flareRenderer.addClassBreakInfo(1001, Infinity, xlFlareSymbol)

    // set up a popup template
    const popupTemplate = new PopupTemplate({
      title: '{name}',
      content: [
        {
          type: 'fields',
          fieldInfos: [
            {
              fieldName: 'facilityType',
              label: 'Facility Type',
              visible: true
            },
            { fieldName: 'postcode', label: 'Post Code', visible: true },
            { fieldName: 'isOpen', label: 'Opening Hours', visible: true }
          ]
        }
      ]
    })

    const options = {
      id: layerName,
      clusterRenderer: renderer,
      areaRenderer: areaRenderer,
      flareRenderer: flareRenderer,
      singlePopupTemplate: popupTemplate,
      spatialReference: { wkid: 4326 },
      subTypeFlareProperty: 'facilityType',
      singleFlareTooltipProperty: 'name',
      displaySubTypeFlares: true,
      maxSingleFlareCount: maxSingleFlareCount,
      clusterRatio: clusterRatio,
      clusterAreaDisplay: areaDisplayMode,
      xPropertyName: lon,
      yPropertyName: lat,
      data: data
    }

    displayLayer = new FlareClusterLayer.FlareClusterLayer(options)
    console.warn(displayLayer)
    mapView.map.add(displayLayer)
  }
  /**
   * 显示隐藏图层
   */
  const showHideLayer = () => {
    const displayLayer = mapView.map.findLayerById('clusterLayer')
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
    this.initCenter = [135.994722, -25.786689] // 初始化中心经纬度
    this.initZoom = 5 // 初始化缩放级别
  }

  state = {
    mapView: {}, // 地图对象
    mapApi: {}, // 地图api对象
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
      .loadModules([
        'esri/Map',
        'esri/Basemap',
        'esri/layers/TileLayer',
        'esri/views/MapView',
        'esri/views/SceneView',
        'widgets/FlareClusterLayer_v4',
        'esri/renderers/ClassBreaksRenderer',
        'esri/symbols/SimpleMarkerSymbol',
        'esri/symbols/SimpleFillSymbol',
        'esri/symbols/SimpleLineSymbol',
        'esri/PopupTemplate',
        'dojo/domReady!'
      ], mapOption)
      .then(([map, Basemap, TileLayer, MapView, SceneView, FlareClusterLayer, ClassBreaksRenderer, SimpleMarkerSymbol, SimpleFillSymbol, SimpleLineSymbol, PopupTemplate]) => {
        // 蓝色系图层
        const blueLayer = new TileLayer({
          url: 'http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetWarm/MapServer',
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
          FlareClusterLayer,
          ClassBreaksRenderer,
          SimpleMarkerSymbol,
          SimpleFillSymbol,
          SimpleLineSymbol,
          PopupTemplate
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
