import * as Cesium from 'cesium'
import { RemoveEntitiesById } from './BaseMapTools'
// @ts-ignore
import droneModel from '@assets/models/airDrone.glb'
import { CreateFrustum } from "./FlightControllerDrawFrustum"

/**
 * 根据图片绘制点
 * @param mapViewer:Cesium.Viewer 当前地图画布
 * @param pointId:string 点ID
 * @param pointLocation: number[] [经度,纬度,高度]
 * @param rotation: number 旋转角度
 * @param droneIcon: string 图片路径
 * @constructor
 */
export function DrawFlightControllerGLB(mapViewer:Cesium.Viewer, pointId:string, pointLocation: number[], rotation: number, droneIcon: string) {

  const entities = mapViewer.entities.values
  entities.forEach( (item) => {
		if (item.id.includes('wayLineDrawingFlightController')) {
			RemoveEntitiesById(window.cesiumViewer, item.id)
		}
	})

  let cameraHeading = mapViewer.camera.heading
  let mapNorthAngle = Cesium.Math.toDegrees(cameraHeading)
  if (mapNorthAngle !== 360) {
    rotation = rotation + mapNorthAngle
  }

  // 模型路径
  let modelUrl = droneModel
  // 旋转角度
  const hpr = new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(450 - rotation), 0, 0)
  const orientation = Cesium.Transforms.headingPitchRollQuaternion(Cesium.Cartesian3.fromDegrees(pointLocation[0], pointLocation[1], pointLocation[2]), hpr) as unknown as Cesium.Property
  mapViewer.entities.add({
    id: pointId,
    position: Cesium.Cartesian3.fromDegrees(pointLocation[0], pointLocation[1], pointLocation[2]),
    orientation: orientation,
    model: {
      uri: modelUrl,
      minimumPixelSize: 70,
      maximumScale: 20000,
    },
  })

  window.aerialView.camera.setView({
    // destination:Cesium.Cartesian3.fromDegrees(pointLocation[0], pointLocation[1], pointLocation[2]),
    orientation: {
      heading: Cesium.Math.toRadians(450 - rotation),
      // pitch: window.cesiumViewer.camera.pitch,
      // roll: window.cesiumViewer.camera.roll
      pitch:Cesium.Math.toRadians(270),
      // roll:Cesium.Math.toRadians(90),
      roll:0
    },
    // duration: 0.0
  })

}

/**
 * 绘制锥体
 * @param mapViewer:Cesium.Viewer 当前地图画布
 * @param rotation: number 旋转角度
 * @param createFrustum: any 锥体类
 * @constructor
 */

export function DrawFlightControllerFRU(mapViewer:Cesium.Viewer, rotation: number,createFrustum:any){

  // 获取鹰眼图的相机坐标，来更新无人机的视锥原点
  let aerialPosition = window.aerialView.scene.camera.positionCartographic;
  let lon = Cesium.Math.toDegrees(aerialPosition.longitude);
  let lat = Cesium.Math.toDegrees(aerialPosition.latitude);
  let hight = aerialPosition.height;
  let aerialCameraLocation:number[] = [lon,lat,hight];


  let cameraHeading = mapViewer.camera.heading
  let mapNorthAngle = Cesium.Math.toDegrees(cameraHeading)
  if (mapNorthAngle !== 360) {
    rotation = rotation + mapNorthAngle
  }

  const hpr = new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(450 - rotation), 270, Cesium.Math.toRadians(180))
  // const hpr = new Cesium.HeadingPitchRoll(window.aerialView.camera.heading, window.aerialView.camera.pitch, window.aerialView.camera.pitch.roll)
  // const frustumOrientation = Cesium.Quaternion.fromHeadingPitchRoll(hpr)
  const frustumOrientation = Cesium.Transforms.headingPitchRollQuaternion(Cesium.Cartesian3.fromDegrees(aerialCameraLocation[0], aerialCameraLocation[1], aerialCameraLocation[2]), hpr) as unknown as Cesium.Property
  let origin = Cesium.Cartesian3.fromDegrees(aerialCameraLocation[0], aerialCameraLocation[1], aerialCameraLocation[2])

  // 创建视锥体
  createFrustum = new CreateFrustum({
    position: origin,
    orientation: frustumOrientation,
    fov: 90,
    near: 1,
    far: aerialCameraLocation[2],
    aspectRatio: 800/1080,
  });

  return createFrustum;

}
