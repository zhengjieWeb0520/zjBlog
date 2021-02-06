/* eslint-disable */
import React, { Component } from 'react'
import esriLoader from 'esri-loader'
import { Button } from 'antd'
import axios from 'axios'
import CodeBtn from '../../../template/codeBtn'
import CodeSource from '../../../template/codeSource'
import demoCodes from './code/codes.md'

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
   * 解析XML获取镶嵌数据集参数
   *  @param {String} productMark：产品标识
   *  @param {xml} productXml：xml文件结构
   */
  const getMosicalParam = (productMark, productXml) => {
    const nodeList = productXml.getElementsByTagName('Plugin')
    const inputRanges = []
    const outputValues = []
    const colorMap = []
    const labelArray = []
    let pixLabel
    let unit
    for (let i = 0; i <= nodeList.length - 1; i++) {
      if (nodeList[i].attributes[0].value === productMark) {
        pixLabel = nodeList[i].getElementsByTagName('ProdDesp')[0].textContent
        unit = nodeList[i].getElementsByTagName('ReMaps')[0].attributes[0].value
        const reMapDom = nodeList[i].childNodes[3].getElementsByTagName('ReMap')
        for (let j = 0; j <= reMapDom.length - 1; j++) {
          const reMapAttr = reMapDom[j].attributes
          const minValue = Number(reMapAttr[1].value)
          const maxValue = Number(reMapAttr[2].value)
          const revLevel = Number(reMapAttr[3].value)
          const colorValue = reMapAttr[4].value.split(',')
          const colorArr = []
          inputRanges.push(minValue)
          inputRanges.push(maxValue)
          outputValues.push(revLevel)
          colorArr.push(revLevel)
          colorValue.forEach(item => {
            colorArr.push(Number(item))
          })
          colorMap.push(colorArr)
          labelArray.push(reMapAttr[5].value)
        }
      }
    }
    const data = {
      inputRanges: inputRanges,
      outputValues: outputValues,
      colorMap: colorMap,
      labelArray: labelArray,
      pixLabel: pixLabel,
      unit: unit
    }
    return data
  }
  /**
   * 添加图层
   * @param {*}
   */
  const addLayer = () => {
    axios.get('/zjFileServer/datas/ProductCfg.xml')
      .then(res => {
        // 解析xml字符串
        const { data } = res
        const parser = new DOMParser()
        const xmldoc = parser.parseFromString(data, 'text/xml')

        const mark = 'LST_H8'
        const renderData = getMosicalParam(mark, xmldoc)
        console.warn(renderData)
        addMosaicLayer(
          'mosaicLayer', // 图层名称
          'http://lstweb.jsweather.com.cn:6080/arcgis/rest/services/LST/ImageServer', // 图层url
          `Name = '201904181100'`, // 影像期次匹配
          renderData // 渲染方案
        )
      })
  }

  /**
   * 添加镶嵌数据集图层
   * @param {*} layerName 图层名称
   * @param {*} url 图层url
   * @param {*} expression 匹配条件
   * @param {*} renderData 渲染方案
   */
  const addMosaicLayer = (layerName, url, expression, renderData) => {
    esriLoader
      .loadModules([
        'esri/layers/RasterFunction',
        'esri/layers/ImageServiceParameters',
        'esri/layers/ArcGISImageServiceLayer',
        'esri/tasks/ImageServiceIdentifyTask',
        'esri/tasks/ImageServiceIdentifyParameters',
        'esri/layers/MosaicRule',
        'esri/geometry/webMercatorUtils'
      ])
      .then(([
        RasterFunction,
        ImageServiceParameters,
        ArcGISImageServiceLayer,
        ImageServiceIdentifyTask,
        ImageServiceIdentifyParameters,
        MosaicRule,
        WebMercatorUtils
      ]) => {
        // 定义插值方法
        const resampleRF = new RasterFunction({
          functionName: 'Resample',
          variableName: 'Raster',
          functionArguments: {
            ResamplingType: 1,
            Raster: '$$'
          }
        })
        // 定义分类方法
        const remapRF = new RasterFunction()
        remapRF.functionName = 'Remap'
        remapRF.functionArguments = {
          InputRanges: renderData.inputRanges,
          OutputValues: renderData.outputValues,
          Raster: resampleRF
        }
        remapRF.outputPixelType = 'U8'
        // 定义渲染方法
        const ColorFunction = new RasterFunction()
        ColorFunction.functionName = 'Colormap'
        ColorFunction.functionArguments = {
          Colormap: renderData.colorMap,
          Raster: remapRF
        }
        // 设置图层参数
        const params = new ImageServiceParameters()
        params.renderingRule = ColorFunction
        // 定义图层
        const mosaicLayer = new ArcGISImageServiceLayer(url, {
          id: layerName,
          opacity: 0.7,
          imageServiceParameters: params
        })
        mosaicLayer.setDefinitionExpression(expression)
        mapView.addLayer(mosaicLayer)

        // 定义图层点击事件
        excuteMosaicIdentify(
          url,
          expression,
          ImageServiceIdentifyTask,
          ImageServiceIdentifyParameters,
          MosaicRule,
          WebMercatorUtils
        )
      })
  }

  /**
   * 图层点击事件
   * @param {*} url 
   * @param {*} expression 
   */
  const excuteMosaicIdentify = (url, expression, ImageServiceIdentifyTask, ImageServiceIdentifyParameters, MosaicRule, WebMercatorUtils) => {
    const identifyTask = new ImageServiceIdentifyTask(url)
    const imageParams = new ImageServiceIdentifyParameters()
    const mosaicRule = new MosaicRule({
      where: expression
    })

    // 地图点击事件
    mapView.on('click', (evt) => {
      let mapPoint = res.evt.mapPoint
      if (mapPoint.spatialReference.isWebMercator()) {
        mapPoint = WebMercatorUtils.webMercatorToGeographic(mapPoint)
      }
      imageParams.geometry = mapPoint
      imageParams.returnPixelValues = true
      imageParams.mosaicRule = mosaicRule
      identifyTask.execute(imageParams).then(res => {
        console.warn(res)
      })
    })
  }

  /**
   * 移除图片图层
   */
  const removeLayer = () => {
    const mosaicLayer = mapView.getLayer('mosaicLayer')
    if (mosaicLayer) {
      mapView.removeLayer(mosaicLayer) // 移除图层
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
    this.allBaseLayer = [] // 底图数组
    this.initCenter = [119, 34] // 初始化中心经纬度
    this.initZoom = 4 // 初始化缩放级别
  }

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
        <Toolbar mapView={mapView} initCenter={this.initCenter} initZoom={this.initZoom} />
      </div>
    )
  }
}
