import React, { useState, Component } from 'react'
import esriLoader from 'esri-loader'
import { Select } from 'antd'
import axios from 'axios'
import CodeBtn from '../../../template/codeBtn'
import CodeSource from '../../../template/codeSource'
import demoCodes from './code/codes.md'

const Option = Select.Option

/* 工具栏 */
function Toolbar (props) {
  // 底图数组属性
  const { allBaseLayer } = props
  const [mapType, setMapType] = useState('blue')
  const toolbarStyle = {
    position: 'absolute',
    right: '1rem',
    top: '0.2rem',
    zIndex: 999
  }
  /**
   * 底图切换
   * @param {*} type
   */
  const handleChange = (type) => {
    allBaseLayer.forEach(item => {
      console.warn(item.id)
      if (item.id.indexOf(type) > 0) {
        item.show()
      } else {
        item.hide()
      }
    })
    setMapType(type)
  }
  return (
    <div className="toolbar" style={toolbarStyle}>
      <Select
        style={{ width: '0.8rem' }}
        value={mapType}
        onChange={handleChange}
      >
        <Option key="blue" value="blue">
          蓝色系
        </Option>
        <Option key="warm" value="warm">
          暖色系
        </Option>
        <Option key="terrain" value="terrain">
          地形系
        </Option>
      </Select>
    </div>
  )
}

/* 加载底图 */
export default class InitMap extends Component {
  constructor (props) {
    super(props)
    this.allBaseLayer = [] // 底图数组
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
          zoom: 8,
          center: [119, 32],
          // infoWindow: this.popup,
          minZoom: 2, // 最小空间等级
          maxZoom: 10 // 最大空间等级
        })

        // 定义图层url
        const blueUrl = 'http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer'
        const warmUrl = 'http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetWarm/MapServer'
        const terrainUrl = 'http://map.geoq.cn/arcgis/rest/services/ChinaOnlineCommunity/MapServer'
        // 定义图层对象
        const blueLayer = new ArcGISTiledMapServiceLayer(blueUrl, {
          id: 'arcgis_blue',
          visible: true
        })

        const warmLayer = new ArcGISTiledMapServiceLayer(warmUrl, {
          id: 'arcgis_warm',
          visible: false
        })

        const terrainLayer = new ArcGISTiledMapServiceLayer(terrainUrl, {
          id: 'arcgis_terrain',
          visible: false
        })

        this.allBaseLayer = [blueLayer, warmLayer, terrainLayer]
        mapView.addLayers(this.allBaseLayer)
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
        <Toolbar mapView={mapView} allBaseLayer={this.allBaseLayer}/>
      </div>
    )
  }
}
