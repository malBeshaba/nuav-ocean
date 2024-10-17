import * as Cesium from 'cesium'

export async function load3DTileset(mapViewer:Cesium.Viewer, tileUrl:string) {
  const tileSet = await Cesium.Cesium3DTileset.fromUrl(
      tileUrl, {
    projectTo2D: true,
  })
  mapViewer.scene.primitives.add(tileSet)
  await mapViewer.zoomTo(tileSet)
  return tileSet
}

export function remove3DTileSet(mapViewer:Cesium.Viewer) {
  // mapViewer.scene.primitives.remove(tileSet11)
}
