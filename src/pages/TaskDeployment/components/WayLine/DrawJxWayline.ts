import * as Cesium from 'cesium'
import {
    DrawPolyline,
    RemoveEntitiesByBatch,
} from '@/components/mapTools/BaseMapTools'
import { DrawWayLinePoint } from '@/components/mapTools/BaseMapToolsCreatePoint'
import {getStrategyConfigDetail} from "@/api/jiexiang/jxDronePlan";

const polylineLabel = new Cesium.PolylineDashMaterialProperty({
    color: Cesium.Color.fromCssColorString('#65DDBC'),
    dashLength: 30.0,
    dashPattern: 255.0,
})

interface point {
    id: number,
    lng: number,
    lat: number,
    executeHeight: number
}

let waylineShape = {isShow: false, id: 'null', points: [] as point[]}

export function CheckWayLine(mapViewer: Cesium.Viewer, id: string, altitude: number,entitiesWaylineId: string,entitiesWaylinePointId: string) {

    // 如果已经绘制，直接移除
    if (waylineShape.id === id) {
        if (waylineShape.isShow) {
            RemoveEntitiesByBatch(mapViewer, entitiesWaylineId)
            waylineShape.isShow = false
            return
        }
    }

    getStrategyConfigDetail({id: id}).then((res) => {
        if (res.errorCode === '00000') {
            // 移除之前绘制的航线
            RemoveEntitiesByBatch(mapViewer, entitiesWaylineId)
            if (res.data.strategyPointConfigList.length !== 0) {
                waylineShape.id = id
                waylineShape.isShow = false
                waylineShape.points = []
                res.data.strategyPointConfigList.forEach((item: any) => {
                    let point = {} as point
                    point.id = item.sorts
                    point.lng = Number(item.lon)
                    point.lat = Number(item.lat)
                    // 如果没有高度，则使用全局高度
                    point.executeHeight = item.altitude ? Number(item.altitude) : altitude
                    waylineShape.points.push(point)
                })
                drawWayLine(mapViewer,entitiesWaylineId,entitiesWaylinePointId)
            }
        }
    })
}

function drawWayLine(mapViewer: Cesium.Viewer,entitiesWaylineId: string,entitiesWaylinePointId: string) {
    let pointArr = [] as number[]
    waylineShape.points.forEach((item: point, index) => {
        pointArr.push(item.lng)
        pointArr.push(item.lat)
        pointArr.push(item.executeHeight + 39)
        const point = [item.lng, item.lat, item.executeHeight + 39]
        DrawWayLinePoint(mapViewer, entitiesWaylinePointId, index + 1, point)
    })
    DrawPolyline(mapViewer, entitiesWaylineId, pointArr, polylineLabel)
    waylineShape.isShow = true
}

