import React, { useState, Component } from 'react'
import esriLoader from 'esri-loader'
import { Button } from 'antd'
import axios from 'axios'
import CodeBtn from '../../../template/codeBtn'
import CodeSource from '../../../template/codeSource'
import demoCodes from './code/codes.md'

/* 工具栏 */
function Toolbar (props) {
  // 底图数组属性
  const { mapView } = props
  const toolbarStyle = {
    position: 'absolute',
    right: '1rem',
    top: '0.2rem',
    zIndex: 999
  }
  /**
   * 点击操作
   * @param {*}
   */
  const addLayer = () => {
    esriLoader
      .loadModules([
        'esri/layers/GraphicsLayer',
        'esri/graphic',
        'esri/InfoTemplate'
      ])
      .then(([
        GraphicsLayer,
        Graphic,
        InfoTemplate
      ]) => {
        const polygonLayer = new GraphicsLayer({
          id: 'polygonLayer'
        })
        mapView.addLayer(polygonLayer)
        const polygonData = [
          {
            name: '南京市->扬州市->苏州市',
            rings: [
              [
                [
                  120.3425496100001,
                  31.529360250000025
                ],
                [
                  120.34925952967012,
                  31.52547346548397
                ],
                [
                  120.352531288553,
                  31.521606841349467
                ],
                [
                  120.35282872117887,
                  31.51803764984072
                ],
                [
                  120.34836723179296,
                  31.515063323583433
                ],
                [
                  120.34390574240706,
                  31.512683862577603
                ],
                [
                  120.34331087715555,
                  31.509709536320315
                ],
                [
                  120.34658263603842,
                  31.504653181682954
                ],
                [
                  120.34925952967012,
                  31.497514798665463
                ],
                [
                  120.3507466927988,
                  31.485617493636312
                ],
                [
                  120.3507466927988,
                  31.475207351735776
                ],
                [
                  120.35015182754717,
                  31.47134072760133
                ],
                [
                  120.3507466927988,
                  31.4689612665955
                ],
                [
                  120.35669534531337,
                  31.469556131846957
                ],
                [
                  120.37721819648868,
                  31.47372018860716
                ],
                [
                  120.38167968587459,
                  31.472827890729945
                ],
                [
                  120.38524887738333,
                  31.468068968718285
                ],
                [
                  120.390007799395,
                  31.45914598994642
                ],
                [
                  120.40041794129547,
                  31.450817876426015
                ],
                [
                  120.40562356601822,
                  31.44607157153183
                ],
                [
                  120.3512567900001,
                  31.41850863000002
                ],
                [
                  120.34630899802289,
                  31.42394186436519
                ],
                [
                  120.3348875851949,
                  31.432507923986122
                ],
                [
                  120.3208487652604,
                  31.439646307003613
                ],
                [
                  120.29324701759288,
                  31.451781558133234
                ],
                [
                  120.28896398778227,
                  31.4560645879439
                ],
                [
                  120.28634658067585,
                  31.460347617754337
                ],
                [
                  120.28587068847469,
                  31.478907413599813
                ],
                [
                  120.27254570684215,
                  31.488425257623135
                ],
                [
                  120.2689765153334,
                  31.49223239523235
                ],
                [
                  120.26826267703166,
                  31.500322562652286
                ],
                [
                  120.26778678483049,
                  31.521499765604233
                ],
                [
                  120.26873856923271,
                  31.532445286230995
                ],
                [
                  120.27540106004915,
                  31.540535453650875
                ],
                [
                  120.28189513834491,
                  31.54490032594805
                ],
                [
                  120.28323507999994,
                  31.53732302000003
                ],
                [
                  120.28734978,
                  31.537275299999976
                ],
                [
                  120.28842373000009,
                  31.534352190000106
                ],
                [
                  120.29245645000015,
                  31.533451720000016
                ],
                [
                  120.29213450999998,
                  31.530311580000046
                ],
                [
                  120.29069977999995,
                  31.52786017000011
                ],
                [
                  120.29361287000006,
                  31.525619989999996
                ],
                [
                  120.29923042000019,
                  31.527130949999957
                ],
                [
                  120.30332610999994,
                  31.526964270000065
                ],
                [
                  120.30542235000007,
                  31.528577960000007
                ],
                [
                  120.30692675,
                  31.52372242000007
                ],
                [
                  120.30548293000004,
                  31.52228973000001
                ],
                [
                  120.30289126000002,
                  31.521975640000107
                ],
                [
                  120.30271736000009,
                  31.51942535000012
                ],
                [
                  120.30665723000004,
                  31.51603257000005
                ],
                [
                  120.30903185000011,
                  31.515252950000047
                ],
                [
                  120.31752236,
                  31.51585534999998
                ],
                [
                  120.31894035999994,
                  31.515100660000087
                ],
                [
                  120.32109744000013,
                  31.518921730000045
                ],
                [
                  120.32590843000003,
                  31.52083052000006
                ],
                [
                  120.32709189000013,
                  31.52453356000001
                ],
                [
                  120.32951016000004,
                  31.528142710000054
                ],
                [
                  120.33346849999998,
                  31.531160130000103
                ],
                [
                  120.3425496100001,
                  31.529360250000025
                ]
              ]
            ]
          },
          {
            name: '徐州->淮安市->盐城',
            rings: [
              [
                [117.184811, 34.261792],
                [119.021265, 33.597506],
                [120.139998, 33.377631],
                [117.184811, 34.261792]
              ]
            ]
          }
        ]
        polygonData.forEach((item) => {
          // 定义属性
          const attributes = { name: item.name }
          // 定义弹框
          const infoTemplate = new InfoTemplate('Vernal Pool Locations')
          // 定义图形
          const polygon = {
            geometry: {
              paths: item.rings,
              spatialReference: { wkid: 4326 }
            },
            symbol: {
              color: [0, 0, 0, 0],
              outline: {
                color: [255, 255, 255, 255],
                width: 2,
                type: 'esriSLS',
                style: 'esriSLSSolid'
              },
              type: 'esriSFS',
              style: 'esriSFSSolid'
            },
            attributes,
            infoTemplate
          }

          const graphic = new Graphic(polygon)
          polygonLayer.add(graphic)
        })
      })
  }

  /**
   * 移除点图层
   */
  const removeLayer = () => {
    const polygonLayer = mapView.getLayer('polygonLayer')
    if (polygonLayer) {
      polygonLayer.clear() // 清除图形
      mapView.removeLayer(polygonLayer) // 移除图层
    }
  }
  return (
    <div className="toolbar" style={toolbarStyle}>
      <Button type="info" onClick={addLayer}>添加面</Button>
      <Button type="info" onClick={removeLayer}>移除面</Button>
    </div>
  )
}

/* 加载底图 */
export default class InitMap extends Component {
  constructor (props) {
    super(props)
    this.allBaseLayer = [] // 底图数组
    this.initCenter = [119, 32] // 初始化中心经纬度
    this.initZoom = 8 // 初始化缩放级别
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
        <Toolbar mapView={mapView} />
      </div>
    )
  }
}
