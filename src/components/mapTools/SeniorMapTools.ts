/**
 * @file 高级地图工具类
 * @desc 包含计算缩放等级、计算中心点、屏幕坐标转WGS84坐标等方法
 */
import * as Cesium from 'cesium'
import store from '@/store'

/**
 * 计算缩放等级与飞向中心点
 * @param mapViewer:Cesium.Viewer 当前地图画布
 * @constructor
 * @param mapViewer
 * @param points
 */
export function CalculateTheZoomLevelAndCenter(mapViewer:Cesium.Viewer, points: number[][]) {
  //最小外接矩形的四个点
  const smallestBoundingRectanglePoints = CalculatesTheMinBoundingRectangle(points)
  const smallestBoundingRectangleCenterPoint = CalculatesTheMinBoundingRectangleCenterPoint(smallestBoundingRectanglePoints)
  mapViewer.camera.flyTo({
      destination: Cesium.Rectangle.fromDegrees(smallestBoundingRectanglePoints[0] - 0.001, smallestBoundingRectanglePoints[3] -0.0005, smallestBoundingRectanglePoints[4] + 0.001, smallestBoundingRectanglePoints[1] + 0.0005),
      orientation: {
        heading :Cesium.Math.toRadians(0), // 方位角
        pitch :Cesium.Math.toRadians(-90),// 倾斜角度
        roll :0  //旋转角
      },
    })
}

/**
 * 屏幕坐标转WGS84坐标
 * @param mapViewer:Cesium.Viewer 当前地图画布
 * @param sceneX:number 屏幕X坐标
 * @param sceneY:number 屏幕Y坐标
 * @param sceneZ:number 屏幕Z坐标(设定航线高度)
 * @constructor
 * @returns [longitude, latitude, height] 经纬度高度
 */
export function SceneCoordinateToWgs84(mapViewer:Cesium.Viewer, sceneX:number, sceneY:number, sceneZ:number) {
  // 屏幕坐标
  let pick = new Cesium.Cartesian2(sceneX, sceneY)
  // @ts-ignore
  // 转世界坐标
  let cartesianWord = mapViewer.scene.globe.pick(mapViewer.camera.getPickRay(pick), mapViewer.scene)
  // @ts-ignore
  // 转WGS84坐标
  let cartesian33 = new Cesium.Cartesian3(cartesianWord.x, cartesianWord.y, cartesianWord.z)
  let cartographic = Cesium.Cartographic.fromCartesian(cartesian33)
  let longitude = Cesium.Math.toDegrees(cartographic.longitude)
  let latitude = Cesium.Math.toDegrees(cartographic.latitude)
  // let height = cartographic.height
  return [longitude, latitude, sceneZ]
}

/**
 * 监听相机参数变化，并写入vuex
 * @param mapViewer:Cesium.Viewer 当前地图画布
 * @param CameraName: string 相机名称(地图相机：cesiumViewer | 鸟瞰图相机：aerialViewViewer)
 */
export function watchCameraAttribute(mapViewer:Cesium.Viewer, CameraName: string) {
  mapViewer.camera.changed.addEventListener(function() {
    // 获取相机的位置
		const cameraPosition  = mapViewer.camera.position
	  // 获取相机的朝向
		const cameraHeading  = mapViewer.camera.heading
	  // 获取相机的俯仰角
		const cameraPitch  = mapViewer.camera.pitch
	  // 获取相机的翻滚角
		const cameraRoll  = mapViewer.camera.roll
    if (CameraName === 'cesiumViewer') {
      const mapCameraAttribute = {
        cameraPosition: cameraPosition,
        cameraHeading: cameraHeading,
        cameraPitch: cameraPitch,
        cameraRoll: cameraRoll,
      }
      store.commit('SET_MAP_CAMERA_ATTRIBUTE', mapCameraAttribute)
    }
	})
}

/**
 *
 * 内部函数：计算最小外接矩形
 * @param points: number[][]
 * @constructor
 * @returns [minLon, maxLat, minLon, minLat, maxLon, minLat, maxLon, maxLat]，起始点左上，逆时针旋转
 */
function CalculatesTheMinBoundingRectangle(points: number[][]) {
  // @ts-ignore
  const pointSArr = [].concat(...points)
  const lonArr: never[] = []
  const latArr: never[] = []
  for (let i = 0; i < pointSArr.length; i += 3) {
    lonArr.push(pointSArr[i])
    latArr.push(pointSArr[i + 1])
  }
  lonArr.sort((a, b) => a - b)
  latArr.sort((a, b) => a - b)
  const maxLon = lonArr[lonArr.length - 1]
  const minLon = lonArr[0]
  const maxLat = latArr[latArr.length - 1]
  const minLat = latArr[0]
  return [minLon, maxLat, minLon, minLat, maxLon, minLat, maxLon, maxLat]
}

/**
 *
 * 内部函数：计算最小外接矩形中心点
 * @param MBR,最小外接矩形[minLon, maxLat, minLon, minLat, maxLon, minLat, maxLon, maxLat]
 * @constructor
 */
function CalculatesTheMinBoundingRectangleCenterPoint(MBR: number[]) {
  return [(MBR[0] + MBR[4]) / 2, (MBR[1] + MBR[3]) / 2]
}
