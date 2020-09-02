```jsx
import React, { useState, Component } from 'react'
import esriLoader from 'esri-loader'
import { Button } from 'antd'
import DataManager from './dataManager'

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
        'esri/renderers/ClassBreaksRenderer',
        'esri/SpatialReference',
        'widgets/FlareClusterLayer_v3',
        'esri/symbols/SimpleMarkerSymbol',
        'esri/symbols/SimpleLineSymbol',
        'esri/symbols/SimpleFillSymbol',
        'esri/dijit/PopupTemplate',
        'esri/geometry/Extent',
        'esri/geometry/ScreenPoint',
        'esri/Color'
      ])
      .then(([
        ClassBreaksRenderer,
        SpatialReference,
        FlareClusterLayer,
        SimpleMarkerSymbol,
        SimpleLineSymbol,
        SimpleFillSymbol,
        PopupTemplate,
        Extent,
        ScreenPoint,
        Color
      ]) => {
        // const url = 'http://zj-fileserver.oss-cn-shanghai.aliyuncs.com/zjFileServer/datas/flareClusterData.json'
        axios.get('/zjFileServer/datas/flareClusterData.json')
          .then(res => {
            const { status, data } = res
            if (status === 200) {
              DataManager.setData(data)

              const preClustered = false
              const displaySingleFlaresAtCount = 10
              const areaDisplayMode = 'hover'
              const clusterRatio = 75 // 聚合半径

              // 定义图层
              const clusterLayer = new FlareClusterLayer({
                id: 'clusterLayer',
                spatialReference: new SpatialReference({ wkid: 4326 }),
                subTypeFlareProperty: 'facilityType',
                singleFlareTooltipProperty: 'name',
                displaySubTypeFlares: true,
                displaySingleFlaresAtCount: displaySingleFlaresAtCount,
                flareShowMode: 'mouse',
                preClustered: preClustered,
                clusterRatio: clusterRatio,
                clusterAreaDisplay: areaDisplayMode,
                clusteringBegin: function () {
                  // console.log('clustering begin')
                },
                clusteringComplete: function () {
                  // console.log('clustering complete')
                }
              })

              // 定义默认样式
              const defaultSym = new SimpleMarkerSymbol()
                .setSize(6)
                .setColor('#FF0000')
                .setOutline(null)
              const renderer = new ClassBreaksRenderer(defaultSym, 'clusterCount')
              const xlSymbol = new SimpleMarkerSymbol(
                SimpleMarkerSymbol.STYLE_CIRCLE,
                32,
                new SimpleLineSymbol(
                  SimpleLineSymbol.STYLE_SOLID,
                  new Color([200, 52, 59, 0.8]),
                  1
                ),
                new Color([250, 65, 74, 0.8])
              )
              const lgSymbol = new SimpleMarkerSymbol(
                SimpleMarkerSymbol.STYLE_CIRCLE,
                28,
                new SimpleLineSymbol(
                  SimpleLineSymbol.STYLE_SOLID,
                  new Color([41, 163, 41, 0.8]),
                  1
                ),
                new Color([51, 204, 51, 0.8])
              )
              const mdSymbol = new SimpleMarkerSymbol(
                SimpleMarkerSymbol.STYLE_CIRCLE,
                24,
                new SimpleLineSymbol(
                  SimpleLineSymbol.STYLE_SOLID,
                  new Color([82, 163, 204, 0.8]),
                  1
                ),
                new Color([102, 204, 255, 0.8])
              )
              const smSymbol = new SimpleMarkerSymbol(
                SimpleMarkerSymbol.STYLE_CIRCLE,
                22,
                new SimpleLineSymbol(
                  SimpleLineSymbol.STYLE_SOLID,
                  new Color([230, 184, 92, 0.8]),
                  1
                ),
                new Color([255, 204, 102, 0.8])
              )
              renderer.addBreak(0, 19, smSymbol)
              renderer.addBreak(20, 150, mdSymbol)
              renderer.addBreak(151, 1000, lgSymbol)
              renderer.addBreak(1001, Infinity, xlSymbol)

              if (areaDisplayMode) {
                // 定义面的图形
                const defaultAreaSym = new SimpleFillSymbol()
                  .setStyle(SimpleFillSymbol.STYLE_SOLID)
                  .setColor(new Color([0, 0, 0, 0.2]))
                  .setOutline(
                    new SimpleLineSymbol(
                      SimpleLineSymbol.STYLE_SOLID,
                      new Color([0, 0, 0, 0.3]),
                      1
                    )
                  )
                const areaRenderer = new ClassBreaksRenderer(defaultAreaSym, 'clusterCount')
                const xlAreaSymbol = new SimpleFillSymbol(
                  SimpleFillSymbol.STYLE_SOLID,
                  new SimpleLineSymbol(
                    SimpleLineSymbol.STYLE_SOLID,
                    new Color([200, 52, 59, 0.8]),
                    1
                  ),
                  new Color([250, 65, 74, 0.8])
                )
                const lgAreaSymbol = new SimpleFillSymbol(
                  SimpleFillSymbol.STYLE_SOLID,
                  new SimpleLineSymbol(
                    SimpleLineSymbol.STYLE_SOLID,
                    new Color([41, 163, 41, 0.8]),
                    1
                  ),
                  new Color([51, 204, 51, 0.8])
                )
                const mdAreaSymbol = new SimpleFillSymbol(
                  SimpleFillSymbol.STYLE_SOLID,
                  new SimpleLineSymbol(
                    SimpleLineSymbol.STYLE_SOLID,
                    new Color([82, 163, 204, 0.8]),
                    1
                  ),
                  new Color([102, 204, 255, 0.8])
                )
                const smAreaSymbol = new SimpleFillSymbol(
                  SimpleFillSymbol.STYLE_SOLID,
                  new SimpleLineSymbol(
                    SimpleLineSymbol.STYLE_SOLID,
                    new Color([230, 184, 92, 0.8]),
                    1
                  ),
                  new Color([255, 204, 102, 0.8])
                )

                areaRenderer.addBreak(0, 19, smAreaSymbol)
                areaRenderer.addBreak(20, 150, mdAreaSymbol)
                areaRenderer.addBreak(151, 1000, lgAreaSymbol)
                areaRenderer.addBreak(1001, Infinity, xlAreaSymbol)

                // use the custom overload of setRenderer to include the renderer for areas.
                clusterLayer.setRenderer(renderer, areaRenderer)
              } else {
                clusterLayer.setRenderer(renderer)
              }

              // 定义弹框
              const template = new PopupTemplate({
                title: '{name}',
                fieldInfos: [
                  { fieldName: 'facilityType', label: 'Facility Type', visible: true },
                  { fieldName: 'postcode', label: 'Post Code', visible: true },
                  { fieldName: 'isOpen', label: 'Opening Hours', visible: true }
                ]
              })
              clusterLayer.infoTemplate = template
              mapView.infoWindow.titleInBody = false
              mapView.addLayer(clusterLayer)

              // get the first set of data
              if (preClustered) {
                getPreClusteredGraphics(clusterRatio)
              } else {
                // not preclustered - just add the raw data to be clusted within the layer.
                const clusterData = DataManager.getData()
                clusterLayer.addData(clusterData)
              }

              function getPreClusteredGraphics (clusterRatio) {
                var maxSingleFlareCount = displaySingleFlaresAtCount

                var clusteredData = DataManager.fakeServerSideClustering(
                  clusterRatio,
                  maxSingleFlareCount,
                  areaDisplayMode,
                  mapView,
                  Extent,
                  SpatialReference,
                  ScreenPoint
                )
                clusterLayer.addPreClusteredData(clusteredData)
              }
            }
          })
      })
  }

  /**
   * 移除图片图层
   */
  const removeLayer = () => {
    const clusterLayer = mapView.getLayer('clusterLayer')
    if (clusterLayer) {
      mapView.removeLayer(clusterLayer) // 移除图层
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
    this.allBaseLayer = [], // 底图数组
    this.initCenter = [135.309216, -24.988001] // 初始化中心经纬度
    this.initZoom = 5 // 初始化缩放级别
  }

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
          id: 'google_road',
          layertype: 'road',
          visible: true
        })

        mapView.addLayer(googleDigitalLayer)
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