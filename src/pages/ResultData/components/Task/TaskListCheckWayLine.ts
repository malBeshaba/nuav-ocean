import * as Cesium from 'cesium'
import { WayLinePointUpload } from '@/store/types/wayline'
import {CesiumFlyTo, DrawPolyline, RemoveEntitiesByBatch} from '@/components/mapTools/BaseMapTools'
import { DrawWayLinePoint } from '@/components/mapTools/BaseMapToolsCreatePoint'
import {NotFlyPolylineLabel} from '@/components/mapTools/mapMaterial/mapMaterialStyle'

// 成果查询航线
const polylineLabel = new Cesium.PolylineDashMaterialProperty({
  color: Cesium.Color.fromCssColorString('#65DDBC'),
  dashLength: 30.0,
  dashPattern: 255.0,
})

let TaskListWayLines = { isShow: false, id: 'null', points: [] as WayLinePointUpload[] }

export function TaskListCheckWayLine (wayLinePointData: WayLinePointUpload[], globalParamsId: string) {
  if(TaskListWayLines.id === globalParamsId) {
    if(TaskListWayLines.isShow) {
      RemoveEntitiesByBatch(window.cesiumViewer, 'ResultData')
      TaskListWayLines.isShow = false
    } else {
      RemoveEntitiesByBatch(window.cesiumViewer, 'ResultData')
      drawWayLine(window.cesiumViewer, TaskListWayLines.points)
      TaskListWayLines.isShow = true
    }
  } else {
    TaskListWayLines.id = globalParamsId
    TaskListWayLines.isShow = true
    TaskListWayLines.points = wayLinePointData
    RemoveEntitiesByBatch(window.cesiumViewer, 'ResultData')
    drawWayLine(window.cesiumViewer, TaskListWayLines.points)
  }
  let offsetY = 0
  CesiumFlyTo(window.cesiumViewer, {longitude:wayLinePointData[0].pointX, latitude:wayLinePointData[0].pointY - offsetY, height: 2000})
}

function drawWayLine(mapViewer:Cesium.Viewer, wayLinePointDataByUpload: WayLinePointUpload[]) {
  let tmpPointArr = [] as number[]
  TaskListWayLines.points.sort((a, b) => a.pIndex - b.pIndex)
  wayLinePointDataByUpload.forEach((item: WayLinePointUpload, index) => {
    tmpPointArr.push(item.pointX)
    tmpPointArr.push(item.pointY)
    tmpPointArr.push(item.executeHeight  + 39)
    const point = [item.pointX, item.pointY, item.executeHeight + 39]
    DrawWayLinePoint(mapViewer, 'ResultDataPoint', index + 1, point)
  })
  DrawPolyline(mapViewer, 'ResultData', tmpPointArr, NotFlyPolylineLabel)
}
