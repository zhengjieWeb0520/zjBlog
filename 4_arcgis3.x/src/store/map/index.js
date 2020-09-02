/*
 * @Author: 郑杰14
 * @Date: 2020-06-11 14:00:15
 * @LastEditors: 郑杰14
 * @LastEditTime: 2020-08-27 10:52:53
 * @Description: 地图reduce
 */
import esriLoader from 'esri-loader'
import NewMap from '../../utils/arcgis3x/arcgisTool'

const INIT_MAP = 'INIT_MAP'

const initState = {
  mapView: {} // 地图对象
}

export function main (state = initState, action) {
  switch (action.type) {
    case INIT_MAP:
      return {
        ...state,
        mapView: action.data
      }
    default:
      return state
  }
}

export function initMap (domID, center, zoom, baseMapType, mapType, urls) {
  return dispatch => {
    const mapOption = {
      url: 'http://www.zjmap88.site/arcgis_js_api/library/3.26/3.26/init.js'
    }
    esriLoader
      .loadModules(
        [
          'esri/map',
          'esri/layers/gaodeLayer',
          'esri/layers/googleLayer',
          'esri/layers/FeatureLayer',
          'esri/layers/GraphicsLayer',
          'esri/layers/ArcGISTiledMapServiceLayer',
          'esri/layers/ArcGISDynamicMapServiceLayer',
          'esri/layers/WMSLayer',
          'esri/layers/WMSLayerInfo',
          'esri/layers/MapImageLayer',
          'esri/layers/MapImage',
          'esri/SpatialReference',
          'esri/symbols/SimpleLineSymbol',
          'esri/symbols/SimpleFillSymbol',
          'esri/symbols/SimpleMarkerSymbol',
          'esri/tasks/QueryTask',
          'esri/tasks/query',
          'esri/layers/LabelClass',
          'esri/symbols/Font',
          'esri/Color',
          'esri/renderers/UniqueValueRenderer',
          'esri/symbols/TextSymbol',
          'esri/layers/ArcGISImageServiceLayer',
          'esri/layers/RasterFunction',
          'esri/tasks/IdentifyTask',
          'esri/tasks/IdentifyParameters',
          'esri/layers/ImageServiceParameters',
          'esri/tasks/ImageServiceIdentifyTask',
          'esri/tasks/ImageServiceIdentifyParameters',
          'esri/layers/WebTiledLayer',
          'esri/layers/TileInfo',
          'esri/toolbars/draw',
          'esri/dijit/Popup',
          'dojo/dom-construct',
          'esri/graphic',
          'esri/geometry/Point',
          'esri/geometry/Polyline',
          'esri/geometry/Polygon',
          'esri/tasks/GeometryService',
          'esri/tasks/LengthsParameters',
          'esri/tasks/AreasAndLengthsParameters',
          'esri/dijit/PopupTemplate',
          'widgets/FlareClusterLayer_v3',
          'esri/renderers/ClassBreaksRenderer',
          'esri/geometry/Extent',
          'esri/geometry/ScreenPoint',
          'esri/layers/MosaicRule',
          'esri/geometry/webMercatorUtils',
          'esri/geometry/geometryEngine',
          'esri/tasks/FeatureSet',
          'esri/renderers/HeatmapRenderer',
          'esri/config'
        ],
        mapOption
      ).then(([
        map,
        gaodeLayer,
        googleLayer,
        FeatureLayer,
        GraphicsLayer,
        ArcGISTiledMapServiceLayer,
        ArcGISDynamicMapServiceLayer,
        WMSLayer,
        WMSLayerInfo,
        MapImageLayer,
        MapImage,
        SpatialReference,
        SimpleLineSymbol,
        SimpleFillSymbol,
        SimpleMarkerSymbol,
        QueryTask,
        query,
        LabelClass,
        Font,
        Color,
        UniqueValueRenderer,
        TextSymbol,
        ArcGISImageServiceLayer,
        RasterFunction,
        IdentifyTask,
        IdentifyParameters,
        ImageServiceParameters,
        ImageServiceIdentifyTask,
        ImageServiceIdentifyParameters,
        WebTiledLayer,
        TileInfo,
        draw,
        Popup,
        domConstruct,
        Graphic,
        Point,
        Polyline,
        Polygon,
        GeometryService,
        LengthsParameters,
        AreasAndLengthsParameters,
        PopupTemplate,
        FlareClusterLayer,
        ClassBreaksRenderer,
        Extent,
        ScreenPoint,
        MosaicRule,
        WebMercatorUtils,
        geometryEngine,
        FeatureSet,
        HeatmapRenderer,
        esriConfig
      ]) => {
        const initMap = {
          domID,
          center,
          zoom,
          baseMapType,
          mapType,
          urls
        }
        const mapControl = new NewMap(
          initMap,
          map,
          gaodeLayer,
          googleLayer,
          FeatureLayer,
          GraphicsLayer,
          ArcGISTiledMapServiceLayer,
          ArcGISDynamicMapServiceLayer,
          WMSLayer,
          WMSLayerInfo,
          MapImageLayer,
          MapImage,
          SpatialReference,
          SimpleLineSymbol,
          SimpleFillSymbol,
          SimpleMarkerSymbol,
          QueryTask,
          query,
          LabelClass,
          Font,
          Color,
          UniqueValueRenderer,
          TextSymbol,
          ArcGISImageServiceLayer,
          RasterFunction,
          IdentifyTask,
          IdentifyParameters,
          ImageServiceParameters,
          ImageServiceIdentifyTask,
          ImageServiceIdentifyParameters,
          WebTiledLayer,
          TileInfo,
          draw,
          Popup,
          domConstruct,
          Graphic,
          Point,
          Polyline,
          Polygon,
          GeometryService,
          LengthsParameters,
          AreasAndLengthsParameters,
          PopupTemplate,
          FlareClusterLayer,
          ClassBreaksRenderer,
          Extent,
          ScreenPoint,
          MosaicRule,
          WebMercatorUtils,
          geometryEngine,
          FeatureSet,
          HeatmapRenderer
        )
        dispatch({ type: INIT_MAP, data: mapControl })
      })
  }
}
