import * as Cesium from 'cesium'

// @ts-ignore
import droneModel from '@assets/models/airDrone.glb'
import {VideoFusion} from '@/components/mapTools/class/MapVideoFusionClass'
import {RemoveEntitiesByBatch} from '@/components/mapTools/BaseMapTools'
const polylineLabel = new Cesium.PolylineDashMaterialProperty({
  color: Cesium.Color.fromCssColorString('#65DDBC'),
  dashLength: 0.0,
  dashPattern: 255.0,
})

export function TrackPath(mapViewer:Cesium.Viewer, flyPathData: PointData[], flyPathId: string) {
  RemoveEntitiesByBatch(window.cesiumViewer, 'ResultPath')
  const position = new Cesium.SampledPositionProperty()
  const startTime = Cesium.JulianDate.now()
  const endTime = Cesium.JulianDate.addSeconds(startTime, flyPathData.length, new Cesium.JulianDate())
  let path: number[] = []
  console.log('flyPathData', flyPathData)
  flyPathData.forEach((item, index) => {
    const time = Cesium.JulianDate.addSeconds(startTime, index, new Cesium.JulianDate())
    const point = Cesium.Cartesian3.fromDegrees(Number(item.longitude), Number(item.latitude), Number(item.height))
    position.addSample(time, point)
    path.push(Number(item.longitude))
    path.push(Number(item.latitude))
    path.push(Number(item.height))
  })
  mapViewer.entities.add({
    id: flyPathId + 'wayLineResultPath',
    polyline: {
      width: 3,
      positions: Cesium.Cartesian3.fromDegreesArrayHeights(path),
      material: polylineLabel
    }
  })
  mapViewer.entities.add({
    position: position,
    id: flyPathId + 'droneResultData',
    model: {
      uri: droneModel,
      minimumPixelSize: 64,
      maximumScale: 20000,
    }
  })
  let index = 0


  // window.cesiumViewer.clock.startTime = startTime.clone()
  // window.cesiumViewer.clock.shouldAnimate = true
  // window.cesiumViewer.clock.multiplier = 1
  // let last_dis = Number.MAX_VALUE
  // window.cesiumViewer.clock.onTick.addEventListener(function () {
  //   let isThan = Cesium.JulianDate.greaterThanOrEquals(window.cesiumViewer.clock.currentTime.clone(), endTime.clone())
  //   let nowPosition = position.getValue(window.cesiumViewer.clock.currentTime.clone())
  //   let value = 0
  //   if (nowPosition !== undefined) {
  //     console.log('nowPosition', value, nowPosition)
  //     vf.update(nowPosition, [90, 180, 0])
  //   }
  // })

  // vf.update(position, [90, 180, 0])

}

export interface PointData {
  planId: string,
  longitude: number,
  latitude: number,
  height: number,
  attitudeHead: number,
  attitudePitch: number,
  attitudeRoll: number,
}
