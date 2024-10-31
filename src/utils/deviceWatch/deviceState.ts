import * as Cesium from 'cesium'
import { updateFlightPlan } from '@/api/droneFlightPlan'
import deviceNotFly from '@/assets/images/directedDrone3.png'
import store from '@/store'
// @ts-ignore
import droneModel from '@assets/models/airDrone.glb'
import {watch} from 'vue'
import {DeviceOsd} from '@/store/types/device'
import {FlyingGlowPolylineLabel} from '@/components/mapTools/mapMaterial/mapMaterialStyle'

interface UAVShow {
  sn: string,
  flyModel: flyModel,
  groundModel: groundModel,
  flyPathModel: flyPathModel,
  flyPath: number[],
  isFly: boolean,
}

export function deviceState () {
  let messageFrequency = 0
  let flyList: UAVShow[] = []
  watch(store.state.deviceState.deviceInfo, (value) => {
    if (value) {
      Object.keys(value).forEach((key: string) => {
        let modelHeading = 360 - (( Number(value[key].attitude_head) + 360 ) % 360)
        let isExist = false
        if (flyList.length === 0) {
          let addFlyModel = new flyModel({
            id: key,
            droneModelUri: droneModel,
            position: Cesium.Cartesian3.fromDegrees(Number(value[key].longitude), Number(value[key].latitude), Number(value[key].height)),
            hpr: [modelHeading, 0, 0],
            show: false,
            mapViewer: window.cesiumViewer,
          })
          let addGroundModel = new groundModel({
            id: key,
            droneImageURL: deviceNotFly,
            widthHeight: [30, 30],
            position: Cesium.Cartesian3.fromDegrees(Number(value[key].longitude), Number(value[key].latitude), Number(value[key].height)),
            show: false,
            mapViewer: window.cesiumViewer,
          })
          let addFlyPath: number[] = []
          addFlyPath.push(value[key].longitude)
          addFlyPath.push(value[key].latitude)
          addFlyPath.push(Number(value[key].height))
          let addFlyPathModel = new flyPathModel({
            id: key,
            positions: addFlyPath,
            width: 5,
            show: false,
            mapViewer: window.cesiumViewer,
          })
          flyList.push({
            sn: key,
            flyModel: addFlyModel,
            groundModel: addGroundModel,
            flyPathModel: addFlyPathModel,
            flyPath: addFlyPath,
            isFly: false
          })
          isExist = true
        } else {
          flyList.forEach((item: UAVShow) => {
            if (item.sn === key) {
              isExist = true
            }
          })
          if (!isExist) {
            console.log('添加新增无人机')
            // ElNotification({
            //   title: '无人机上线',
            //   message: `${key}上线`,
            //   type: 'info',
            // })
            let addFlyModel = new flyModel({
              id: key,
              droneModelUri: droneModel,
              position: Cesium.Cartesian3.fromDegrees(Number(value[key].longitude), Number(value[key].latitude), Number(value[key].height)),
              hpr: [modelHeading, 0, 0],
              show: false,
              mapViewer: window.cesiumViewer,
            })
            let addGroundModel = new groundModel({
              id: key,
              droneImageURL: deviceNotFly,
              widthHeight: [30, 30],
              position: Cesium.Cartesian3.fromDegrees(Number(value[key].longitude), Number(value[key].latitude), Number(value[key].height)),
              show: false,
              mapViewer: window.cesiumViewer,
            })
            let addFlyPath: number[] = []
            addFlyPath.push(value[key].longitude)
            addFlyPath.push(value[key].latitude)
            addFlyPath.push(Number(value[key].height))
            let addFlyPathModel = new flyPathModel({
              id: key,
              positions: addFlyPath,
              width: 5,
              show: false,
              mapViewer: window.cesiumViewer,
            })
            flyList.push({
              sn: key,
              flyModel: addFlyModel,
              groundModel: addGroundModel,
              flyPathModel: addFlyPathModel,
              flyPath: addFlyPath,
              isFly: false
            })
          }
          flyList.forEach((item: UAVShow) => {
            if (item.sn === key) {
              switch (value[key].mode_code) {
                case 0:
                  item.isFly = false
                  item.groundModel.update(Cesium.Cartesian3.fromDegrees(Number(value[key].longitude), Number(value[key].latitude), Number(value[key].height)), true)
                  item.flyModel.update(Cesium.Cartesian3.fromDegrees(Number(value[key].longitude), Number(value[key].latitude), Number(value[key].height)), [modelHeading, 0, 0], false)
                  item.flyPath = []
                  item.flyPath.push(value[key].longitude)
                  item.flyPath.push(value[key].latitude)
                  item.flyPath.push(Number(value[key].height))
                  item.flyPathModel.update(item.flyPath, false)
                    // console.log('飞行中0',key , item.sn, item.flyPath)
                  break
                case 1:
                  //准备起飞那么就设置起飞时间
                  const currentDate = new Date(); // 获取当前时间
                  const year = currentDate.getFullYear();
                  const month = currentDate.getMonth() + 1; // 月份是从 0 到 11，所以要加 1
                  const day = currentDate.getDate();
                  const hours = currentDate.getHours();
                  const minutes = currentDate.getMinutes();
                  const seconds = currentDate.getSeconds();
                  // debugger
                  store.state.deviceTakeOffTime[item.sn] = `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
                  // console.log('qifeiqifei765412398456296582385623'+store.state.deviceTakeOffTime[item.sn])
                  messageFrequency++
                  if (messageFrequency === 5) {
                    ElNotification({
                      title: '无人机任务消息',
                      message: `${key}无人机准备起飞`,
                      type: 'info',
                    })
                    messageFrequency = 0
                  }
                  item.isFly = false
                  item.groundModel.update(Cesium.Cartesian3.fromDegrees(Number(value[key].longitude), Number(value[key].latitude), Number(value[key].height)), true)
                  item.flyModel.update(Cesium.Cartesian3.fromDegrees(Number(value[key].longitude), Number(value[key].latitude), Number(value[key].height)), [modelHeading, 0, 0], false)
                  item.flyPath = []
                  item.flyPath.push(value[key].longitude)
                  item.flyPath.push(value[key].latitude)
                  item.flyPath.push(Number(value[key].height))
                  item.flyPathModel.update(item.flyPath, false)
                  checkView(key, value[key], item)
                  // console.log('飞行中1',key , item.sn, item.flyPath)
                  break
                case 2:
                  if(store.state.deviceTakeOffTime[item.sn]=='0'||store.state.deviceTakeOffTime[item.sn]){
                    const currentDate = new Date(); // 获取当前时间
                    const year = currentDate.getFullYear();
                    const month = currentDate.getMonth() + 1; // 月份是从 0 到 11，所以要加 1
                    const day = currentDate.getDate();
                    const hours = currentDate.getHours();
                    const minutes = currentDate.getMinutes();
                    const seconds = currentDate.getSeconds();
                    // debugger
                    store.state.deviceTakeOffTime[item.sn] = `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
                  }
                  messageFrequency++
                  if (messageFrequency === 5) {
                    ElNotification({
                      title: '无人机任务消息',
                      message: `${key}就绪`,
                      type: 'info',
                    })
                    messageFrequency = 0
                  }
                  item.isFly = true
                  item.groundModel.update(Cesium.Cartesian3.fromDegrees(Number(value[key].longitude), Number(value[key].latitude), Number(value[key].height)), false)
                  item.flyModel.update(Cesium.Cartesian3.fromDegrees(Number(value[key].longitude), Number(value[key].latitude), Number(value[key].height)), [modelHeading, 0, 0], true)
                  // if (item.isFly) {
                  //   item.flyPath.push(value[key].longitude)
                  //   item.flyPath.push(value[key].latitude)
                  //   item.flyPath.push(Number(value[key].height))
                  // } else {
                  //   item.isFly = true
                  //   item.flyPath.push(value[key].longitude)
                  //   item.flyPath.push(value[key].latitude)
                  //   item.flyPath.push(Number(value[key].height))
                  // }
                  if(item.flyPath[item.flyPath.length - 3] !== value[key].longitude) {
                    item.flyPath.push(value[key].longitude)
                    item.flyPath.push(value[key].latitude)
                    item.flyPath.push(Number(value[key].height))
                  }
                  checkView(key, value[key], item)
                  item.flyPathModel.update(item.flyPath, true)
                    // console.log('飞行中2',key , item.sn, item.flyPath)
                  break
                case 3:
                  messageFrequency++
                  if (messageFrequency === 5) {
                    ElNotification({
                      title: '无人机任务消息',
                      message: `${key}手动飞行`,
                      type: 'info',
                    })
                    messageFrequency = 0
                  }
                  item.isFly = true
                  item.groundModel.update(Cesium.Cartesian3.fromDegrees(Number(value[key].longitude), Number(value[key].latitude), Number(value[key].height)), false)
                  //@ts-ignore
                  if (store.state.videoFusionState.sn === key) {
                    item.flyModel.update(Cesium.Cartesian3.fromDegrees(Number(value[key].longitude), Number(value[key].latitude), Number(value[key].height)), [modelHeading, 0, 0], false)
                  } else {
                    item.flyModel.update(Cesium.Cartesian3.fromDegrees(Number(value[key].longitude), Number(value[key].latitude), Number(value[key].height)), [modelHeading, 0, 0], true)
                  }
                  // if (item.isFly) {
                  //   item.flyPath.push(value[key].longitude)
                  //   item.flyPath.push(value[key].latitude)
                  //   item.flyPath.push(Number(value[key].height))
                  // } else {
                  //   item.isFly = true
                  //   item.flyPath.push(value[key].longitude)
                  //   item.flyPath.push(value[key].latitude)
                  //   item.flyPath.push(Number(value[key].height))
                  // }
                  if(item.flyPath[item.flyPath.length - 3] !== value[key].longitude) {
                    item.flyPath.push(value[key].longitude)
                    item.flyPath.push(value[key].latitude)
                    item.flyPath.push(Number(value[key].height))
                  }
                  checkView(key, value[key], item)
                  item.flyPathModel.update(item.flyPath, true)
                    // console.log('飞行中3', key, item.sn, item.flyPath)
                  break
                case 4:
                  item.isFly = true
                  item.groundModel.update(Cesium.Cartesian3.fromDegrees(Number(value[key].longitude), Number(value[key].latitude), Number(value[key].height)), false)
                  //@ts-ignore
                  if (store.state.videoFusionState.sn === key) {
                    item.flyModel.update(Cesium.Cartesian3.fromDegrees(Number(value[key].longitude), Number(value[key].latitude), Number(value[key].height)), [modelHeading, 0, 0], false)
                  } else {
                    item.flyModel.update(Cesium.Cartesian3.fromDegrees(Number(value[key].longitude), Number(value[key].latitude), Number(value[key].height)), [modelHeading, 0, 0], true)
                  }
                  // if (item.isFly) {
                  //   item.flyPath.push(value[key].longitude)
                  //   item.flyPath.push(value[key].latitude)
                  //   item.flyPath.push(Number(value[key].height))
                  // } else {
                  //   item.isFly = true
                  //   item.flyPath.push(value[key].longitude)
                  //   item.flyPath.push(value[key].latitude)
                  //   item.flyPath.push(Number(value[key].height))
                  // }
                  if(item.flyPath[item.flyPath.length - 3] !== value[key].longitude) {
                    item.flyPath.push(value[key].longitude)
                    item.flyPath.push(value[key].latitude)
                    item.flyPath.push(Number(value[key].height))
                  }
                  checkView(key, value[key], item)
                  item.flyPathModel.update(item.flyPath, true)
                    // console.log('飞行中4', key, item.sn, item.flyPath)
                  break
                case 5:
                  item.isFly = true
                  item.groundModel.update(Cesium.Cartesian3.fromDegrees(Number(value[key].longitude), Number(value[key].latitude), Number(value[key].height)), false)
                  //@ts-ignore
                  if (store.state.videoFusionState.sn === key) {
                    item.flyModel.update(Cesium.Cartesian3.fromDegrees(Number(value[key].longitude), Number(value[key].latitude), Number(value[key].height)), [modelHeading, 0, 0], false)
                  } else {
                    item.flyModel.update(Cesium.Cartesian3.fromDegrees(Number(value[key].longitude), Number(value[key].latitude), Number(value[key].height)), [modelHeading, 0, 0], true)
                  }
                  // if (item.isFly) {
                  //   item.flyPath.push(value[key].longitude)
                  //   item.flyPath.push(value[key].latitude)
                  //   item.flyPath.push(Number(value[key].height))
                  // } else {
                  //   item.isFly = true
                  //   item.flyPath.push(value[key].longitude)
                  //   item.flyPath.push(value[key].latitude)
                  //   item.flyPath.push(Number(value[key].height))
                  // }
                  if(item.flyPath[item.flyPath.length - 3] !== value[key].longitude) {
                    item.flyPath.push(value[key].longitude)
                    item.flyPath.push(value[key].latitude)
                    item.flyPath.push(Number(value[key].height))
                  }
                  checkView(key, value[key], item)
                  item.flyPathModel.update(item.flyPath, true)
                    // console.log('飞行中5', key, item.sn, item.flyPath)
                  break
                case 9:
                  messageFrequency++
                  if (messageFrequency === 5) {
                    ElNotification({
                      title: '无人机任务消息',
                      message: `${key}返航`,
                      type: 'info',
                    })
                    messageFrequency = 0
                  }
                  item.isFly = true
                  item.groundModel.update(Cesium.Cartesian3.fromDegrees(Number(value[key].longitude), Number(value[key].latitude), Number(value[key].height)), false)
                  //@ts-ignore
                  if (store.state.videoFusionState.sn === key) {
                    item.flyModel.update(Cesium.Cartesian3.fromDegrees(Number(value[key].longitude), Number(value[key].latitude), Number(value[key].height)), [modelHeading, 0, 0], false)
                  } else {
                    item.flyModel.update(Cesium.Cartesian3.fromDegrees(Number(value[key].longitude), Number(value[key].latitude), Number(value[key].height)), [modelHeading, 0, 0], true)
                  }
                  // if (item.isFly) {
                  //   item.flyPath.push(value[key].longitude)
                  //   item.flyPath.push(value[key].latitude)
                  //   item.flyPath.push(Number(value[key].height))
                  // } else {
                  //   item.isFly = true
                  //   item.flyPath.push(value[key].longitude)
                  //   item.flyPath.push(value[key].latitude)
                  //   item.flyPath.push(Number(value[key].height))
                  // }
                  if(item.flyPath[item.flyPath.length - 3] !== value[key].longitude) {
                    item.flyPath.push(value[key].longitude)
                    item.flyPath.push(value[key].latitude)
                    item.flyPath.push(Number(value[key].height))
                  }
                  checkView(key, value[key], item)
                  item.flyPathModel.update(item.flyPath, true)
                    // console.log('飞行中9', key, item.sn, item.flyPath)
                  break
                case 10:
                  if (messageFrequency === 5) {
                    ElNotification({
                      title: '无人机任务消息',
                      message: `${key}降落`,
                      type: 'info',
                    })
                    messageFrequency = 0
                  }
                  item.isFly = true
                  item.groundModel.update(Cesium.Cartesian3.fromDegrees(Number(value[key].longitude), Number(value[key].latitude), Number(value[key].height)), false)
                  //@ts-ignore
                  if (store.state.videoFusionState.sn === key) {
                    item.flyModel.update(Cesium.Cartesian3.fromDegrees(Number(value[key].longitude), Number(value[key].latitude), Number(value[key].height)), [modelHeading, 0, 0], false)
                  } else {
                    item.flyModel.update(Cesium.Cartesian3.fromDegrees(Number(value[key].longitude), Number(value[key].latitude), Number(value[key].height)), [modelHeading, 0, 0], true)
                  }
                  // if (item.isFly) {
                  //   item.flyPath.push(value[key].longitude)
                  //   item.flyPath.push(value[key].latitude)
                  //   item.flyPath.push(Number(value[key].height))
                  // } else {
                  //   item.isFly = true
                  //   item.flyPath.push(value[key].longitude)
                  //   item.flyPath.push(value[key].latitude)
                  //   item.flyPath.push(Number(value[key].height))
                  // }
                  if(item.flyPath[item.flyPath.length - 3] !== value[key].longitude) {
                    item.flyPath.push(value[key].longitude)
                    item.flyPath.push(value[key].latitude)
                    item.flyPath.push(Number(value[key].height))
                  }
                  checkView(key, value[key], item)
                  item.flyPathModel.update(item.flyPath, true)
                    // console.log('飞行中10', key, item.sn, item.flyPath)
                  break

              }
            }
          })
        }
      })
    }
  }, {deep: true, immediate: true});
}

function checkView (sn: string, deviceInfo: DeviceOsd, UAVShow: UAVShow) {
  // console.log('video', sn, store.state.selectViewState)
  if(store.state.selectViewState.sn === sn && store.state.selectViewState.state) {
    // 无人机
    console.log('video', sn, store.state.selectViewState, deviceInfo.longitude, deviceInfo.latitude, deviceInfo.height)
    const position = Cesium.Cartesian3.fromDegrees(Number(deviceInfo.longitude), Number(deviceInfo.latitude), Number(deviceInfo.height))
    window.cesiumViewer.camera.lookAt(position, new Cesium.HeadingPitchRange(0, Cesium.Math.toRadians(-45), 400))
    // window.cesiumViewer.trackedEntity(UAVShow.flyModel.flyModel)
  } else if(store.state.selectViewState.sn === sn && !store.state.selectViewState.state) {
    // 地图
    window.cesiumViewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY)
  }
}

// 定义新的飞行模型类
class flyModel {
  id: string
  droneModelUri: string
  mapViewer: Cesium.Viewer | undefined
  position: Cesium.Cartesian3
  hpr: [number, number, number]
  private orientation: any | Cesium.Quaternion
  show: boolean
  flyModel: any

  constructor(option:any) {
    this.id = option.id
    this.droneModelUri = option.droneModelUri
    this.position = option.position
    this.mapViewer = option.mapViewer
    this.hpr = option.hpr
    this.show = option.show
    this.clear()
    this.initOrientation()
    this.addFlyModel()
  }

  update(position: Cesium.Cartesian3, hpr: [number, number, number], show: boolean) {
    this.position = position
    this.flyModel.position = new Cesium.CallbackProperty(() => {
      return position
    }, false)
    this.hpr = hpr
    this.initOrientation()
    let tmpOrientation = this.orientation
    this.flyModel.orientation = new Cesium.CallbackProperty(() => {
      return tmpOrientation
    }, false)
    this.flyModel.show = show
  }

  initOrientation () {
    let hpr = new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(360 - this.hpr[0]), Cesium.Math.toRadians(this.hpr[1]), Cesium.Math.toRadians(this.hpr[2]));
    this.orientation = Cesium.Transforms.headingPitchRollQuaternion(this.position, hpr);
  }

  clear() {
    if(this.flyModel){
      this.mapViewer?.entities.remove(this.flyModel)
      this.flyModel = null
    }
  }

  addFlyModel() {
    let UAVModel = new Cesium.ModelGraphics({
      uri: this.droneModelUri,
      minimumPixelSize: 64,
      maximumScale: 20000,
    })

    this.flyModel = this.mapViewer?.entities.add({
      id: this.id + 'flyModel',
      model: UAVModel,
      position: this.position,
      orientation: this.orientation,
      show: this.show
    })
  }
}

class groundModel {
  id: string
  droneImageURL: string
  widthHeight: [number, number]
  position: Cesium.Cartesian3
  show: boolean
  mapViewer: Cesium.Viewer | undefined
  private groundModel: any

  constructor(option: any) {
    this.id = option.id
    this.droneImageURL = option.droneImageURL
    this.widthHeight = option.widthHeight
    this.position = option.position
    this.show = option.show
    this.mapViewer = option.mapViewer
    this.clear()
    this.addGroundModel()
  }

  update(position: Cesium.Cartesian3, show: boolean) {
    this.position = position
    this.groundModel.position = new Cesium.CallbackProperty(() => {
      return position
    }, false)
    this.groundModel.show = show
  }

  clear() {
    if(this.groundModel){
      this.mapViewer?.entities.remove(this.groundModel)
      this.groundModel = null
    }
  }

  addGroundModel() {
    let groundModel = new Cesium.BillboardGraphics({
      image: this.droneImageURL,
      width: this.widthHeight[0],
      height: this.widthHeight[1],
      color: Cesium.Color.WHITE.withAlpha(0.8),
    })

    this.groundModel = this.mapViewer?.entities.add({
      id: this.id + 'groundModel',
      position: this.position,
      billboard: groundModel,
    })
  }

}

class flyPathModel {
  id: string
  positions: number[]
  width: number
  show: boolean
  mapViewer: Cesium.Viewer | undefined
  private flyPath: any

  constructor(option: any) {
    this.id = option.id
    this.positions = option.positions
    this.width = option.width
    this.mapViewer = option.mapViewer
    this.show = option.show
    this.clear()
    this.addFlyPolyline()
  }

  update(positions: number[], show: boolean) {
    this.positions = positions

    // this.clear()
    // this.addFlyPolyline()
    let tmp = Cesium.Cartesian3.fromDegreesArrayHeights(this.positions)
    this.flyPath.polyline.positions = new Cesium.CallbackProperty(() => {
      return tmp
    }, false)
    this.flyPath.show = show
    // this.flyPath.show = show
  }

  clear() {
    if(this.flyPath){
      this.mapViewer?.entities.remove(this.flyPath)
      this.flyPath = null
    }
  }

  addFlyPolyline() {
    let polylineLabel = new Cesium.PolylineDashMaterialProperty({
      color: Cesium.Color.fromCssColorString('#65DDBC'),
      dashLength: 0.0,
      dashPattern: 255.0,
    })

    this.flyPath = this.mapViewer?.entities.add({
      id: this.id + 'flyPath',
      polyline: {
        positions: Cesium.Cartesian3.fromDegreesArrayHeights(this.positions),
        width: this.width,
        material: FlyingGlowPolylineLabel,
      },
      show: this.show
    })
  }

}
