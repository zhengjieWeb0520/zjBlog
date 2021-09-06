/*
 * @Author: 郑杰14
 * @Date: 2021-04-13 22:29:44
 * @LastEditors: 郑杰14
 * @LastEditTime: 2021-04-22 10:27:21
 * @Description: 登录页面
 */
import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import * as echarts from 'echarts'
import 'echarts-gl'
import './echarts/js/world'
import Header from '../../component/template/header'
import './index.scss'

export default function index() {
  const ROOT_PATH = 'https://cdn.jsdelivr.net/gh/apache/echarts-website@asf-site/examples'
  const dataCount = 0
  const CHUNK_COUNT = 230
  const fetchData = (idx: number, myChart: any) => {
    if (idx >= CHUNK_COUNT) {
      return
    }
    const dataURL = `${ROOT_PATH}/data/asset/data/gps/gps_${idx}.bin`
    const xhr = new XMLHttpRequest()
    xhr.open('GET', dataURL, true)
    xhr.responseType = 'arraybuffer'

    xhr.onload = function (e) {
      const rawData = new Int32Array(this.response)
      const data = new Float32Array(rawData.length)
      const addedDataCount = rawData.length / 2
      for (let i = 0; i < rawData.length; i += 2) {
        data[i] = rawData[i + 1] / 1e7
        data[i + 1] = rawData[i] / 1e7
      }

      myChart.appendData({
        seriesIndex: 0,
        data
      })

      fetchData(idx + 1, myChart)
    }

    xhr.send()
  }

  useEffect(() => {
    const chartDom = document.getElementById('mapContent')
    const option = {
      backgroundColor: '#000',
      title: {
        text: '',
        left: 'center',
        textStyle: {
          color: '#fff'
        }
      },
      geo: {
        map: 'world',
        roam: true,
        label: {
          emphasis: {
            show: false
          }
        },
        silent: true,
        itemStyle: {
          normal: {
            areaColor: '#323c48',
            borderColor: '#111'
          },
          emphasis: {
            areaColor: '#2a333d'
          }
        }
      },
      series: [{
        name: '弱',
        type: 'scatterGL',
        progressive: 1e6,
        coordinateSystem: 'geo',
        symbolSize: 1,
        zoomScale: 0.002,
        blendMode: 'lighter',
        large: true,
        itemStyle: {
          color: 'rgb(20, 15, 2)'
        },
        postEffect: {
          enable: true
        },
        silent: true,
        dimensions: ['lng', 'lat'],
        data: new Float32Array()
      }]
    }
    if (chartDom) {
      const myChart = echarts.init(chartDom)
      myChart.clear()
      fetchData(0, myChart)
      myChart.setOption(option)
      myChart.resize()
    }
  }, [])
  return (
    <div className="page page-index">
      <Header />
      <section className="page-index-content">
        <ul>
          <li>
            <Link to="/main/demo">
              demo
            </Link>
          </li>
        </ul>
      </section>
      <div id="mapContent" className="map-content"></div>
    </div>
  )
}
