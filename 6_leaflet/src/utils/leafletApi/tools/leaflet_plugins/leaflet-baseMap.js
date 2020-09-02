/*
 * @Author: 郑杰14
 * @Date: 2020-07-08 09:18:25
 * @LastEditors: 郑杰14
 * @LastEditTime: 2020-09-02 10:37:50
 * @Description: leaflet 底图扩展
 */
L.TileLayer.ChinaProvider = L.TileLayer.extend({
  initialize: function (type, options) {
    // (type, Object)
    var providers = L.TileLayer.ChinaProvider.providers
    var parts = type.split('.')
    var providerName = parts[0]
    var mapName = parts[1]
    var mapType = parts[2]
    var url = providers[providerName][mapName][mapType]
    options.subdomains = providers[providerName].Subdomains

    L.TileLayer.prototype.initialize.call(this, url, options)
  }
})

L.TileLayer.ChinaProvider.providers = {
  GaoDe: {
    Normal: {
      Map:
        'http://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}'
    },
    Satellite: {
      Map:
        'http://webst0{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
      Annotion:
        'http://webst0{s}.is.autonavi.com/appmaptile?style=8&x={x}&y={y}&z={z}'
    },
    Subdomains: ['1', '2', '3', '4']
  },

  Google: {
    Normal: {
      Map: 'https://mt3.google.cn/vt/lyrs=m@226000000&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}&s=Gali'
    },
    Terrain: {
      // Map: 'http://www.google.cn/maps/vt?lyrs=t@189&gl=cn&x={x}&y={y}&z={z}',
      Map:
        'http://mt0.google.cn/vt/lyrs=t@132,r@292000000&hl=zh-CN&gl=cn&src=app&x={x}&y={y}&z={z}&scale=2&s=Gal',
      Annotion:
        'https://mt2.google.cn/vt/lyrs=h@177000000&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}&s=Gali'
    },
    Satellite: {
      Map: 'https://mt2.google.cn/vt/lyrs=s@157&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}&s=Gali',
      Annotion:
        'https://mt2.google.cn/vt/lyrs=h@177000000&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}&s=Gali'
    },
    Subdomains: []
  },
  Baidu: {
    Normal: {
      Map:
        'http://online{s}.map.bdimg.com/tile/?qt=tile&x={x}&y={y}&z={z}&styles=pl&udt=20180518'
    },
    Subdomains: [0, 1, 2]
  },
  TMap: {
    Normal: {
      Map:
        'http://rt1.map.gtimg.com/realtimerender/?z={z}&x={x}&y={y}&type=vector&style=1&v=1.1.1'
    },
    Subdomains: [0, 1, 2]
  },
  Arcgis: {
    Normal: {
      Map:
        'http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineCommunity/MapServer/tile/{z}/{y}/{x}',
      PurplishBlue:
        'http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}',
      Gray:
        'http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetGray/MapServer/tile/{z}/{y}/{x}',
      Warm:
        'http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetWarm/MapServer/tile/{z}/{y}/{x}'
    },
    Satellite: {
      Map:
        'http://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      Annotion:
        'https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}'
    },
    Subdomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7']
  },
  TdtOnline: {
    Normal: {
      Map: 'http://t0.tianditu.gov.cn/vec_c/wmts?service=wmts&request=GetTile&version=1.0.0' +
        '&LAYER=vec&tileMatrixSet=c&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}' +
        '&style=default&format=tiles&tk=4aef299f1178a8329a9cdc325a055b85',
      Annotion: 'http://t0.tianditu.gov.cn/cva_c/wmts?service=wmts&request=GetTile&version=1.0.0' +
        '&LAYER=cva&tileMatrixSet=c&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}' +
        '&style=default.jpg&tk=4aef299f1178a8329a9cdc325a055b85'
    },
    Satellite: {
      Map: 'http://t0.tianditu.gov.cn/img_c/wmts?service=wmts&request=GetTile&version=1.0.0' +
        '&LAYER=img&tileMatrixSet=c&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}' +
        '&style=default&format=tiles&tk=4aef299f1178a8329a9cdc325a055b85',
      Annotion: 'http://t0.tianditu.gov.cn/cia_c/wmts?service=wmts&request=GetTile&version=1.0.0' +
        '&LAYER=cia&tileMatrixSet=c&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}' +
        '&style=default.jpg&tk=4aef299f1178a8329a9cdc325a055b85'
    },
    Subdomains: []
  },
  TtdMector: {
    Normal: {
      Map: 'https://t{s}.tianditu.gov.cn/vec_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=4aef299f1178a8329a9cdc325a055b85',
      Annotion: 'https://t{s}.tianditu.gov.cn/cva_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=4aef299f1178a8329a9cdc325a055b85'
    },
    Satellite: {
      Map: 'https://t{s}.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=4aef299f1178a8329a9cdc325a055b85',
      Annotion: 'https://t{s}.tianditu.gov.cn/cia_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cia&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=4aef299f1178a8329a9cdc325a055b85'
    },
    Terrain: {
      Map: 'https://t{s}.tianditu.gov.cn/ter_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=ter&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=4aef299f1178a8329a9cdc325a055b85',
      Annotion: 'https://t{s}.tianditu.gov.cn/cta_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cta&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=4aef299f1178a8329a9cdc325a055b85'
    },
    Subdomains: ['0', '1', '2', '3', '4', '5', '6', '7']
  },
  Open: {
    Normal: {
      Map:
        'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw'
    },
    Subdomains: []
  }
}

L.tileLayer.chinaProvider = function (type, options) {
  return new L.TileLayer.ChinaProvider(type, options)
}
/* leaflet 底图扩展 */
