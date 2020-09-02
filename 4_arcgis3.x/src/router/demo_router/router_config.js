/*
 * @Author: 郑杰14
 * @Date: 2020-06-10 09:34:07
 * @LastEditors: 郑杰14
 * @LastEditTime: 2020-09-01 20:28:40
 * @Description: demo 路由
 */
import React, { lazy } from 'react'

const Install = lazy(() => import(/* webpackChunkName: 'install' */ '../../component/demoComponent/2_install'))
const InitMap = lazy(() => import(/* webpackChunkName: 'initMap' */ '../../component/demoComponent/3_initMap'))
const BaseMapGoogle = lazy(() => import(/* webpackChunkName: 'baseMapGoogle' */ '../../component/demoComponent/4_baseMap/1_google'))
const BaseMapGaode = lazy(() => import(/* webpackChunkName: 'baseMapGaode' */ '../../component/demoComponent/4_baseMap/2_gaode'))
const BaseMapTdt = lazy(() => import(/* webpackChunkName: 'baseMapGaode' */ '../../component/demoComponent/4_baseMap/3_tdtOnline'))
const BaseMapGisTiles = lazy(() => import(/* webpackChunkName: 'baseMapGisTiles' */ '../../component/demoComponent/4_baseMap/4_gisTiles'))
const OperateZoom = lazy(() => import(/* webpackChunkName: 'operateZoom' */ '../../component/demoComponent/5_operate/1_zoom'))
const OperateChooseIn = lazy(() => import(/* webpackChunkName: 'operateChooseIn' */ '../../component/demoComponent/5_operate/2_chooseIn'))
const OperateMeasure = lazy(() => import(/* webpackChunkName: 'operateChooseIn' */ '../../component/demoComponent/5_operate/3_messure'))
const VectorPoint = lazy(() => import(/* webpackChunkName: 'vectorPoint' */ '../../component/demoComponent/6_vector/1_point'))
const VectorPolyline = lazy(() => import(/* webpackChunkName: 'vectorPolyline' */ '../../component/demoComponent/6_vector/2_polyline'))
const VectorPolygon = lazy(() => import(/* webpackChunkName: 'vectorPolygon' */ '../../component/demoComponent/6_vector/3_polygon'))
const BasicImageLayer = lazy(() => import(/* webpackChunkName: 'imageLayer' */ '../../component/demoComponent/7_basicLayers/1_imageLayer'))
const BasicWmsLayer = lazy(() => import(/* webpackChunkName: 'wmsLayer' */ '../../component/demoComponent/7_basicLayers/2_wmsLayer'))
const BasicWmtsLayer = lazy(() => import(/* webpackChunkName: 'wmtsLayer' */ '../../component/demoComponent/7_basicLayers/3_wmtsLayer'))
const BasicFeatureLayer = lazy(() => import(/* webpackChunkName: 'featureLayer' */ '../../component/demoComponent/7_basicLayers/4_featureLayer'))
const BasicDynamicLayer = lazy(() => import(/* webpackChunkName: 'dynamicLayer' */ '../../component/demoComponent/7_basicLayers/5_dynamicLayer'))
const BasicMosaicLayer = lazy(() => import(/* webpackChunkName: 'mosaicLayer' */ '../../component/demoComponent/7_basicLayers/6_mosaicLayer'))
const ExtendClusterLayer = lazy(() => import(/* webpackChunkName: 'clusterLayer' */ '../../component/demoComponent/8_extendLayers/1_clusterLayer'))
const ExtendGridLayer = lazy(() => import(/* webpackChunkName: 'gridLayer' */ '../../component/demoComponent/8_extendLayers/2_gridLayer'))
const ExtendGisHeatLayer = lazy(() => import(/* webpackChunkName: 'gisHeatLayer' */ '../../component/demoComponent/8_extendLayers/3_gisHeatLayer'))
const EchartsMigrateLayer = lazy(() => import(/* webpackChunkName: 'migrateLayer' */ '../../component/demoComponent/9_echartsLayers/1_migrateLayer'))
const EchartsHeatLayer = lazy(() => import(/* webpackChunkName: 'heatLayer' */ '../../component/demoComponent/9_echartsLayers/2_heatLayer'))
const EchartsScatterLayer = lazy(() => import(/* webpackChunkName: 'scatterLayer' */ '../../component/demoComponent/9_echartsLayers/3_scatterLayer'))
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
    name: '初始化地图',
    path: 'initMap',
    component: <InitMap />
  },
  {
    name: 'arcgis api 3.x',
    path: 'arcgis3x',
    children: [
      {
        name: '底图',
        path: 'baseMap',
        children: [
          {
            name: '谷歌地图',
            path: 'google',
            component: <BaseMapGoogle />
          },
          {
            name: '高德地图',
            path: 'gaode',
            component: <BaseMapGaode />
          },
          {
            name: '在线天地图',
            path: 'tdtOnline',
            component: <BaseMapTdt />
          },
          {
            name: 'GIS tiles底图',
            path: 'gisTiles',
            component: <BaseMapGisTiles />
          }
        ]
      },
      {
        name: '地图操作',
        path: 'operate',
        children: [
          {
            name: '缩放',
            path: 'zoom',
            component: <OperateZoom />
          },
          {
            name: '框选放大',
            path: 'chooseIn',
            component: <OperateChooseIn />
          },
          {
            name: '测量',
            path: 'messure',
            component: <OperateMeasure />
          },
          {
            name: '卷帘',
            path: 'rpllerBlind',
            component: ''
          }
        ]
      },
      {
        name: '矢量',
        path: 'vector',
        children: [
          {
            name: '点矢量',
            path: 'point',
            component: <VectorPoint />
          },
          {
            name: '线矢量',
            path: 'polyline',
            component: <VectorPolyline />
          },
          {
            name: '面矢量',
            path: 'polygon',
            component: <VectorPolygon />
          }
        ]
      },
      {
        name: '基础图层',
        path: 'basicLayers',
        children: [
          {
            name: '图片图层',
            path: 'imageLayer',
            component: <BasicImageLayer />
          },
          {
            name: 'wms图层',
            path: 'wmsLayer',
            component: <BasicWmsLayer />
          },
          {
            name: 'wmts图层',
            path: 'wmtsLayer',
            component: <BasicWmtsLayer />
          },
          {
            name: 'feature图层',
            path: 'featureLayer',
            component: <BasicFeatureLayer />
          },
          {
            name: 'dynamic图层',
            path: 'dynamicLayer',
            component: <BasicDynamicLayer />
          },
          {
            name: '镶嵌数据集',
            path: 'mosaicLayer',
            component: <BasicMosaicLayer />
          }
        ]
      },
      {
        name: '扩展图层',
        path: 'extendLayer',
        children: [
          {
            name: '聚合图层',
            path: 'clusterLayer',
            component: <ExtendClusterLayer />
          },
          {
            name: '格网图层',
            path: 'gridLayer',
            component: <ExtendGridLayer />
          },
          {
            name: 'GIS热力图',
            path: 'gisHeatLayer',
            component: <ExtendGisHeatLayer />
          }
        ]
      },
      {
        name: 'echarts图层',
        path: 'echarts',
        children: [
          {
            name: '迁徙图',
            path: 'migrate',
            component: <EchartsMigrateLayer />
          },
          {
            name: '热力图',
            path: 'heatMap',
            component: <EchartsHeatLayer />
          },
          {
            name: '散点图',
            path: 'scatterLayer',
            component: <EchartsScatterLayer />
          }
        ]
      }
    ]
  }
]
