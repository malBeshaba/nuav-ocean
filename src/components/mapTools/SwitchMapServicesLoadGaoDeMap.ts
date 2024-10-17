import * as Cesium from "cesium";
//@ts-ignore
import { AmapImageryProvider, BaiduImageryProvider, GeoVisImageryProvider }  from '@dvgis/cesium-map'

export function gaode2DImage(mapViewer: Cesium.Viewer) {
  // 加载高德影像地图
  const optionsImg = {
    style: 'img',
    crs: 'WGS84',
  }
  mapViewer.imageryLayers.addImageryProvider(new AmapImageryProvider(optionsImg))
  const optionsCva = {
    style: 'cva',
    crs: 'WGS84',
  }
  mapViewer.imageryLayers.addImageryProvider(new AmapImageryProvider(optionsCva))
  // 加载高德标记要素
  // const wmfs = new Cesium.UrlTemplateImageryProvider({
  //   url: 'http://webst02.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8',
  //   minimumLevel: 2,
  //   maximumLevel: 18,
  // })
  // mapViewer.imageryLayers.addImageryProvider(wmfs)
}

export function gaoDe2DShp(mapViewer: Cesium.Viewer) {
  const optionsElec = {
    style: 'elec',
    crs: 'WGS84',
  }
  mapViewer.imageryLayers.addImageryProvider(new AmapImageryProvider(optionsElec))
  const optionsCva = {
    style: 'cva',
    crs: 'WGS84',
  }
  mapViewer.imageryLayers.addImageryProvider(new AmapImageryProvider(optionsCva))
}
