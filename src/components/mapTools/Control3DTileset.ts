import * as Cesium from 'cesium'

var scnutile: any
var scnu1tile:any
export async function check3DTileSetscnu(mapViewer:Cesium.Viewer, tileUrl:string,value:boolean) {
    const  tileSet = await Cesium.Cesium3DTileset.fromUrl(
        tileUrl, {
            projectTo2D: true,
        })
    if(value){
        scnutile=mapViewer.scene.primitives.add(tileSet)
    }else{
        mapViewer.scene.primitives.remove(scnutile)
        tileSet.show=false;
    }
    return tileSet
}
export async function check3DTileSetscnusecond(mapViewer:Cesium.Viewer, tileUrl:string,value:boolean) {
    const  tileSet = await Cesium.Cesium3DTileset.fromUrl(
        tileUrl, {
            projectTo2D: true,
        })
    if(value){
        scnu1tile=mapViewer.scene.primitives.add(tileSet)
    }else{
        mapViewer.scene.primitives.remove(scnu1tile)
        tileSet.show=false;
    }
    return tileSet
}