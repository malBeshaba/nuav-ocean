import { ref, onMounted } from 'vue'
import * as Cesium from 'cesium'
import {getModelDataList, getResponseUrlData} from '@/api/modelData'
import { ModelData } from '@/store/types/modelData'
import { TilesetData } from '@/components/mapTools/class/Map3DtilesetClass'
import {NULL} from "sass";



let tileset = ref<{id: string, tilesetData: TilesetData, isShow: boolean}[]>([])
export async function Checktileset(mapViewer: Cesium.Viewer, tilesetData: any,iscancel:boolean) {
    if (!iscancel) {
        let isExist = false
        tileset.value.forEach((item) => {
            if (item.id === tilesetData.dataId) {
                isExist = true
                if (item.isShow) {
                    item.tilesetData.show(false)
                    item.isShow = false
                } else {
                    item.tilesetData.show(true)
                    item.isShow = true
                }
            }else{
                item.id=""
                item.tilesetData.destroy()
                item.isShow=false
            }
        })
        if (!isExist) {
            if (tilesetData.innerDataPath) {
                const check = await getResponseUrlData(tilesetData.innerDataPath);
                if (check) {
                    let addTilesetData = new TilesetData({
                        id: tilesetData.dataId,
                        tilesetUrl: tilesetData.innerDataPath,
                        show: true,
                        mapViewer: window.cesiumViewer,
                    })
                    console.log("内外网均正常----------------------------------------------", addTilesetData.tilesetUrl)
                    // tileset({
                    //
                    // })
                    tileset.value.push({
                        id: tilesetData.dataId,
                        tilesetData: addTilesetData,
                        isShow: true,
                    })
                } else{
                    let addTilesetData = new TilesetData({
                        id: tilesetData.dataId,
                        tilesetUrl: tilesetData.outerDataUrl,
                        show: true,
                        mapViewer: window.cesiumViewer,
                    })
                    console.log("内网错误----------------------------------------------", addTilesetData.tilesetUrl)
                    tileset.value.push({
                        id: tilesetData.dataId,
                        tilesetData: addTilesetData,
                        isShow: true,
                    })
                }
            }
            else {
                let addTilesetData = new TilesetData({
                    id: tilesetData.dataId,
                    tilesetUrl: tilesetData.outerDataUrl,
                    show: true,
                    mapViewer: window.cesiumViewer,
                })
                console.log("没有内网————————————————————————————————————————————————————")
                tileset.value.push({
                    id: tilesetData.dataId,
                    tilesetData: addTilesetData,
                    isShow: true,
                })
            }
            // let addTilesetData = new TilesetData({
            //   id: tilesetData.dataId,
            //   tilesetUrl: tilesetData.outerDataUrl,
            //   show: value,
            //   mapViewer: window.cesiumViewer,
            // })
            // tileset.value.push({
            //   id: tilesetData.dataId,
            //   tilesetData: addTilesetData,
            //   isShow: value,
            // })
        }
    }
}