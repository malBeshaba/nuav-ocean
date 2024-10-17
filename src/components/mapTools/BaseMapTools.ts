/**
 * @file 基础地图工具类
 * @desc 包含设置中心点；绘制点、线、面；根据ID移除点、线、面等方法
 */
import * as Cesium from 'cesium'

/**
 * 设置中心点
 * @param mapViewer:Cesium.Viewer 当前地图画布
 * @constructor
 * @param mapViewer
 * @param point
 * @param pitch
 * @param roll
 * @param heading
 */
export function CesiumFlyTo(mapViewer:Cesium.Viewer, point: { longitude: number; latitude: number; height: number | undefined; }, pitch = Cesium.Math.toRadians(-45), roll: number = 0, heading: number = 0) {
    mapViewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(point.longitude, point.latitude, point.height),
      orientation: {
        heading: heading,//Cesium.Math.toRadians(0), // 方位角
        pitch: pitch,// 倾斜角度
        roll: roll  //旋转角
      },
    })
}

/**
 *
 * @param mapViewer:Cesium.Viewer 当前地图画布
 * @param mapViewer
 * @param polylineId
 * @param polylinePoints
 * @param polylineLabel
 */
export function DrawPolyline(mapViewer:Cesium.Viewer, polylineId:string, polylinePoints: number[], polylineLabel: Cesium.PolylineDashMaterialProperty) {
  mapViewer.entities.add({
    id: polylineId,
    polyline: {
      positions: Cesium.Cartesian3.fromDegreesArrayHeights(polylinePoints, Cesium.Ellipsoid.WGS84,),
      width: 3,
      material: polylineLabel,
    },
  })
}

/**
 *
 * @param mapViewer:Cesium.Viewer 当前地图画布
 * @constructor
 * @param mapViewer
 * @param pointId
 * @param pointLocation
 * @param pointLabel
 */
export function DrawPoint(mapViewer:Cesium.Viewer, pointId:string, pointLocation: number[], pointLabel: Cesium.PointGraphics) {
  mapViewer.entities.add({
    id: pointId,
    position: Cesium.Cartesian3.fromDegrees(pointLocation[0], pointLocation[1], pointLocation[2]),
    point: pointLabel,
  })
}

/**
 * 根据图片绘制点
 * @param mapViewer:Cesium.Viewer 当前地图画布
 * @constructor
 * @param mapViewer
 * @param pointId
 * @param pointLocation
 * @param rotation
 * @param droneIcon
 */
export function DrawPointByBillboard(mapViewer:Cesium.Viewer, pointId:string, pointLocation: number[], rotation: number, droneIcon: string) {
  let cameraHeading = mapViewer.camera.heading
  let mapNorthAngle = Cesium.Math.toDegrees(cameraHeading)
  if (mapNorthAngle !== 360) {
    rotation = rotation + mapNorthAngle
  }
  const droneLabel = new Cesium.BillboardGraphics({
    image: droneIcon,
    color: Cesium.Color.WHITE.withAlpha(0.8),
    width: 30,
    height: 30,
    rotation: Cesium.Math.toRadians(rotation),
  })
  mapViewer.entities.add({
    id: pointId,
    position: Cesium.Cartesian3.fromDegrees(pointLocation[0], pointLocation[1], pointLocation[2]),
    billboard: droneLabel,
  })
}

export function DrawPointByGLB(mapViewer:Cesium.Viewer, pointId:string, pointLocation: number[], rotation: number, droneGLB: string) {
  let cameraHeading = mapViewer.camera.heading
  let mapNorthAngle = Cesium.Math.toDegrees(cameraHeading)
  if (mapNorthAngle !== 360) {
    rotation = rotation + mapNorthAngle
  }

  const hpr = new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(450 - rotation), 0, 0)
  const orientation = Cesium.Transforms.headingPitchRollQuaternion(Cesium.Cartesian3.fromDegrees(pointLocation[0], pointLocation[1], pointLocation[2]), hpr) as unknown as Cesium.Property
  mapViewer.entities.add({
    id: pointId,
    position: Cesium.Cartesian3.fromDegrees(pointLocation[0], pointLocation[1], pointLocation[2]),
    orientation: orientation,
    model: {
      uri: droneGLB,
      minimumPixelSize: 70,
      maximumScale: 20000,
    },
  })
}

export function DrawPolygon(mapViewer:Cesium.Viewer, polygonId:string, polygonPoints: number[]) {
  mapViewer.entities.add({
    id: polygonId,
    polygon: {
      hierarchy: Cesium.Cartesian3.fromDegreesArrayHeights(polygonPoints, Cesium.Ellipsoid.WGS84,),
      material: Cesium.Color.RED.withAlpha(0.5),
    },
  })
}
/**
 * 移除点、线、面
 * @param mapViewer:Cesium.Viewer 当前地图画布
 * @param entitiesId:string 对应ID
 * @constructor
 */
export function RemoveEntitiesById(mapViewer:Cesium.Viewer, entitiesId:string) {
  mapViewer.entities.removeById(entitiesId)
}

export function RemoveEntitiesByBatch(mapViewer:Cesium.Viewer, entitiesId:string) {
  let entity = mapViewer.entities.values
  let entitiesArr: string[] = []
  // @ts-ignore
  entity.forEach((item: { _id: string; }) => {
    if (item._id.includes(entitiesId)) {
      entitiesArr.push(item._id)
    }
  })
  entitiesArr.forEach((item: string) => {
    mapViewer.entities.removeById(item)
  })
}

// 移除所有的实体
export function RemoveAllEntities(mapViewer:Cesium.Viewer) {
  let entity = mapViewer.entities.values
  let entitiesArr: string[] = []
  // @ts-ignore
  entity.forEach((item: { _id: string; }) => {
      entitiesArr.push(item._id)
  })
  entitiesArr.forEach((item: string) => {
    mapViewer.entities.removeById(item)
  })
}
