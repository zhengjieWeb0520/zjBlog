/*
 * @Author: 郑杰14
 * @Date: 2020-06-10 09:34:07
 * @LastEditors: 郑杰14
 * @LastEditTime: 2020-07-28 14:01:14
 * @Description: demo 路由
 */
import React, { lazy } from 'react'

const Install = lazy(() => import(/* webpackChunkName: 'install' */ '../../component/demoComponent/2_install'))
const InitMap = lazy(() => import(/* webpackChunkName: 'initMap' */ '../../component/demoComponent/3_initMap'))
const BaseMapGoogle = lazy(() => import(/* webpackChunkName: 'basemapGoogle' */ '../../component/demoComponent/5_basemap_google'))
const BaseMapGaode = lazy(() => import(/* webpackChunkName: 'basemapGaode' */ '../../component/demoComponent/6_basemap_gaode'))
const BaseMapTdtWGS84 = lazy(() => import(/* webpackChunkName: 'basemapTdtWgs84' */ '../../component/demoComponent/7_basemap_tdtwgs84'))
const BaseMapTdtMector = lazy(() => import(/* webpackChunkName: 'basemapTdtMector' */ '../../component/demoComponent/8_basemap_tdtMecator'))
const BaseMapTdtArcgisTiles = lazy(() => import(/* webpackChunkName: 'basemapArcgisTiles' */ '../../component/demoComponent/9_basemap_arcgistiles'))
const ToolOperate = lazy(() => import(/* webpackChunkName: 'toolOperate' */ '../../component/demoComponent/10_tool_operate'))
const MiniMap = lazy(() => import(/* webpackChunkName: 'miniMap' */ '../../component/demoComponent/12_tool_miniMap'))
const Measure = lazy(() => import(/* webpackChunkName: 'measure' */ '../../component/demoComponent/13_tool_measure'))
const WmsLayer = lazy(() => import(/* webpackChunkName: 'wmsLayer' */ '../../component/demoComponent/15_wmsLayer'))
const WmtsLayer = lazy(() => import(/* webpackChunkName: 'wmtsLayer' */ '../../component/demoComponent/16_wmtsLayer'))
const ImageLayer = lazy(() => import(/* webpackChunkName: 'imageLayer' */ '../../component/demoComponent/17_imageLayer'))
const HeatLayer = lazy(() => import(/* webpackChunkName: 'heatLayer' */ '../../component/demoComponent/18_heatLayer'))
const GridLayer = lazy(() => import(/* webpackChunkName: 'gridLayer' */ '../../component/demoComponent/19_gridLayer'))
const MosaicLayer = lazy(() => import(/* webpackChunkName: 'mosaicLayer' */ '../../component/demoComponent/20_mosaicLayer'))

const PointVector = lazy(() => import(/* webpackChunkName: 'pointVector' */ '../../component/demoComponent/21_pointVector'))
const PolylineVector = lazy(() => import(/* webpackChunkName: 'polylineVector' */ '../../component/demoComponent/22_polylineVector'))
const PolygonVector = lazy(() => import(/* webpackChunkName: 'polygonVector' */ '../../component/demoComponent/23_polygonVector'))
const ClusterLayer = lazy(() => import(/* webpackChunkName: 'clusterLayer' */ '../../component/demoComponent/24_clusterLayer'))

const EchartsMigrate = lazy(() => import(/* webpackChunkName: 'echartsMigrate' */ '../../component/demoComponent/25_echarts_migrate'))
const EchartsScatter = lazy(() => import(/* webpackChunkName: 'echartsScatter' */ '../../component/demoComponent/26_echarts_scatter'))
export default [
  {
    name: '前言',
    path: 'preface',
    component: ''
  },
  {
    name: '安装教程',
    path: 'install',
    component: <Install />
  },
  {
    name: 'leaflet',
    path: 'leaflet',
    children: [
      {
        path: 'initMap',
        name: '初始化地图',
        component: <InitMap />
      },
      {
        path: 'config',
        name: 'config',
        children: [
          {
            path: 'baseMapConfig',
            name: 'mapConfig',
            component: ''
          }
        ]
      },
      {
        path: 'basemap',
        name: '底图',
        children: [
          {
            path: 'google',
            name: '谷歌地图',
            component: <BaseMapGoogle />
          },
          {
            path: 'gaode',
            name: '高德地图',
            component: <BaseMapGaode />
          },
          {
            path: 'tdt_wgs84',
            name: '天地图在线地图（wgs84）',
            component: <BaseMapTdtWGS84 />
          },
          {
            path: 'tdt_mercator',
            name: '天地图在线地图（墨卡托）',
            component: <BaseMapTdtMector />
          },
          {
            path: 'arcgis_tiles',
            name: 'arcgis底图',
            component: <BaseMapTdtArcgisTiles />
          }
        ]
      },
      {
        path: 'tool',
        name: '工具',
        children: [
          {
            path: 'mapOperate',
            name: '地图操作',
            component: <ToolOperate />
          },
          {
            path: 'baseMapSwitch',
            name: '底图切换',
            component: ''
          },
          {
            path: 'measure',
            name: '测量工具',
            component: <Measure />
          },
          {
            path: 'miniMap',
            name: '鹰眼图',
            component: <MiniMap />
          }
        ]
      },
      {
        path: 'layer',
        name: '图层',
        children: [
          {
            path: 'wmsLayer',
            name: 'wms图层',
            component: <WmsLayer />
          },
          {
            path: 'wmtsLayer',
            name: 'wmts图层',
            component: <WmtsLayer />
          },
          {
            path: 'imageLayer',
            name: 'image图层',
            component: <ImageLayer />
          },
          {
            path: 'heatMapLayer',
            name: '热力图',
            component: <HeatLayer />
          },
          {
            path: 'gridLayer',
            name: '网格图',
            component: <GridLayer />
          },
          {
            path: 'mosaicLayer',
            name: '镶嵌数据集图层',
            component: <MosaicLayer />
          },
          {
            path: 'echartsMigrate',
            name: 'echarts迁徙图',
            component: <EchartsMigrate />
          },
          {
            path: 'echartsScatter',
            name: 'echarts散点图',
            component: <EchartsScatter />
          }
        ]
      },
      {
        path: 'vector',
        name: '矢量图层',
        children: [
          {
            path: 'point',
            name: 'point',
            component: <PointVector />
          },
          {
            path: 'polyline',
            name: 'polyline',
            component: <PolylineVector />
          },
          {
            path: 'polygon',
            name: 'polygon',
            component: <PolygonVector />
          },
          {
            path: 'cluster',
            name: '聚合图层',
            component: <ClusterLayer />
          }
        ]
      }
    ]
  }
]
