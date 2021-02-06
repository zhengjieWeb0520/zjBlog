import React, { useEffect } from 'react'
import { useHistory, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import esriLoader from 'esri-loader'
import Header from '../../component/template/header'
import NewMap from '../../utils/arcgis3x/arcgisTool'
import { initMap } from '../../store/map'
import './index.scss'

/* 首页 */
export default (props) => {
  const history = useHistory()
  const dispatch = useDispatch()
  useEffect(() => {
    initMap()
  }, [])

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
    esriConfig.request.corsEnabledServers.push(corUrl) // 谷歌跨域

    // 实例化影像图层
    const gaodeSatelliteLayer = new TintLayer({
      urlTemplate: layersUrl.satelliteUrl,
      tint: new Color('#004FBB'),
      title: 'satellite',
      id: mapType + '_basemap_satelliteMap',
      visible: true
    })
    // 实例化标注图层
    const gaodeAnooMarkerLayer = new TintLayer({
      urlTemplate: layersUrl.anooMarkerUrl,
      tint: new Color('#004FBB'),
      title: 'anooMarker',
      id: mapType + '_basemap_anooMarkerMap',
      visible: true
    })
    // 实例化地图图层
    const gaodeDigitalTileLayer = new TintLayer({
      urlTemplate: layersUrl.digitalUrl,
      tint: new Color('#004FBB'),
      title: 'digital',
      id: mapType + '_basemap_digitalMap'
    })

    const baseMapLayer = [
      gaodeDigitalTileLayer,
      gaodeSatelliteLayer,
      gaodeAnooMarkerLayer
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
  const initMap = () => {
    const mapOption = {
      url: 'http://www.zjmap88.site/arcgis_js_api/library/4.7/init.js'
    }
    esriLoader
      .loadModules([
        'esri/views/SceneView',
        'esri/layers/BaseTileLayer',
        'esri/Basemap',
        'esri/Map',
        'esri/Color',
        'esri/config',
        'esri/request'
      ], mapOption)
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
          'gaode',
          'http://webst01.is.autonavi.com',
          {
            satelliteUrl: 'http://webst01.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
            digitalUrl: 'http://webst01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
            anooMarkerUrl: 'http://webst01.is.autonavi.com/appmaptile?style=8&x={x}&y={y}&z={z}'
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
      })
  }
  return (
    <div className="page page-index">
      <Header />
      <section className="page-index-content">
        <ul>
          <li>
            <Link to='/main/summary'>介绍</Link>
          </li>
          <li>
            <Link to='/main/demo'>
              demo
            </Link>
          </li>
          <li>下载</li>
        </ul>
      </section>
      <div id="mapContent" className="map-content"></div>
    </div>
  )
}
