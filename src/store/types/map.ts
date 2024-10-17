import * as Cesium from 'cesium'

// 地图属性
export interface MapCameraAttribute {
  cameraPosition: Cesium.Cartesian3,
  cameraHeading: number,
  cameraPitch: number,
  cameraRoll: number,
}

// 鸟瞰图属性
export interface AerialViewCameraAttribute {
  cameraPosition: Cesium.Cartesian3,
  cameraHeading: number,
  cameraPitch: number,
  cameraRoll: number,
}
