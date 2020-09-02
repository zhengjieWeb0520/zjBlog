/* eslint-disable */
import L from 'leaflet'
import { getColor } from './renderColors'
import {
  tiledMapLayer,
  dynamicMapLayer,
  featureLayer,
  imageMapLayer
} from 'esri-leaflet'
import './tools/leaflet_plugins/leaflet-baseMap' // 底图扩展
import './tools/leaflet_plugins/leaflet-heat' // 热力图扩展
import './tools/leaflet_plugins/leaflet-tilelayer-wmts' // wmts扩展
import './tools/leaflet_plugins/leaflet.wms' // wms 服务
import './tools/leaflet_plugins/leaflet-markercluster' // 聚合图层扩展

/* leaflet 地图工具 */
export default class leafletMap {
  constructor (initMapParams) {
    this.initMapParams = initMapParams

    /* 谷歌底图 */
    const GoogleNormalMap = L.tileLayer.chinaProvider('Google.Normal.Map', {
      maxZoom: 23,
      minZoom: 0,
      className: 'leaflet-layer'
    }) // 街道图
    const GoogleTerrainMap = L.tileLayer.chinaProvider('Google.Terrain.Map', {
      maxZoom: 23,
      minZoom: 0,
      className: 'leaflet-layer'
    }) // 地形
    const GoogleTerrainAnnotion = L.tileLayer.chinaProvider(
      'Google.Terrain.Annotion',
      {
        maxZoom: 23,
        minZoom: 0,
        className: 'leaflet-layer'
      }
    ) // 标注
    const GoogleSatelliteMap = L.tileLayer.chinaProvider(
      'Google.Satellite.Map',
      {
        maxZoom: 23,
        minZoom: 0,
        className: 'leaflet-layer'
      }
    ) // 卫星
    const GoogleSatelliteAnnotion = L.tileLayer.chinaProvider(
      'Google.Satellite.Annotion',
      {
        maxZoom: 23,
        minZoom: 0,
        className: 'leaflet-layer'
      }
    ) // 卫星标注

    /* 高德底图 */
    const GaoDeNormalMap = L.tileLayer.chinaProvider('GaoDe.Normal.Map', {
      maxZoom: 18,
      minZoom: 3,
      className: 'leaflet-layer'
    }) // 街道
    const GaoDeSatelliteMap = L.tileLayer.chinaProvider('GaoDe.Satellite.Map', {
      maxZoom: 18,
      minZoom: 0,
      className: 'leaflet-layer'
    }) // 卫星
    const GaoDeSatelliteAnnotion = L.tileLayer.chinaProvider(
      'GaoDe.Satellite.Annotion',
      {
        maxZoom: 18,
        minZoom: 0,
        className: 'leaflet-layer'
      }
    ) // 卫星标注

    /* 百度底图 */
    const BaiduNormalMap = L.tileLayer.chinaProvider('Baidu.Normal.Map', {
      maxZoom: 18,
      minZoom: 3,
      className: 'leaflet-layer'
    }) // 街道

    /* ArcGIS底图 */
    const ArcgisNormalMap = L.tileLayer.chinaProvider('Arcgis.Normal.Map', {
      maxZoom: 18,
      minZoom: 0,
      className: 'leaflet-layer'
    }) // 街道
    const ArcgisSatelliteMap = L.tileLayer.chinaProvider(
      'Arcgis.Satellite.Map',
      {
        maxZoom: 18,
        minZoom: 0,
        className: 'leaflet-layer'
      }
    ) // 卫星
    const ArcgisSatelliteAnnotion = L.tileLayer.chinaProvider(
      'Arcgis.Satellite.Annotion',
      {
        maxZoom: 18,
        minZoom: 0,
        className: 'leaflet-layer'
      }
    ) // 卫星标注

    /* MapBox底图 */
    const OpenNormalMap = L.tileLayer.chinaProvider('Open.Normal.Map', {
      maxZoom: 23,
      minZoom: 0,
      className: 'leaflet-layer',
      id: 'mapbox.streets'
    }) // 街道

    const googleStreets = L.layerGroup([GoogleNormalMap])
    const googleterrain = L.layerGroup([
      GoogleTerrainMap,
      GoogleTerrainAnnotion
    ])
    const googleSatellite = L.layerGroup([GoogleSatelliteMap])
    const googleHybrid = L.layerGroup([
      GoogleSatelliteMap,
      GoogleSatelliteAnnotion
    ])

    const gaodeStreets = L.layerGroup([GaoDeNormalMap])
    const gaodeSatellite = L.layerGroup([GaoDeSatelliteMap])
    const gaodeHybrid = L.layerGroup([
      GaoDeSatelliteMap,
      GaoDeSatelliteAnnotion
    ])

    const BaiduStreets = L.layerGroup([BaiduNormalMap])

    const arcgisStreets = L.layerGroup([ArcgisNormalMap])
    const arcgisSatellite = L.layerGroup([ArcgisSatelliteMap])
    const arcgisHybrid = L.layerGroup([
      ArcgisSatelliteMap,
      ArcgisSatelliteAnnotion
    ])

    const openStreets = L.layerGroup([OpenNormalMap])

    var baseLayers = {
      '谷歌地图(街道)': googleStreets,
      '谷歌地图(地形)': googleterrain,
      '谷歌地图(卫星)': googleSatellite,
      '谷歌地图(混合)': googleHybrid,
      '高德地图(街道)': gaodeStreets,
      '高德地图(卫星)': gaodeSatellite,
      '高德地图(混合)': gaodeHybrid,
      '百度地图(街道)': BaiduStreets,
      'Arcgis(街道)': arcgisStreets,
      'Arcgis(卫星)': arcgisSatellite,
      'Arcgis(混合)': arcgisHybrid,
      'OpenMap(街道)': openStreets
    }
    var overlays = {
      Marker: googleStreets,
      Roads: googleterrain
    }

    this.leafletMap = L.map(initMapParams.container, {
      center: initMapParams.center,
      zoom: initMapParams.zoom,
      layers: [googleHybrid],
      zoomControl: false,
      worldCopyJump: true,
      zoomSnap: 0.5,
      zoomDelta: 0.5,
      // crs: L.CRS.EPSG4326, // wgs_84坐标系（天地图）需添加这句
      wheelPxPerZoomLevel: 120
    })
    this.allLayers = new Map() // 添加的图层
    const layerControl = L.control.layers(baseLayers, overlays)
    this.leafletMap.addControl(layerControl)

    layerControl.addOverlay(openStreets, 'Cities')
    this.mapZoomEnd()
  }

  /**
   * 图层控制
   * @param {string} type 操作类型
   */
  zoomControl (type) {
    switch (type) {
      case 'zoomIn':
        this.leafletMap.zoomIn()
        break
      case 'zoomOut':
        this.leafletMap.zoomOut()
        break
      case 'zoomRecover':
        this.leafletMap.setZoom(this.initMapParams.zoom)
        break
      default:
        break
    }
  }

  /**
   * 移除除底图外所有图层
   */
  removeAllLayers () {
    this.leafletMap.eachLayer(layer => {
      if (
        (!layer._container || layer.options.className !== 'leaflet-layer') &&
        Object.keys(layer.options).length !== 0
      ) {
        layer.remove()
      }
    })
  }

  /**
   * 移除指定className图层
   * @param {string} layerName 图层className
   */
  removeLayers (layerName) {
    if (layerName === 'mosaicDataSet') {
      this.mosaicLayer.remove()
    }
    if (layerName === 'clusterMarkerLayer') {
      this.clusterMarkers.remove()
    }
    if (layerName === 'leaflet-heatmap-layer') {
      const heatmapLayer = document.querySelector('.leaflet-heatmap-layer')
      heatmapLayer.parentNode.removeChild(heatmapLayer)
      return
    }
    if (layerName === 'gridLayer') {
      this.gridMarkerLayerGroup.remove()
      this.gridLayerGroup.remove()
    }
    this.leafletMap.eachLayer(layer => {
      if (layer.options.className === layerName) {
        layer.remove()
      }
    })
  }
  /**
   * 添加wms地图
   * @param { string } layerName 图层名称
   * @param { Object } option
   */
  addWmsLayer (layerName, option) {
    const wmsLayer = L.tileLayer.wms(option.url, {
      layers: option.layers,
      format: option.format,
      crs: L.CRS.EPSG3857,
      transparent: true
    })
    wmsLayer.setZIndex(10)
    this.allLayers.set(layerName, wmsLayer)
    this.leafletMap.addLayer(wmsLayer)
  }

  /**
   * 添加WMTS图层
   * @param { string } layerName 图层名称
   * @param { string } url 图层的路径
   * @param { Object } option 图层参数
   */
  addwmtsLayer (layerName, url, option) {
    const wmtsLayer = new L.tileLayer.wmts(url, option)
    this.allLayers.set(layerName, wmtsLayer)
    this.leafletMap.addLayer(wmtsLayer)
  }

  /**
   * 添加图片图层
   * @param { String }  layerName 图层名称
   * @param { String } imageUrl image的路径
   * @param { Array } imageBounds 四角坐标范围
   * @param { String } className 图层className
   */
  addImageOverlay (layerName, imageUrl, imageBounds, className) {
    const imageLayer = L.imageOverlay(imageUrl, imageBounds, {
      className: className
    })
    this.leafletMap.addLayer(imageLayer)
    this.allLayers.set(layerName, imageLayer)
    this.leafletMap.fitBounds(imageLayer.getBounds())
  }

  /**
   * 添加线图层
   * @param { String } layerName 图层名称
   * @param { Array } latlngs 线的数据
   * @param { Object } option 线的颜色
   */
  addLineLayer (layerName, latlngs, option) {
    const polyline = L.polyline(latlngs, option)
    this.leafletMap.addLayer(polyline)
    this.allLayers.set(layerName, polyline)
    this.leafletMap.fitBounds(polyline.getBounds())
  }

  /**
   * 添加面图层
   * @param { String } layerName 图层名称
   * @param {Array} latlngs 面的数据
   * @param {Object} option 面的参数
   */
  addPolygonLayer (layerName, latlngs, option) {
    const polygon = L.polygon(latlngs, option)
    this.leafletMap.addLayer(polygon)
    this.allLayers.set(layerName, polygon)
    this.leafletMap.fitBounds(polygon.getBounds())
  }

  /**
   * 添加圆图层
   * @param { String } layerName 图层名称
   * @param {Array} latlngs 圆的数据
   * @param {Object} option 圆的参数
   */
  addCircleLayer (layerName, latlng, option) {
    const circle = L.circle(latlng, option)
    this.leafletMap.addLayer(circle)
    this.allLayers.set(layerName, polygon)
    this.leafletMap.fitBounds(circle.getBounds())
  }

  /**
   * 添加标记图层
   * @param { String } layerName 图层名称
   * @param {Array} latlngs 标记的数据
   * @param {Object} option 标记的参数
   */
  addMarkerLayer (layerName, latlng, option) {
    const marker = L.marker(latlng, option)
    this.allLayers.set(layerName, polygon)
    this.leafletMap.addLayer(marker)
    this.leafletMap.flyTo(latlng)
  }

  /**
   * 添加多个标记图层
   * @param { String } layerName 图层名称
   * @param {Array} latlngs 标记的数据
   * @param {String} x 经度
   * @param {String} y 纬度
   * @param {String} icon 图标
   * @param {Array} iconSize 图标大小
   * @param {Object} option 参数
   */
  addMultiMarkerLayer (
    layerName,
    latlngs,
    x = 'lon',
    y = 'lat',
    icon,
    iconSize = [20, 20],
    option
  ) {
    this.markerLayerGroup = new L.featureGroup()
    this.markerLayerGroup.clearLayers()
    latlngs.forEach(element => {
      const latlng = [element[y], element[x]]
      // 自定义一个maker
      const greenIcon = L.icon({
        iconUrl: icon,
        iconSize: iconSize, // size of the icon
        popupAnchor: [0, -10] // point from which the popup should open relative to the iconAnchor
      })
      const markerOption = Object.assign(option, { icon: greenIcon })
      // pop
      const content = `<div><p>${
        element.name
        }</p><div><span>经度：</span><span>${
        element.lon
        }</span></div><div><span>纬度：</span><span>${
        element.lat
        }</span></div></div>`
      const marker = L.marker(latlng, markerOption)
        .bindTooltip(`${element.name}`, { direction: 'left' })
        .openTooltip()
      marker.bindPopup(content)
      this.markerLayerGroup.addLayer(marker)
    })
    this.leafletMap.addLayer(this.markerLayerGroup)
    this.allLayers.set(layerName, this.markerLayerGroup)
  }

  /**
   * 添加标注图层
   * @param {String} label 标记的值
   * @param {Number} lat 纬度
   * @param {Number} lon 经度
   * @param {String} className 类名
   */
  addTextLayer (label, lat, lon, className, iconSize) {
    var myIcon = L.divIcon({
      html: label,
      className,
      iconSize
    })
    return L.marker([lat, lon], { icon: myIcon })
  }

  /**
   * 添加格网图层
   * @param {Arrary} dataInfo 格网数据
   * @param {Number} distance 格网分辨率
   */
  addGridDataLayer (dataInfo = [], distance, layerName) {
    this.gridLayerGroup = new L.featureGroup()
    this.gridLayerGroup.clearLayers()
    this.gridMarkerLayerGroup = new L.featureGroup()
    this.gridMarkerLayerGroup.clearLayers()
    dataInfo.forEach(item => {
      if (item[2] !== 0) {
        debugger
        const maxx = Number(item[0] + distance)
        const mimx = Number(item[0] - distance)
        const maxy = Number(item[1] + distance)
        const miny = Number(item[1] - distance)
        const bounds = [[miny, mimx], [maxy, maxx]]
        const color = getColor(item[2])
        const rectangle = L.rectangle(bounds, { color: color, weight: 1 })
        const label = this.addTextLayer(
          item[2],
          item[1],
          item[0],
          'my-div-icon',
          30
        )
        this.gridMarkerLayerGroup.addLayer(label)
        this.gridLayerGroup.addLayer(rectangle)
      }
    })
    this.leafletMap.addLayer(this.gridLayerGroup)
  }

  toggleGridLabelLayer (zoom) {
    if (
      zoom > 12 &&
      this.leafletMap.hasLayer(this.gridLayerGroup) &&
      !this.leafletMap.hasLayer(this.gridMarkerLayerGroup)
    ) {
      this.leafletMap.addLayer(this.gridMarkerLayerGroup)
    }

    if (zoom < 12 && this.leafletMap.hasLayer(this.gridMarkerLayerGroup)) {
      this.gridMarkerLayerGroup.remove()
    }
  }
  /**
   * 绘制网格图层
   * @param {String} initParams 参数
   * @param {Array} dataArray 数据
   * @param {mapFlag} mapFlag 是否初始化
   */
  drawRasterGridLayer (initParams, dataArray) {
    let _this = this
    this.rasterGridParams = {
      initParams: initParams,
      dataArray: dataArray
    }
    const step = initParams.step // 分辨率步长

    // 数据区extent
    const bounds = [[initParams.minx, initParams.miny], [initParams.maxx, initParams.maxy]]
    const dataExtent = L.rectangle(bounds, { color: "#ff7800", weight: 1 })
    this.initDataExtent = dataExtent

    const mapExtent = this.leafletMap.getPixelBounds()

    // let isInsert = this.geometryEngine.within(mapExtent, dataExtent)
    console.warn(dataExtent)
    console.warn(mapExtent)
  }

  /**
   * 添加热力图
   * @param {Array} points 热力图点数据
   * @param {Object} options 热力图参数
   */
  addHeatMapLayer (points, options) {
    points = points.map(function (p) {
      return [p[0], p[1]]
    })
    L.heatLayer(points, options).addTo(this.leafletMap)
  }

  /**
   * 添加聚合图层
   * @param {Array} points 聚合图点数据
   */
  addClusterMarkerLayer (points) {
    this.clusterMarkers = L.markerClusterGroup()

    for (var i = 0; i < points.length; i++) {
      var a = points[i]
      var title = a[2]
      var marker = L.marker(new L.LatLng(a[0], a[1]), { title: title })
      marker.bindPopup(title)
      this.clusterMarkers.addLayer(marker)
    }

    this.leafletMap.addLayer(this.clusterMarkers)
    console.warn(this.leafletMap)
  }

  /**
   * 解析XML获取镶嵌数据集参数
   *  @param {String} productMark：产品标识
   *  @param {xml} productXml：xml文件结构
   */
  getMosicalParam (productMark, productXml) {
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
  addMosaicLayer (className, mapUrl, expression, renderData) {
    var mosaicRule = {
      mosaicMethod: 'esriMosaicNadir',
      where: expression
    }
    var remapRule = {
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

    var colorRule = {
      rasterFunction: 'Colormap',
      rasterFunctionArguments: {
        Colormap: renderData.colorMap,
        Raster: remapRule
      },
      variableName: 'Raster',
      outputPixelType: 'U8'
    }
    this.mosaicLayer = imageMapLayer({
      url: mapUrl,
      mosaicRule: mosaicRule,
      className: className,
      id: className,
      renderingRule: colorRule,
      useCors: false
    })
    this.leafletMap.addLayer(this.mosaicLayer)
    console.warn(this.leafletMap)
    this.excuteMosaicIdentify(this.mosaicLayer, mosaicRule)
  }

  /**
   * 镶嵌数据集探针
   * @param {Object} mosaicLayer 镶嵌数据集图层
   * @param {Object} mosaicRule 查询条件
   */
  excuteMosaicIdentify (mosaicLayer, mosaicRule) {
    const _this = this
    this.mapClick(evt => {
      mosaicLayer
        .identify()
        .at(evt.evt.latlng)
        .setMosaicRule(mosaicRule)
        .run(function (error, identifyImageResponse, rawResponse) {
          const content = `<div><p>${
            identifyImageResponse.pixel.properties.value
            }</p><div><span>经度：</span><span>${
            evt.evt.latlng.lng
            }</span></div><div><span>纬度：</span><span>${
            evt.evt.latlng.lat
            }</span></div></div>`
          var popup = L.popup()
            .setLatLng(evt.evt.latlng)
            .setContent(content)
            .openOn(_this.leafletMap)
        })
    })
  }


  addGisTileLayer (layerName, url, minZoom, maxZoom) {
    const tileLayer = tiledMapLayer({
      url,
      detectRetina: false,
      minZoom,
      maxZoom
    })
    this.leafletMap.addLayer(tileLayer)
  }

  mapZoomEnd () {
    this.leafletMap.on('zoomend', res => {
      console.warn(res)
      const bounds = this.leafletMap.getBounds()
      const zoom = this.leafletMap.getZoom()
      console.warn(zoom)
      this.toggleGridLabelLayer(zoom) // 格点标注图层显影
    })
  }

  mapClick (callback) {
    this.leafletMap.on('click', evt => {
      const data = {
        evt
      }
      if (callback) {
        callback(data)
      }
    })
  }

  addEchats () { }
}
