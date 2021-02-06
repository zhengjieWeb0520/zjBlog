```jsx
import React, { useEffect } from 'react'
import esriLoader from 'esri-loader'

export default function InitMap () {
  useEffect(() => {
    initMap()
  }, [])

  const initMap = () => {
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
      .then(([Map, Basemap, TileLayer, MapView, SceneView]) => {
        // 实例化图层
        const layer = new TileLayer({
          url: 'http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer'
        })
        // 实例化底图对象
        const baseMap = new Basemap({
          baseLayers: [layer],
          title: 'Custom Basemap',
          id: 'myBasemap'
        })
        // 实例化地图对象
        const map = new Map({
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
        const view = new SceneView({
          center: [108.2, 32.1],
          map: map,
          container: 'mapContent',
          zoom: 1
        })
      })
  }

  const style = {
    width: '100%',
    height: '100%'
  }
  return (
    <div className="page-content">
      <div id="mapContent" className="map-content" style={style}></div>
    </div>
  )
```