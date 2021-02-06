import React, { Component, useState } from 'react'
import esriLoader from 'esri-loader'
import { Button } from 'antd'
import axios from 'axios'
import CodeBtn from '../../../template/codeBtn'
import CodeSource from '../../../template/codeSource'
import demoCodes from './code/codes.md'
import imageUrl from '../../../../images/demo/20190624MYD.png'

/* 工具栏 */
function Toolbar (props) {
  const [layerState, setLayerState] = useState('隐藏图层')
  // 底图数组属性
  const { mapView, mapApi } = props

  const {
    BaseDynamicLayer
  } = mapApi
  const CustomImageOverLayLayer = BaseDynamicLayer.createSubclass({
    properties: {
      picUrl: null,
      extent: null,
      image: null,
      canvas: null
    },

    getImageUrl: function (extent, width, height) {
      // 新Image对象，可以理解为DOM
      if (!this.image) {
        this.image = new Image()
      }
      this.image.src = this.picUrl

      // 创建canvas DOM元素，并设置其宽高和图片一样
      if (!this.canvas) {
        this.canvas = document.createElement('canvas')
      }
      this.canvas.width = 2000
      this.canvas.height = 2000

      // 左上角坐标转换屏幕坐标,为了获取canvas绘制图片的起点
      const mapPoint = {
        x: this.extent.xmin,
        y: this.extent.ymax,
        spatialReference: {
          wkid: 4326
        }
      }
      const screenPoint = mapView.toScreen(mapPoint)

      // 根据extent范围计算canvas绘制图片的宽度以及高度
      // 左下角
      const leftbottom = {
        x: this.extent.xmin,
        y: this.extent.ymin,
        spatialReference: {
          wkid: 4326
        }
      }
      const screenLeftbottom = mapView.toScreen(leftbottom)

      // 右上角
      const righttop = {
        x: this.extent.xmax,
        y: this.extent.ymax,
        spatialReference: {
          wkid: 4326
        }
      }
      const screenRighttop = mapView.toScreen(righttop)
      this.canvas.getContext('2d').drawImage(this.image, screenPoint.x, screenPoint.y, Math.abs(screenRighttop.x - screenLeftbottom.x), Math.abs(screenRighttop.y - screenLeftbottom.y))
      return this.canvas.toDataURL('image/png')
    }
  })
  /**
   * 点击操作
   * @param {*} type
   */
  const handleClick = (evt, type) => {
    const excuteMethods = {
      add: () => addLayer(),
      showHide: () => showHideLayer(),
      remove: () => removeLayer('imageOverlayLayer')
    }
    excuteMethods[type]()
  }
  /**
   * 添加图层
   */
  const addLayer = () => {
    let displayLayer = mapView.map.findLayerById('imageOverlayLayer')
    if (displayLayer) {
      removeLayer('imageOverlayLayer')
    } else {
      displayLayer = new CustomImageOverLayLayer({
        id: 'imageOverlayLayer',
        // url: 'http://zj-fileserver.oss-cn-shanghai.aliyuncs.com/zjFileServer/images/20190624MYD.png',
        picUrl: imageUrl,
        extent: { xmin: 117.325157, ymin: 18.488356, xmax: 126.605055, ymax: 41.736681 }
      })
    }
    mapView.map.add(displayLayer)
  }

  /**
   * 显示隐藏图层
   */
  const showHideLayer = () => {
    const displayLayer = mapView.map.findLayerById('imageOverlayLayer')
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

  const toolbarStyle = {
    position: 'absolute',
    right: '1rem',
    top: '0.2rem',
    zIndex: 999
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
      url: 'https://js.arcgis.com/4.14'
    }
    esriLoader
      .loadModules([
        'esri/Map',
        'esri/Basemap',
        'esri/layers/BaseDynamicLayer',
        'esri/layers/TileLayer',
        'esri/views/MapView',
        'esri/views/SceneView',
        'esri/geometry/Extent',
        'esri/geometry/support/webMercatorUtils',
        'esri/core/urlUtils',
        'dojo/domReady!'
      ], mapOption)
      .then(([map, Basemap, BaseDynamicLayer, TileLayer, MapView, SceneView, Extent, webMercatorUtils]) => {
        // 定义初始化范围
        let fullExtent = new Extent({
          xmin: 53.357516,
          ymin: 0,
          xmax: 180,
          ymax: 60,
          spatialReference: {
            wkid: 4326
          }
        })
        fullExtent = webMercatorUtils.geographicToWebMercator(fullExtent)
        // 蓝色系图层
        const blueLayer = new TileLayer({
          url: 'http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer',
          id: 'blue',
          fullExtent,
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
        const mapView = new MapView({
          center: [109, 34],
          map: mapControl,
          container: 'mapContent',
          extent: fullExtent,
          constraints: {
            minZoom: 4,
            maxZoom: 18
          },
          zoom: 4
        })
        const mapApi = {
          BaseDynamicLayer
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
        {Object.keys(mapView).length > 0 ? <Toolbar mapView={mapView} mapApi={mapApi} /> : null}
      </div>
    )
  }
}
