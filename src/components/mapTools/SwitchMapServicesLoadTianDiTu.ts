import * as Cesium from "cesium";

export async function loadTianDiTu3DTerrain(mapViewer: Cesium.Viewer) {
  const tdtUrl = 'https://t{s}.tianditu.gov.cn/'
  const subdomains = ['0', '1', '2', '3', '4', '5', '6', '7']

  // 叠加影像服务
  const imgMapImage = new Cesium.UrlTemplateImageryProvider({
    url: tdtUrl + 'DataServer?T=img_w&x={x}&y={y}&l={z}&tk=' + import.meta.env.VITE_TIANDITU_TOKEN,
    subdomains: subdomains,
    tilingScheme: new Cesium.WebMercatorTilingScheme(),
    maximumLevel: 18,
  })
  mapViewer.imageryLayers.addImageryProvider(imgMapImage)

  // 叠加国界服务
  const iboMap = new Cesium.UrlTemplateImageryProvider({
    url: tdtUrl + 'DataServer?T=ibo_w&x={x}&y={y}&l={z}&tk=' + import.meta.env.VITE_TIANDITU_TOKEN,
    subdomains: subdomains,
    tilingScheme: new Cesium.WebMercatorTilingScheme(),
    maximumLevel: 10
  });
  mapViewer.imageryLayers.addImageryProvider(iboMap)

  // 天地图影像标记图层
  const wtfs = new Cesium.WebMapTileServiceImageryProvider({
    url: tdtUrl + "cia_w/wmts?tk=" + import.meta.env.VITE_TIANDITU_TOKEN,
    subdomains: subdomains,
    layer: "cia",
    style: "default",
    tileMatrixSetID: "w",
    format: "tiles",
    maximumLevel: 18,
  })
  mapViewer.imageryLayers.addImageryProvider(wtfs)

  // const wmsImage = new Cesium.WebMapServiceImageryProvider({
  //   url: 'http://218.192.100.219:8600/geoserver/bdmapservice/wms',
  //   layers: 'bdmapservice:DOM',
  //   parameters: {
  //     service: 'WMS',
  //     format: 'image/png',
  //     transparent: true,
  //     srs: 'EPSG:4326',
  //     version: '1.1.0',
  //   }
  // })
  // mapViewer.imageryLayers.addImageryProvider(wmsImage)
  // const WMTSImage = new Cesium.WebMapTileServiceImageryProvider({
  //   url: 'http://218.192.100.219:8600/geoserver/gwc/service/wmts/rest/bdmapservice:DOM/{style}/{TileMatrixSet}/{TileMatrixSet}:{TileMatrix}/{TileRow}/{TileCol}?format=image/png',
  //   layer: 'bdmapservice:DOM',
  //   style: 'raster',
  //   format: 'image/png',
  //   tileMatrixSetID: 'EPSG:900913',
  // })
  // mapViewer.imageryLayers.addImageryProvider(WMTSImage)

  // 加载地形
  mapViewer.terrainProvider = await Cesium.createWorldTerrainAsync({
    requestWaterMask: true,
    requestVertexNormals: true
  })

  // 地形
  // mapViewer.terrainProvider = await Cesium.CesiumTerrainProvider.fromUrl('http://localhost:9003/terrain/sQqjEBnE', {
  //   requestVertexNormals: true,
  // })

}


export function loadTianDiTuVector(mapViewer: Cesium.Viewer){
  const tdtUrl = 'https://t{s}.tianditu.gov.cn/'
  const subdomains = ['0', '1', '2', '3', '4', '5', '6', '7']
      //天地图矢量
      let tiandiVec = new Cesium.UrlTemplateImageryProvider({
        subdomains: subdomains,
        url: tdtUrl + 'DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=' + import.meta.env.VITE_TIANDITU_TOKEN,
        tilingScheme: new Cesium.WebMercatorTilingScheme(),
        maximumLevel: 18
    })
    mapViewer.imageryLayers.addImageryProvider(tiandiVec)

      // 天地图影像标记图层
  const wtfs = new Cesium.WebMapTileServiceImageryProvider({
    url: tdtUrl + "cia_w/wmts?tk=" + import.meta.env.VITE_TIANDITU_TOKEN,
    subdomains: subdomains,
    layer: "cia",
    style: "default",
    tileMatrixSetID: "w",
    format: "tiles",
    maximumLevel: 18,
  })
  mapViewer.imageryLayers.addImageryProvider(wtfs)
}
