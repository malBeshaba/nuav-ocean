<template>
  <div class="bottom-section" v-if="true">
    <div class="ActionListTitle">
      <img src="../../../../assets/TaskDeployment/TurnLeft.png" @click="leftHandOff">
      航点{{ showindex + 1 }}
      <img src="../../../../assets/TaskDeployment/TurnRight.png" @click="rightHandOff">
      <img src="../../../../assets/TaskDeployment/DeleteIcon.png" @click="DeletWayPoint">

    </div>
    <!--	  <div v-if="showpanel">-->
    <!--		  <span>lon:{{focusWayPointPosition.longitude}}</span>-->
    <!--		  <span>lat:{{focusWayPointPosition.latitude}}</span>-->
    <!--		  <span>alt:{{focusWayPointPosition.height}}</span>-->
    <!--	  </div>-->
    <div class="content">
      <component
          v-for="(item, index) in showingactionlist"
          :key="item"
          :is="components[item.actionName]"
          :message="item.actionActuatorFuncParam"
          :Itemindex="item"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import InitAerialViewMap from "@/pages/Map/components/AerialView/InitAerialViewMap.vue";
import StopRecord from "@/pages/TaskDeployment/components/WaylineEdit/WayPointActionList/StopRecord.vue";
import StartRecord from "@/pages/TaskDeployment/components/WaylineEdit/WayPointActionList/StartRecord.vue";
import StartEqualIntervalTakePhoto
  from "@/pages/TaskDeployment/components/WaylineEdit/WayPointActionList/StartEqualIntervalTakePhoto.vue";
import StartEqualDistanceIntervalTakePhoto
  from "@/pages/TaskDeployment/components/WaylineEdit/WayPointActionList/StartEqualDistanceIntervalTakePhoto.vue";
import StopEqualIntervalTakePhoto
  from "@/pages/TaskDeployment/components/WaylineEdit/WayPointActionList/StopEqualIntervalTakePhoto.vue";
import DroneYaw from "@/pages/TaskDeployment/components/WaylineEdit/WayPointActionList/DroneYaw.vue";
import GimbalYaw from "@/pages/TaskDeployment/components/WaylineEdit/WayPointActionList/GimbalYaw.vue";
import GimbalPitch from "@/pages/TaskDeployment/components/WaylineEdit/WayPointActionList/GimbalPitch.vue";
import Hover from "@/pages/TaskDeployment/components/WaylineEdit/WayPointActionList/Hover.vue";
import NewFolder from "@/pages/TaskDeployment/components/WaylineEdit/WayPointActionList/NewFolder.vue";
import Zoom from "@/pages/TaskDeployment/components/WaylineEdit/WayPointActionList/Zoom.vue";
import TakePhoto from "@/pages/TaskDeployment/components/WaylineEdit/WayPointActionList/TakePhoto.vue";
import {onMounted, reactive, ref, watch, computed, onBeforeUnmount} from "vue";
import store from "@/store";
import {useRoute, useRouter} from 'vue-router';
import {WayLineV2} from "@/store/types/WayLineV2";
import {WayLineGlobalParams} from "@/store/types/wayline";
import {WayLinePoint} from '@/components/mapTools/class/MapWayLinePointClass'
import * as Cesium from 'cesium'
import {DrawPolyline, RemoveEntitiesByBatch, RemoveEntitiesById} from '@/components/mapTools/BaseMapTools'
import {DrawFlightControllerGLB, DrawFlightControllerFRU} from '@/components/mapTools/FlightControllerDrawElement'
import ImageDroneController from '@/assets/images/directedDrone3.png'

const route = useRoute();
const router = useRouter();

const components = {
  StopRecord,
  StartRecord,
  StartEqualIntervalTakePhoto,
  StartEqualDistanceIntervalTakePhoto,
  StopEqualIntervalTakePhoto,
  DroneYaw,
  GimbalYaw,
  GimbalPitch,
  Hover,
  NewFolder,
  Zoom,
  TakePhoto
}
const showindex = ref(0)
const showingactionlist = ref()
const showpanel = ref(false)
const focusWayPointPosition = ref()
watch(
    () => store.state.EditingWayLine.FocusWayPoint,
    (newValue, oldValue) => {
      if (newValue != null && JSON.stringify(store.state.EditingWayLine.FocusWayPoint) != "{}") {
        showpanel.value = true
        showindex.value = Number(newValue.WayPointParam?.index)
        // 显示当前聚焦航点坐标
        WayLinePointIdList.value.forEach((item, index) => {
          if (item === newValue.WayPointID) {
            focusWayPointPosition.value = WayLinePointClass[index].getPosition()
            WayLinePointClass.forEach((item: WayLinePoint) => {
              if (item.id === newValue.WayPointID) {
                item.moveActionEntity(true)
              } else {
                item.moveActionEntity(false)
              }
            })
            focusWayPointModel('TaskEditWayEditingWayLinePoint')
          }
        })
      }
    },
    {deep: true}
)
watch(
    () => store.state.EditingWayLine.FocusWayPoint?.WayPointActionList?.action,
    (newValue, oldValue) => {
      if (newValue != null) {
        showingactionlist.value = []
        showingactionlist.value = newValue
      }
    },
    {deep: true, immediate: true}
)

/**
 * 航线之航点列表及其渲染
 * @author:Jack-Dong-Dong
 */
let WayLinePointIdList = ref<string[]>([])
let WayLinePointClass: WayLinePoint[] = []
// 当前距地面高度
let RelativeHeight: number = 0
// 判断当前任务是否为机场任务
let WayLineDeviceSn = ''
// 临时航线label
const polylineLabel = new Cesium.PolylineDashMaterialProperty({
  color: Cesium.Color.fromCssColorString('#65DDBC'),
  dashLength: 30.0,
  dashPattern: 255.0,
})
Object.keys(store.state.deviceState.dockInfo).forEach((key: string) => {
  if (key === route.query.device_sn) {
    WayLineDeviceSn = String(store.state.deviceState.dockInfo[key].basic_osd.sub_device.device_sn)
  }
})
if (WayLineDeviceSn === '') {
  WayLineDeviceSn = String(route.query.device_sn)
}
// 读取起飞点距地面高
Object.keys(store.state.deviceState.deviceInfo).forEach((key: string) => {
  if (key === WayLineDeviceSn) {
    RelativeHeight = Number(store.state.deviceState.deviceInfo[key].height) - Number(store.state.deviceState.deviceInfo[key].elevation)
  }
})
const initWayLinePoint = (mapViewer: Cesium.Viewer, id: string, index: number, WayLineList: any) => {
  const position = WayLineList.WayPointParam.Point.coordinates.split(',')
  return new WayLinePoint({
    id: id,
    textValue: String(index + 1),
    mapViewer: mapViewer,
    position: {
      longitude: Number(position[0]),
      latitude: Number(position[1]),
      height: Number(WayLineList.WayPointParam.executeHeight) + RelativeHeight
    },
    isEmit: true,
  })
}
watch(
    () => store.state.EditingWayLine.WayLineList,
    (newValue) => {
      console.log('有变化', newValue)
      if (newValue === undefined || newValue.length > 0) {
        if (WayLinePointIdList.value.length === 0) {
          WayLinePointIdList.value = []
          //@ts-ignore
          WayLinePointIdList.value.push(store.state.EditingWayLine.WayLineList[0].WayPointID)
          if (WayLinePointClass.length !== 0) {
            WayLinePointClass.forEach((item: WayLinePoint) => {
              item.clear()
            })
            WayLinePointClass = []
          }
          //@ts-ignore
          const drawWayLinePoint = initWayLinePoint(window.cesiumViewer, String(WayLinePointIdList.value[0]), 0, store.state.EditingWayLine.WayLineList[0])
          WayLinePointClass.push(drawWayLinePoint)
        } else {
          // @ts-ignore
          if (WayLinePointIdList.value.length < store.state.EditingWayLine.WayLineList?.length) {
            // 新增航点
            let insertIndex = 0
            //@ts-ignore
            if (WayLinePointIdList.value[WayLinePointIdList.value.length - 1] !== store.state.EditingWayLine.WayLineList[store.state.EditingWayLine.WayLineList?.length - 1].WayPointID) {
              //@ts-ignore
              WayLinePointIdList.value.push(store.state.EditingWayLine.WayLineList[store.state.EditingWayLine.WayLineList?.length - 1].WayPointID)
              //@ts-ignore
              const tmpIndex = Number(store.state.EditingWayLine.WayLineList?.length - 1)
              //@ts-ignore
              const drawWayLinePoint = initWayLinePoint(window.cesiumViewer, String(WayLinePointIdList.value[tmpIndex]), tmpIndex, store.state.EditingWayLine.WayLineList[tmpIndex])
              WayLinePointClass.push(drawWayLinePoint)
            } else {
              store.state.EditingWayLine.WayLineList?.forEach((item: any, index) => {
                let flag = false
                WayLinePointIdList.value.forEach((item2: any) => {
                  if (item.WayPointID === item2) {
                    flag = true
                  }
                })
                if (!flag) {
                  insertIndex = index
                }
              })
              //@ts-ignore
              WayLinePointIdList.value.splice(insertIndex, 0, store.state.EditingWayLine.WayLineList[insertIndex].WayPointID)
              //@ts-ignore
              const drawWayLinePoint = initWayLinePoint(window.cesiumViewer, String(WayLinePointIdList.value[insertIndex]), insertIndex, store.state.EditingWayLine.WayLineList[insertIndex])
              WayLinePointClass.splice(insertIndex, 0, drawWayLinePoint)
              WayLinePointClass.forEach((item: WayLinePoint, index: number) => {
                item.updateTextValue(String(index + 1))
              })
            }
          } else if (WayLinePointIdList.value.length === store.state.EditingWayLine.WayLineList?.length) {
            // 航点参数变化更新航点
            WayLinePointClass.forEach((item: WayLinePoint, index: number) => {
              //@ts-ignore
              const tmpPosition = newValue[index].WayPointParam.Point.coordinates.split(',')
              // @ts-ignore
              item.updatePosition({
                longitude: Number(tmpPosition[0]),
                latitude: Number(tmpPosition[1]),
                height: Number(newValue[index].WayPointParam.executeHeight) + RelativeHeight
              })
            })
          } else {
            // 删除航点
            WayLinePointClass.forEach((item: WayLinePoint) => {
              item.clear()
            })
            WayLinePointClass = []
            WayLinePointIdList.value = []
            store.state.EditingWayLine.WayLineList?.forEach((item: any, index) => {
              WayLinePointIdList.value.push(item.WayPointID)
              const drawWayLinePoint = initWayLinePoint(window.cesiumViewer, String(item.WayPointID), index, item)
              WayLinePointClass.push(drawWayLinePoint)
            })
          }
        }
        // 航线
        let wayLineArr: number[] = []
        WayLinePointClass.forEach((item: WayLinePoint) => {
          wayLineArr.push(item.getPosition().longitude)
          wayLineArr.push(item.getPosition().latitude)
          wayLineArr.push(item.getPosition().height)
        })
        RemoveEntitiesById(window.cesiumViewer, 'TaskEditWayLineV2')
        DrawPolyline(window.cesiumViewer, 'TaskEditWayLineV2', wayLineArr, polylineLabel)
      } else if (newValue.length === 0) {
        WayLinePointClass.forEach((item: WayLinePoint) => {
          item.clear()
        })
        WayLinePointClass = []
        WayLinePointIdList.value = []
      }
    },
    {deep: true}
)
watch(
    () => store.state.wayPointMove,
    (newValue) => {
      if (newValue !== undefined) {
        store.commit('UPDATE_WAYLINEPOINT_POSITION_BY_ID', newValue)
      }
    },
    {deep: true}
)

watch(
    () => store.state.focusWayPointByClass,
    (newValue) => {
      if (newValue !== undefined) {
        console.log('check', newValue)
        WayLinePointClass.forEach((item: WayLinePoint, index: number) => {
          if (item.id === newValue.id) {
            store.commit("SWITCH_FOCUS", index)
          }
        })
      }
    },
    {deep: true}
)

const focusWayPointModel = (id: string) => {
  // 鹰眼图切换至当前聚焦坐标上
  if (WayLinePointIdList.value.length === 0) {
    RemoveEntitiesById(window.cesiumViewer, 'TaskEditWayEditingWayLinePoint')
  } else {
    window.aerialView.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(Number(focusWayPointPosition.value.longitude), Number(focusWayPointPosition.value.latitude), Number(focusWayPointPosition.value.height)),

    })
    RemoveEntitiesById(window.cesiumViewer, 'TaskEditWayEditingWayLinePoint')
    DrawFlightControllerGLB(window.cesiumViewer, 'TaskEditWayEditingWayLinePoint', [Number(focusWayPointPosition.value.longitude), Number(focusWayPointPosition.value.latitude), Number(focusWayPointPosition.value.height)], 360, ImageDroneController)
  }
}

const leftHandOff = () => {
  let leftIndex = Number(store.state.EditingWayLine.FocusWayPoint?.WayPointParam?.index)
  //@ts-ignore
  if (leftIndex == 0) {
    //@ts-ignore
    leftIndex = store.state.EditingWayLine.WayLineList?.length
  }
  store.commit("SWITCH_FOCUS", leftIndex - 1)
  console.log("切换之前为", leftIndex, "切换之后为", store.state.EditingWayLine.FocusWayPoint?.WayPointParam?.index)
}
const rightHandOff = () => {
  let rightIndex = store.state.EditingWayLine.FocusWayPoint?.WayPointParam?.index
  //@ts-ignore
  if (rightIndex == store.state.EditingWayLine.WayLineList?.length - 1) {
    rightIndex = -1
  }
  //@ts-ignore
  store.commit("SWITCH_FOCUS", rightIndex + 1)
  console.log("切换之前为", rightIndex, "切换之后为", store.state.EditingWayLine.FocusWayPoint?.WayPointParam?.index)
}
const DeletWayPoint = () => {
  //删除当前航点方法
  //细节为清空当前的航点，然后把列表中的对应数据删除，当前点变为删除点的前一个点，若是删除的是唯一点则当前点为空
  let CurrentIndex = store.state.EditingWayLine.FocusWayPoint?.WayPointParam?.index
  if (store.state.EditingWayLine.WayLineList?.length == 1 || store.state.EditingWayLine.WayLineList?.length == 0) {
    //@ts-ignore
    store.state.EditingWayLine.FocusWayPoint = {}
    store.state.EditingWayLine.WayLineList = []
  } else {
    //@ts-ignore
    store.state.EditingWayLine.FocusWayPoint = {}
    store.commit("DELETE_WAYPOINT", CurrentIndex)
  }
}

onBeforeUnmount(() => {
  WayLinePointClass.forEach((item: WayLinePoint) => {
    item.clear()
  })
  WayLinePointClass = []
  WayLinePointIdList.value = []
  RemoveEntitiesByBatch(window.cesiumViewer, 'TaskEditWay')
})
</script>

<style scoped lang="scss">
::-webkit-scrollbar {
  width: 0 !important;
}

::-webkit-scrollbar {
  width: 0 !important;
  height: 0;
}

.bottom-section {
  overflow: auto;
  -ms-overflow-style: none;
  /* 设置顶部边框的粗细为2px */
  border-top-width: 2px;
  /* 设置顶部边框的颜色为白色 */
  border-top-color: white;
  /* 设置顶部边框的样式为实线，也可以选择其他样式，如虚线、点线等 */
  border-top-style: solid;
  position: absolute;
  left: 0;
  top: 500px;
  bottom: 0;
  background: $ComponentBackground;
  width: 440px;
  height: 50%;
}

.ActionListTitle {
  font-weight: bold;
  width: 60px;
  height: 15px;
  overflow-wrap: break-word;
  color: $LightColor;
  font-size: 20px;
  text-align: left;
  white-space: nowrap;
  line-height: 20px;
  margin: 8px 0 0 120px;
  margin-bottom: 25px;
}

.content {
  color: black;
}

img {
  margin-top: 4px;
  margin-left: 18px;
  height: 20px;
  width: 20px;
  margin-right: 18px;
}
</style>
