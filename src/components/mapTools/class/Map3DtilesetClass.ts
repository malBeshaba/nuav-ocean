import * as Cesium from 'cesium'

export class TilesetData {
  id: string
  tilesetUrl: string
  mapViewer: Cesium.Viewer | undefined
  tilesetPrimitive: any

  constructor(options: any) {
    this.id = options.id
    this.tilesetUrl = options.tilesetUrl
    this.mapViewer = options.mapViewer
    this.InitTileset().then(r => {
      this.show(options.show)
    })
  }

  async InitTileset() {
    const tileSet = await Cesium.Cesium3DTileset.fromUrl(
      this.tilesetUrl, {
        projectTo2D: true,
        maximumMemoryUsage: 10240,
          // dynamicScreenSpaceError: true,
          // dynamicScreenSpaceErrorHeightFalloff: 1,
          // maximumScreenSpaceError: 16,
      })
    this.tilesetPrimitive = this.mapViewer?.scene.primitives.add(tileSet)
    await this.mapViewer?.zoomTo(tileSet)
  }

  show(value:boolean){
    this.tilesetPrimitive.show=value
  }

  destroy() {
    if(this.tilesetPrimitive){
      this.mapViewer?.scene.primitives.remove(this.tilesetPrimitive)
      this.tilesetPrimitive = null
    }
  }
}
