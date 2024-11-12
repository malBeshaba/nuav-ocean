import * as Cesium from 'cesium'
import {getWaylineById, getWaylineGlobalParamsByWaylineId, Placemark, templateContent} from "@/api/wayline";
import { getWayLinePointByGlobalParamsId } from '@/api/wayLinePoint'
import { WayLinePointUpload } from '@/store/types/wayline'
import {
  CesiumSetViewByRectangle,
  DrawPolyline,
  RemoveEntitiesByBatch,
} from '@/components/mapTools/BaseMapTools'
import { DrawWayLinePoint } from '@/components/mapTools/BaseMapToolsCreatePoint'
import {NotFlyPolylineLabel} from '@/components/mapTools/mapMaterial/mapMaterialStyle';


let wayLinePointsGlobalParamsId = {isShow: false, id: 'null', points: [] as WayLinePointUpload[], pointV2: {} as templateContent}

const polylineLabel = new Cesium.PolylineDashMaterialProperty({
  color: Cesium.Color.fromCssColorString('#65DDBC'),
  dashLength: 30.0,
  dashPattern: 255.0,
})

function drawWayLIne (mapViewer:Cesium.Viewer) {
  let pointArr = [] as number[]
  wayLinePointsGlobalParamsId.points.sort((a, b) => a.pIndex - b.pIndex)
  wayLinePointsGlobalParamsId.points.forEach((item: WayLinePointUpload, index) => {
    pointArr.push(item.pointX)
    pointArr.push(item.pointY)
    pointArr.push(item.executeHeight  + 39)
    const point = [item.pointX, item.pointY, item.executeHeight + 39]
    DrawWayLinePoint(mapViewer, 'checkWayLinePoint', index + 1, point)
  })
  DrawPolyline(mapViewer, 'checkWayLine', pointArr, NotFlyPolylineLabel)
  wayLinePointsGlobalParamsId.isShow = true
}

function drawWayLineV2 (mapViewer:Cesium.Viewer) {
  let placemark = wayLinePointsGlobalParamsId.pointV2.Folder.placemark.sort((a: Placemark, b: Placemark) => a.index - b.index)
  let pointArr = [] as number[]
  let line = [] as number[][]
  placemark.forEach((item: Placemark, index: number) => {
    const tmpPoint = item.Point.coordinates.split(',')
    pointArr.push(Number(tmpPoint[0]))
    pointArr.push(Number(tmpPoint[1]))
    line.push([Number(tmpPoint[0]), Number(tmpPoint[1])])
    pointArr.push(Number(item.executeHeight))
    const point = [Number(tmpPoint[0]), Number(tmpPoint[1]), Number(item.executeHeight)]
    DrawWayLinePoint(mapViewer, 'checkWayLinePoint', index + 1, point)
  })
  DrawPolyline(mapViewer, 'checkWayLine', pointArr, NotFlyPolylineLabel)
  wayLinePointsGlobalParamsId.isShow = true
  CesiumSetViewByRectangle(window.cesiumViewer, line, [200, 100, 200, 100])
}

/**
 *
 * @param mapViewer | 需要操作的地图图层
 * @param wayLineID | 当前查看航线的ID
 * @param isCancel | 判断是否为返回上一层级，true为返回上一层级，false为查看当前航线
 * @constructor
 */
export function CheckWayLine(mapViewer:Cesium.Viewer, wayLineID: string, isCancel: boolean) {
  if (!isCancel) {
    getWaylineGlobalParamsByWaylineId(wayLineID).then((res) => {
      if(res.code === 0) {
        if(res.data === '') {
          // console.log('get', res.data, wayLineID)
          if (wayLinePointsGlobalParamsId.id === wayLineID) {
            if (wayLinePointsGlobalParamsId.isShow) {
              RemoveEntitiesByBatch(mapViewer, 'checkWayLine')
              wayLinePointsGlobalParamsId.isShow = false
            } else {
              drawWayLineV2(mapViewer)
            }
          } else {
            wayLinePointsGlobalParamsId.id = wayLineID
            wayLinePointsGlobalParamsId.isShow = false
            RemoveEntitiesByBatch(mapViewer, 'checkWayLine')
            getWaylineById(wayLineID).then((res2) => {
              if(res.code === 0) {
                wayLinePointsGlobalParamsId.pointV2 = res2.data.templateContent
                drawWayLineV2(mapViewer)
              } else {
                ElMessage.error('网络错误，请稍后重试')
              }
            })
          }
        } else {
          if (wayLinePointsGlobalParamsId.id === wayLineID) {
            if (wayLinePointsGlobalParamsId.isShow) {
              RemoveEntitiesByBatch(mapViewer, 'checkWayLine')
              wayLinePointsGlobalParamsId.isShow = false
            } else {
              drawWayLIne(mapViewer)
            }
          } else {
            RemoveEntitiesByBatch(mapViewer, 'checkWayLine')
            getWayLinePointByGlobalParamsId(res.data.globalParamsId).then((res2) => {
              if (res2.code === 0) {
                if (res2.data.length !== 0) {
                  wayLinePointsGlobalParamsId.id = wayLineID
                  wayLinePointsGlobalParamsId.isShow = false
                  wayLinePointsGlobalParamsId.points = []
                  res2.data.forEach((item: any) => {
                    wayLinePointsGlobalParamsId.points.push(item)
                  })
                  drawWayLIne(mapViewer)
                } else {
                  ElMessage.error('该航线没有航点,请检查航线文件')
                }
              } else {
                ElMessage.error('网络错误，请稍后重试')
              }
            })
          }
        }
      }
  })
  } else {
    wayLinePointsGlobalParamsId.isShow = false
  }
}


