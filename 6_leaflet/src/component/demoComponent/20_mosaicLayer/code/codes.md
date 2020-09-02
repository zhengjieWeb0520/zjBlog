```jsx
import React, { useEffect } from 'react'
import L from 'leaflet'
import '../../../utils/leafletApi/tools/leaflet_plugins/leaflet-baseMap' // 底图扩展
import { imageMapLayer } from 'esri-leaflet'

export default function InitMap () {
  let leafletMap = {}
  useEffect(() => {
    initMap()
  }, [])

  const initMap = () => {
    // 卫星图层
    const googleSatelliteMap = L.tileLayer.chinaProvider(
      'Google.Satellite.Map',
      {
        maxZoom: 23,
        minZoom: 0,
        className: 'leaflet-layer'
      }
    )

    // 卫星标注图层
    const googleSatelliteAnnotion = L.tileLayer.chinaProvider(
      'Google.Satellite.Annotion',
      {
        maxZoom: 23,
        minZoom: 0,
        className: 'leaflet-layer3'
      }
    )

    // 图层组
    const googleHybrid = L.layerGroup([
      googleSatelliteMap,
      googleSatelliteAnnotion
    ])

    // 初始化地图
    leafletMap = L.map('mapContent', {
      center: [35.54, 110.23],
      zoom: 3.4,
      layers: [googleHybrid],
      zoomControl: false,
      worldCopyJump: true,
      zoomSnap: 0.5,
      zoomDelta: 0.5,
      minZoom: 3,
      wheelPxPerZoomLevel: 120
    })
    initMosaicLayer(leafletMap)
  }

  const initMosaicLayer = () => {
    axios.get('./data/config/ProductCfg.xml').then(res => {
      const parser = new DOMParser()
      const xmldoc = parser.parseFromString(res.data, 'text/xml') // xml转换
      const mark = 'LST_H8' // 标识
      const renderData = getMosicalParam(
        mark,
        xmldoc
      )
      addMosaicLayer(
        'mosaicDataSet',
        'http://localhost:6080/arcgis/rest/services/LST/ImageServer',
        'Name = \'201904181100\'',
        renderData
      )
    })
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
    // let nodata = ''
    let unit
    for (let i = 0; i <= nodeList.length - 1; i++) {
      if (nodeList[i].attributes[0].value === productMark) {
        pixLabel = nodeList[i].getElementsByTagName('ProdDesp')[0].textContent
        unit = nodeList[i].getElementsByTagName('ReMaps')[0].attributes[0].value
        // nodata = nodeList[i].getElementsByTagName('ReMaps')[0].attributes[1].value
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
   * 添加镶嵌数据集
   *  @param {String} className：图层名
   *  @param {String} mapUrl：图层url
   *  @param {String} expression: 过滤条件
   *  @param {Object} renderData: 渲染方案
   */
  const addMosaicLayer = (className, mapUrl, expression, renderData) => {
    const mosaicRule = {
      mosaicMethod: 'esriMosaicNadir',
      where: expression
    }
    const remapRule = {
      rasterFunction: 'Remap',
      rasterFunctionArguments: {
        InputRanges: renderData.inputRanges,
        OutputValues: renderData.outputValues,
        NoDataRanges: [-999, 0],
        Raster: '$$'
      },
      outputPixelType: 'U8',
      variableName: 'Raster'
    }

    const colorRule = {
      rasterFunction: 'Colormap',
      rasterFunctionArguments: {
        Colormap: renderData.colorMap,
        Raster: remapRule
      },
      variableName: 'Raster',
      outputPixelType: 'U8'
    }
    const mosaicLayer = imageMapLayer({
      url: mapUrl,
      mosaicRule: mosaicRule,
      className: className,
      id: className,
      renderingRule: colorRule,
      useCors: false
    })
    leafletMap.addLayer(mosaicLayer)
    excuteMosaicIdentify(mosaicLayer, mosaicRule)
  }

  /**
   * 镶嵌数据集探针
   * @param {Object} mosaicLayer 镶嵌数据集图层
   * @param {Object} mosaicRule 查询条件
   */
  const excuteMosaicIdentify = (mosaicLayer, mosaicRule) => {
    leafletMap.on('click', evt => {
      mosaicLayer
        .identify()
        .at(evt.evt.latlng)
        .setMosaicRule(mosaicRule)
        .run(function (err, identifyImageResponse, rawResponse) {
          const content = `<div><p>${
            identifyImageResponse.pixel.properties.value
            }</p><div><span>经度：</span><span>${
            evt.evt.latlng.lng
            }</span></div><div><span>纬度：</span><span>${
            evt.evt.latlng.lat
            }</span></div></div>`
          const popup = L.popup()
            .setLatLng(evt.latlng)
            .setContent(content)
            .openOn(leafletMap)
        })
    })
  }

  const style = {
    width: '100%',
    height: '100%'
  }

  return (
    <div className="page-content">
      <div className="mapContent" id="mapContent" style={style}></div>
    </div>
  )
}
```