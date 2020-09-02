import React, { Component, useEffect } from 'react'
import esriLoader from 'esri-loader'
import axios from 'axios'
import echarts from 'echarts'
import CodeBtn from '../../../template/codeBtn'
import CodeSource from '../../../template/codeSource'
import demoCodes from './code/codes.md'

/* 工具栏 */
function Toolbar (props) {
  // 底图数组属性
  const { mapView } = props
  useEffect(() => {
    // 地图初始化加载完成绘制迁徙图
    mapView.on('load', () => {
      // const url = 'http://zj-fileserver.oss-cn-shanghai.aliyuncs.com/zjFileServer/datas/heatMapData.json'
      axios.get('/zjFileServer/datas/heatMapData.json')
        .then(res => {
          Toolbar.data = res.data
          initChart(res.data)
        })
    })
    // 地图缩放平移重绘迁徙图
    mapView.on('zoom-end', () => {
      reDraw()
    })
    mapView.on('pan-end', () => {
      reDraw()
    })
  }, [])

  /**
   * 重绘
   */
  const reDraw = () => {
    if (Toolbar.myChart && Toolbar.myChart.dispose) {
      Toolbar.myChart.dispose()
    }
    if (JSON.stringify(Toolbar.data) !== '[]') {
      initChart(Toolbar.data, true)
    }
  }
  /**
   * 添加图层
   * @param {*}
   */
  const initChart = (data, isRedraw) => {
    // if (!isRedraw) {
    //   // 初始化赋值， redraw不赋值
    // }
    esriLoader
      .loadModules([
        'widgets/EChartsLayer3x'
      ])
      .then(([
        EChartsLayer
      ]) => {
        // 定义图层
        const overlay = new EChartsLayer(mapView, echarts)
        const chartsContainer = overlay.getEchartsContainer()

        if (Toolbar.myChart && Toolbar.myChart.dispose) {
          Toolbar.myChart.dispose()
        }

        Toolbar.myChart = overlay.initECharts(chartsContainer)
        Toolbar.myChart.clear()
        window.onresize = Toolbar.myChart.resize
        const option = getOption(data)
        Toolbar.myChart.setOption(option)
      })
  }

  /**
   * 获取迁徙图option
   */
  const getOption = (data) => {
    const points = [].concat.apply(
      [],
      data.map(function (track) {
        return track.map(function (seg) {
          return seg.coord.concat([1])
        })
      })
    )
    const option = {
      animation: false,
      visualMap: {
        show: false,
        top: 'top',
        min: 0,
        max: 5,
        seriesIndex: 0,
        calculable: true,
        inRange: {
          color: ['blue', 'blue', 'green', 'yellow', 'red']
        }
      },
      series: [
        {
          type: 'heatmap',
          coordinateSystem: 'emap',
          data: points,
          pointSize: 5,
          blurSize: 6
        }
      ]
    }
    return option
  }
  return null
}
Toolbar.data = []
Toolbar.myChart = {}

/* 加载底图 */
export default class InitMap extends Component {
  constructor (props) {
    super(props)
    this.initCenter = [120.122849, 30.228594] // 初始化中心经纬度
    this.initZoom = 14 // 初始化缩放级别
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
          'esri/layers/ArcGISTiledMapServiceLayer'
        ],
        mapOption
      )
      .then(([
        map,
        ArcGISTiledMapServiceLayer
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

        // 定义图层对象
        const blueUrl = 'http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer'
        const blueLayer = new ArcGISTiledMapServiceLayer(blueUrl, {
          id: 'arcgis_blue',
          visible: true
        })

        mapView.addLayer(blueLayer)
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
        { Object.keys(mapView).length !== 0 ? <Toolbar mapView={mapView} /> : null }
      </div>
    )
  }
}
