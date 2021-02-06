```jsx
import React, { useState, Component } from 'react'
import esriLoader from 'esri-loader'
import { Button } from 'antd'
import echarts from 'echarts'

/* 工具栏 */
function Toolbar (props) {
  // 底图数组属性
  const { mapView } = props
  useEffect(() => {
    // 地图初始化加载完成绘制迁徙图
    axios.get('/zjFileServer/datas/heatMapData.json')
      .then(res => {
        console.warn(res)
        Toolbar.data = res.data
        initChart(res.data)
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
    initChart(true)
  }
  /**
   * 添加图层
   * @param {*}
   */
  const initChart = (isRedraw) => {
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
        const option = getOption()
        Toolbar.myChart.setOption(option)
      })
  }

  /**
   * 获取迁徙图option
   */
  const getOption = () => {
    // 点位经纬度
    const geoCoordMap = {
      南京: [118.78, 32.04],
      北京: [116.4551, 40.2539],
      连云港: [119.1248, 34.552],
      镇江: [119.4763, 31.9702],
      苏州: [120.6519, 31.3989],
      泰州: [120.0586, 32.5525],
      无锡: [120.3442, 31.5527],
      扬州: [119.4653, 32.8162],
      徐州: [117.184811, 34.261792]
    }
    // 迁徙数据
    const mingrateData = [
      [{ name: '南京' }, { name: '北京', value: 95 }],
      [{ name: '南京' }, { name: '连云港', value: 90 }],
      [{ name: '南京' }, { name: '扬州', value: 80 }],
      [{ name: '南京' }, { name: '苏州', value: 70 }],
      [{ name: '南京' }, { name: '无锡', value: 60 }],
      [{ name: '南京' }, { name: '徐州', value: 50 }],
      [{ name: '南京' }, { name: '泰州', value: 40 }],
      [{ name: '南京' }, { name: '镇江', value: 30 }]
    ]
    const planePath = 'path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z'

    const convertData = function (data) {
      const res = []
      for (let i = 0; i < data.length; i++) {
        const dataItem = data[i]
        const fromCoord = geoCoordMap[dataItem[0].name]
        const toCoord = geoCoordMap[dataItem[1].name]
        if (fromCoord && toCoord) {
          res.push({
            fromName: dataItem[0].name,
            toName: dataItem[1].name,
            numValue: dataItem[1].value,
            coords: [fromCoord, toCoord]
          })
        }
      }
      return res
    }

    const LineColor = ['#ff3333', 'orange', 'lime', 'aqua']
    const migrate = [['南京', mingrateData]]

    const series = []
    migrate.forEach((item) => {
      series.push(
        {
          // 设置飞行线
          name: item[1],
          type: 'lines',
          zlevel: 1,
          coordinateSystem: 'emap',
          effect: {
            show: true,
            period: 6,
            trailLength: 0.5,
            color: '#fff',
            shadowBlur: 0,
            symbolSize: 3
          },
          lineStyle: {
            normal: {
              color: function (params) {
                const num = params.data.numValue
                if (num > 75) {
                  return LineColor[0]
                } else if (num > 50) {
                  return LineColor[1]
                } else if (num > 25) {
                  return LineColor[2]
                } else {
                  return LineColor[3]
                }
              },
              width: 1,
              curveness: 0.2
            }
          },
          data: convertData(item[1])
        },
        // 设置轨迹线
        {
          name: item[0].name,
          type: 'lines',
          zlevel: 2,
          coordinateSystem: 'emap',
          effect: {
            show: true,
            period: 6,
            trailLength: 0,
            symbol: planePath,
            symbolSize: 15
          },
          lineStyle: {
            normal: {
              color: function (params) {
                const num = params.data.numValue
                if (num > 75) {
                  return LineColor[0]
                } else if (num > 50) {
                  return LineColor[1]
                } else if (num > 25) {
                  return LineColor[2]
                } else {
                  return LineColor[3]
                }
              },
              width: 1,
              opacity: 0.6,
              curveness: 0.2
            }
          },
          data: convertData(item[1])
        },
        {
          // 设置点
          name: item[0],
          type: 'effectScatter',
          coordinateSystem: 'emap',
          zlevel: 2,
          rippleEffect: {
            brushType: 'stroke'
          },
          label: {
            normal: {
              show: true,
              position: 'right',
              formatter: function (params) {
                var res = params.value[2]
                return res
              }
            }
          },
          symbolSize: function (val) {
            return val[2] / 20
          },
          itemStyle: {
            normal: {
              color: function (params) {
                const num = params.value[2]
                if (num > 75) {
                  return LineColor[0]
                } else if (num > 50) {
                  return LineColor[1]
                } else if (num > 25) {
                  return LineColor[2]
                } else {
                  return LineColor[3]
                }
              }
            }
          },
          data: item[1].map(function (dataItem) {
            return {
              name: dataItem[1].name,
              value: geoCoordMap[dataItem[1].name].concat([dataItem[1].value])
            }
          })
        }
      )
    })

    // 定义option
    const option = {
      title: {
        text: '',
        subtext: '',
        left: 'center',
        textStyle: {
          color: '#fff'
        }
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        top: 'bottom',
        left: 'right',
        data: ['北京 Top10', '上海 Top10', '广州 Top10'],
        textStyle: {
          color: '#fff'
        },
        selectedMode: 'single'
      },
      geo: {
        map: '',
        label: {
          emphasis: {
            show: false
          }
        },
        roam: true,

        itemStyle: {
          normal: {
            areaColor: '#323c48',
            borderColor: '#404a59'
          },
          emphasis: {
            areaColor: '#2a333d'
          }
        }
      },
      series: series
    }
    return option
  }
  return null
}
Toolbar.myChart = {}

/* 加载底图 */
export default class InitMap extends Component {
  constructor (props) {
    super(props)
    this.initCenter = [119, 34] // 初始化中心经纬度
    this.initZoom = 6 // 初始化缩放级别
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
          'esri/layers/gaodeLayer'
        ],
        mapOption
      )
      .then(([
        map,
        gaodeLayer
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
        const baseLayer = new gaodeLayer({
          id: 'gaode_st',
          layertype: 'st',
          visible: true
        })

        mapView.addLayer(baseLayer)
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