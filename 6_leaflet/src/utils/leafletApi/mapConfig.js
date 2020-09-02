// 在线高德地图
export const amapUrl = {
  digital: ['http://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}'],
  satellite: ['http://webst0{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}', 'http://webst0{s}.is.autonavi.com/appmaptile?style=8&x={x}&y={y}&z={z}'],
  subdomains: '1234'
}
// 在线谷歌地图
export const gmapUrl = {
  digital: ['http://www.google.cn/maps/vt?lyrs=m@189&gl=cn&x={x}&y={y}&z={z}'],
  satellite: ['http://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}', 'http://www.google.cn/maps/vt/lyrs=h@177000000&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}&s=Galil'],
  terrain: ['http://mt0.google.cn/vt/lyrs=t@132,r@292000000&hl=zh-CN&gl=cn&src=app&x={x}&y={y}&z={z}&scale=2&s=Gal', 'http://www.google.cn/maps/vt?lyrs=h@189&gl=cn&x={x}&y={y}&z={z}&scale=2&s='],
  subdomains: []
}
// 在线百度天地图
export const bmapUrl = {
  digital: ['http://t{s}.tianditu.cn/DataServer?T=vec_w&X={x}&Y={y}&L={z}', 'http://t{s}.tianditu.cn/DataServer?T=cva_w&X={x}&Y={y}&L={z}'],
  satellite: ['http://t{s}.tianditu.cn/DataServer?T=img_w&X={x}&Y={y}&L={z}', 'http://t{s}.tianditu.cn/DataServer?T=cva_w&X={x}&Y={y}&L={z}'],
  subdomains: ['0', '1', '2', '3', '4', '5', '6', '7']
}
// GIS地图
export const gisUrl = {
  digital: ['http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetColor/MapServer/tile/{z}/{y}/{x}'],
  satellite: ['http://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', 'https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}']
}
export const defaultCenter = [31.335, 120.591]
export const defaultZoom = 6
