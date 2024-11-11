<template>
  <div class="drone-control-wrapper">
    <div class="drone-control-header">
      <div class="orange-dot"></div>
      <div>无人机负载控制：M3TD</div>
    </div>
    <div class="drone-control-box">
      <div class="box">
        <div class="row">
<!--          <div >负载：M3TD</div>-->
          <div class="drone-control">
            <el-button 
              class="btn big-btn"
              size="small"
              @click="onAuthPayload"
            >
              {{ payloadController ? '退出控制' : '获取控制'}}
            </el-button>
          </div>
        </div>
        <div class="row">
            <el-button class="btn big-btn" size="small" @click="GimbalRecenter">云台回中</el-button>
        </div>
        <div class="row">
            <el-button class="btn big-btn" size="small" @click="GimbalDown">云台俯视</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, reactive, computed, onMounted, onUnmounted, watch} from "vue";
import {useMyStore} from "@/store";
import {postDrcEnter, postDrcExit, postDrc} from "@/api/drc";
import {DeviceInfoType, PayloadInfo, ControlSource, DeviceOsdCamera, DrcStateEnum} from "@/store/types/device";
import {DeviceTopicInfo} from "@/pages/ResourceManagement/components/Drone/use-mqtt";
import {useDroneControlWsEvent} from "@/pages/ResourceManagement/components/Drone/use-drone-control-ws-event";
import {
  LostControlActionInCommandFLight,
  postFlightAuth,
  WaylineLostControlActionInCommandFlight
} from "@/api/drone-control/drone";
import {KeyCode, useManualControl} from "@/pages/ResourceManagement/components/Drone/use-manual-control";
import {useMqtt} from "@/pages/ResourceManagement/components/Drone/use-mqtt";
import {
  UranusMqtt,
} from '@/utils/mqtt'
import {postTakeoffToPoint, deleteFlyToPoint, postFlyToPoint, retuenHome} from "@/api/drone-control/drone";
import {
  GimbalResetMode, GimbalResetModeOptions,
  LostControlActionInCommandFLightOptions,
  WaylineLostControlActionInCommandFlightOptions
} from "@/pages/ResourceManagement/components/Drone/types/drone-control";
import {usePayloadControl} from "@/api/UsePayloadControl";
import {CameraMode, CameraType, CameraTypeOptions, ZoomCameraTypeOptions, CameraListItem} from "@/api/live-stream";
import { noDebugCmdList as baseCmdList, DeviceCmdItem, DeviceCmd } from '@/store/types/device-cmd'
import { useDockControl } from '@/api/Payload-use-dock-control'
import { useDroneControl } from '@/api/Payload-use-drone-control'
import {postPayloadCommands} from "@/api/drone-control/payload";


const payloadController = ref(false)
const isShowFlyto = ref(false)
const props = defineProps<{
  sn: string,
  deviceInfo: DeviceInfoType,
  payloads: null | PayloadInfo[]
}>()

const store = useMyStore()
const clientId = computed(() => {
  return store.state.clientId
})

const initCmdList = baseCmdList.find(item => item.cmdKey === DeviceCmd.ReturnHome)
const cmdItem = ref(initCmdList)

const {
  sendDockControlCmd
} = useDockControl()
const osdVisible = computed(() => {
  return store.state.osdVisible
})
async function sendControlCmd (cmdItem: DeviceCmdItem, index: number) {
  cmdItem.loading = true
  const result = await sendDockControlCmd({
    sn: props.sn,
    cmd: cmdItem.cmdKey,
    action: cmdItem.action
  }, false)
  if (result && flightController.value) {
    exitFlightCOntrol()
  }
  cmdItem.loading = false
}

const {
  flyToPoint,
  stopFlyToPoint,
  takeoffToPoint
} = useDroneControl()
const MAX_SPEED = 14

const flyToPointPopoverData = reactive({
  visible: false,
  loading: false,
  latitude: null as null | number,
  longitude: null as null | number,
  height: null as null | number,
  maxSpeed: MAX_SPEED,
})

function onShowFlyToPopover () {
  flyToPointPopoverData.visible = !flyToPointPopoverData.visible
  flyToPointPopoverData.loading = false
  flyToPointPopoverData.latitude = null
  flyToPointPopoverData.longitude = null
  flyToPointPopoverData.height = null
}

async function onFlyToConfirm (confirm: boolean) {
  if (confirm) {
    if (!flyToPointPopoverData.height || !flyToPointPopoverData.latitude || !flyToPointPopoverData.longitude) {
      ElMessage.error('Input error')
      return
    }
    try {
      await flyToPoint(props.sn, {
        max_speed: flyToPointPopoverData.maxSpeed,
        points: [
          {
            latitude: flyToPointPopoverData.latitude,
            longitude: flyToPointPopoverData.longitude,
            height: flyToPointPopoverData.height
          }
        ]
      })
    } catch (error) {
    }
  }
  flyToPointPopoverData.visible = false
}

async function onStopFlyToPoint () {
  await stopFlyToPoint(props.sn)
}

const takeoffToPointPopoverData = reactive({
  visible: false,
  loading: false,
  latitude: null as null | number,
  longitude: null as null | number,
  height: null as null | number,
  securityTakeoffHeight: null as null | number,
  maxSpeed: MAX_SPEED,
  rthAltitude: null as null | number,
  rcLostAction: LostControlActionInCommandFLight.RETURN_HOME,
  exitWaylineWhenRcLost: WaylineLostControlActionInCommandFlight.RETURN_HOME
})

function onShowTakeoffToPointPopover () {
  takeoffToPointPopoverData.visible = !takeoffToPointPopoverData.visible
  takeoffToPointPopoverData.loading = false
  takeoffToPointPopoverData.latitude = null
  takeoffToPointPopoverData.longitude = null
  takeoffToPointPopoverData.securityTakeoffHeight = null
  takeoffToPointPopoverData.rthAltitude = null
  takeoffToPointPopoverData.rcLostAction = LostControlActionInCommandFLight.RETURN_HOME
  takeoffToPointPopoverData.exitWaylineWhenRcLost = WaylineLostControlActionInCommandFlight.RETURN_HOME
}

async function onTakeoffToPointConfirm (confirm: boolean) {
  if (confirm) {
    if (!takeoffToPointPopoverData.height ||
        !takeoffToPointPopoverData.latitude ||
        !takeoffToPointPopoverData.longitude ||
        !takeoffToPointPopoverData.securityTakeoffHeight ||
        !takeoffToPointPopoverData.rthAltitude) {
      ElMessage.error('Input error')
      return
    }
    try {
      await takeoffToPoint(props.sn, {
        target_latitude: takeoffToPointPopoverData.latitude,
        target_longitude: takeoffToPointPopoverData.longitude,
        target_height: takeoffToPointPopoverData.height,
        security_takeoff_height: takeoffToPointPopoverData.securityTakeoffHeight,
        rth_altitude: takeoffToPointPopoverData.rthAltitude,
        max_speed: takeoffToPointPopoverData.maxSpeed,
        rc_lost_action: takeoffToPointPopoverData.rcLostAction,
        exit_wayline_when_rc_lost: takeoffToPointPopoverData.exitWaylineWhenRcLost
      })
    } catch (error) {
    }
  }
  takeoffToPointPopoverData.visible = false
}

const deviceTopicInfo: DeviceTopicInfo = reactive({
  sn: props.sn,
  pubTopic: '',
  subTopic: ''
})

useMqtt(deviceTopicInfo)

// 飞行控制
const drcState = computed(() => {
  return store.state.deviceState?.dockInfo[props.sn]?.link_osd?.drc_state === DrcStateEnum.CONNECTED
})
const flightController = ref(drcState.value)

async function onClickFightControl () {
  if (flightController.value) {
    exitFlightCOntrol()
    return
  }
  enterFlightControl()
}

// 进入飞行控制
async function enterFlightControl () {
  try {
    const {
      code,
      data
    } = await postDrcEnter({
      client_id: clientId.value,
      dock_sn: props.sn,
    })
    if (code === 0) {
      flightController.value = true
      if (data.sub && data.sub.length > 0) {
        deviceTopicInfo.subTopic = data.sub[0]
      }
      if (data.pub && data.pub.length > 0) {
        deviceTopicInfo.pubTopic = data.pub[0]
      }
      // 获取飞行控制权
      if (droneControlSource.value !== ControlSource.A) {
        await postFlightAuth(props.sn)
      }
      ElMessage.success('Get flight control successfully')
    }
  } catch (error: any) {
  }
}

// 退出飞行控制
async function exitFlightCOntrol () {
  try {
    const { code } = await postDrcExit({
      client_id: clientId.value,
      dock_sn: props.sn,
    })
    if (code === 0) {
      flightController.value = false
      deviceTopicInfo.subTopic = ''
      deviceTopicInfo.pubTopic = ''
      ElMessage.success('Exit flight control')
    }
  } catch (error: any) {
  }
}

// drc mqtt message
// const { drcInfo } = useDroneControlMqttEvent(props.sn)

const {
  handleKeyup,
  handleEmergencyStop,
  resetControlState,
} = useManualControl(deviceTopicInfo, flightController)

function onMouseDown (type: KeyCode) {
  handleKeyup(type)
}

function onMouseUp () {
  resetControlState()
}

// 负载控制
const payloadSelectInfo = {
  value: null as any,
  controlSource: undefined as undefined | ControlSource,
  options: [] as any,
  payloadIndex: '' as string,
  camera: undefined as undefined | DeviceOsdCamera // 当前负载osd信息
}

const handlePayloadChange = (value: string) => {
  const payload = props.payloads?.find(item => item.payload_sn === value)
  if (payload) {
    payloadSelectInfo.payloadIndex = payload.payload_index || ''
    payloadSelectInfo.controlSource = payload.control_source
    payloadSelectInfo.camera = undefined
  }
}

// function getCurrentCamera (cameraList: CameraListItem[], cameraIndex?: string):CameraListItem | null {
//   let camera = null
//   cameraList.forEach(item => {
//     if (item.camera_index === cameraIndex) {
//       camera = item
//     }
//   })
//   return camera
// }

// const currentCamera = computed(() => {
//   return getCurrentCamera(props.deviceInfo.dock.basic_osd.live_capacity?.device_list[0]?.camera_list as CameraListItem[], camera_index)
// })
// 更新负载信息
watch(() => props.payloads, (payloads) => {
  console.log('payloads', payloads)
  if (payloads && payloads.length > 0) {
    payloadSelectInfo.value = payloads[0].payload_sn
    payloadSelectInfo.controlSource = payloads[0].control_source || ControlSource.B
    payloadSelectInfo.payloadIndex = payloads[0].payload_index || ''
    payloadSelectInfo.options = payloads.map(item => ({
      label: item.payload_name,
      value: item.payload_sn
    }))
    payloadSelectInfo.camera = undefined
  } else {
    payloadSelectInfo.value = null
    payloadSelectInfo.controlSource = undefined
    payloadSelectInfo.options = []
    payloadSelectInfo.payloadIndex = ''
    payloadSelectInfo.camera = undefined
  }
}, {
  immediate: true,
  deep: true
})
watch(() => props.deviceInfo.device, (droneOsd) => {
  if (droneOsd && droneOsd.cameras) {
    payloadSelectInfo.camera = droneOsd.cameras.find(item => item.payload_index === payloadSelectInfo.payloadIndex)
  } else {
    payloadSelectInfo.camera = undefined
  }
}, {
  immediate: true,
  deep: true
})

// ws 消息通知
const {
  droneControlSource,
  payloadControlSource
} = useDroneControlWsEvent(props.sn, payloadSelectInfo.value)
watch(() => payloadControlSource, (controlSource) => {
  payloadSelectInfo.controlSource = controlSource.value
}, {
  immediate: true,
  deep: true
})
const {
  checkPayloadAuth,
  authPayload,
  resetGimbal,
  switchCameraMode,
  takeCameraPhoto,
  startCameraRecording,
  stopCameraRecording,
  changeCameraFocalLength,
  cameraAim,
} = usePayloadControl()

// 准备使用偷鸡的办法实现，写死序列号
const payload_type = ref('81')

// console.log("props.sn", props.sn)

const airport_sn = ref("7CTDLCR00B8572")
const airport_sn_qingyuan = ref("7CTDL9K00A0059 ")

if(props.sn == "4TADL2L0010027") {
  payload_type.value = '53'
  airport_sn.value = "4TADL2L0010027"
}


payloadSelectInfo.payloadIndex = `${payload_type.value}-0-0`;
async function onAuthPayload () {
  console.log('onAuthPayload', payloadSelectInfo.payloadIndex, airport_sn_qingyuan.value)
  const result = await authPayload(airport_sn_qingyuan.value, payloadSelectInfo.payloadIndex)
  if (result) {
    payloadControlSource.value = ControlSource.A
  }
}

const gimbalResetPopoverData = reactive({
  visible: false,
  loading: false,
  resetMode: null as null | GimbalResetMode,
})

function onShowGimbalResetPopover () {
  gimbalResetPopoverData.visible = !gimbalResetPopoverData.visible
  gimbalResetPopoverData.loading = false
  gimbalResetPopoverData.resetMode = null
  console.log('onShowGimbalResetPopover', gimbalResetPopoverData)
}

// const

async function GimbalRecenter () {
  // GimbalResetModeOptions = "Gimbal Recenter"
  gimbalResetPopoverData.resetMode = 0
  try {
    await resetGimbal(airport_sn_qingyuan.value, {
      payload_index: payloadSelectInfo.payloadIndex,
      reset_mode: 0
    })
  } catch (err) {
  }
}

async function GimbalDown () {
  // GimbalResetModeOptions = "Gimbal Recenter"
  gimbalResetPopoverData.resetMode = 1
  try {
    await resetGimbal(airport_sn_qingyuan.value, {
      payload_index: payloadSelectInfo.payloadIndex,
      reset_mode: 1
    })
  } catch (err) {
  }
}


async function onGimbalResetConfirm (confirm: boolean) {
  if (confirm) {
    if (gimbalResetPopoverData.resetMode === null) {
      ElMessage.error('Please select reset mode')
      return
    }
    gimbalResetPopoverData.loading = true
    try {
      await resetGimbal(props.sn, {
        payload_index: payloadSelectInfo.payloadIndex,
        reset_mode: gimbalResetPopoverData.resetMode
      })
    } catch (err) {
    }
  }
  gimbalResetPopoverData.visible = false
}

async function onSwitchCameraMode () {
  if (!checkPayloadAuth(payloadSelectInfo.controlSource)) {
    return
  }
  const currentCameraMode = payloadSelectInfo.camera?.camera_mode
  await switchCameraMode(props.sn, {
    payload_index: payloadSelectInfo.payloadIndex,
    camera_mode: currentCameraMode === CameraMode.Photo ? CameraMode.Video : CameraMode.Photo
  })
}

async function onTakeCameraPhoto () {
  if (!checkPayloadAuth(payloadSelectInfo.controlSource)) {
    return
  }
  await takeCameraPhoto(props.sn, payloadSelectInfo.payloadIndex)
}

async function onStartCameraRecording () {
  if (!checkPayloadAuth(payloadSelectInfo.controlSource)) {
    return
  }
  await startCameraRecording(props.sn, payloadSelectInfo.payloadIndex)
}

async function onStopCameraRecording () {
  if (!checkPayloadAuth(payloadSelectInfo.controlSource)) {
    return
  }
  await stopCameraRecording(props.sn, payloadSelectInfo.payloadIndex)
}

const zoomFactorPopoverData = reactive({
  visible: false,
  loading: false,
  cameraType: null as null | CameraType,
  zoomFactor: null as null | number,
})

function onShowZoomFactorPopover () {
  zoomFactorPopoverData.visible = !zoomFactorPopoverData.visible
  zoomFactorPopoverData.loading = false
  zoomFactorPopoverData.cameraType = null
  zoomFactorPopoverData.zoomFactor = null
}

async function onZoomFactorConfirm (confirm: boolean) {
  if (confirm) {
    if (!zoomFactorPopoverData.zoomFactor || zoomFactorPopoverData.cameraType === null) {
      ElMessage.error('Please input Zoom Factor')
      return
    }
    zoomFactorPopoverData.loading = true
    try {
      await changeCameraFocalLength(props.sn, {
        payload_index: payloadSelectInfo.payloadIndex,
        camera_type: zoomFactorPopoverData.cameraType,
        zoom_factor: zoomFactorPopoverData.zoomFactor
      })
    } catch (err) {
    }
  }
  zoomFactorPopoverData.visible = false
}

const cameraAimPopoverData = reactive({
  visible: false,
  loading: false,
  cameraType: null as null | CameraType,
  locked: false,
  x: null as null | number,
  y: null as null | number,
})

function onShowCameraAimPopover () {
  cameraAimPopoverData.visible = !cameraAimPopoverData.visible
  cameraAimPopoverData.loading = false
  cameraAimPopoverData.cameraType = null
  cameraAimPopoverData.locked = false
  cameraAimPopoverData.x = null
  cameraAimPopoverData.y = null
}

async function onCameraAimConfirm (confirm: boolean) {
  if (confirm) {
    if (cameraAimPopoverData.cameraType === null || cameraAimPopoverData.x === null || cameraAimPopoverData.y === null) {
      ElMessage.error('Input error')
      return
    }
    try {
      await cameraAim(props.sn, {
        payload_index: payloadSelectInfo.payloadIndex,
        camera_type: cameraAimPopoverData.cameraType,
        locked: cameraAimPopoverData.locked,
        x: cameraAimPopoverData.x,
        y: cameraAimPopoverData.y,
      })
    } catch (error) {
    }
  }
  cameraAimPopoverData.visible = false
}


</script>

<style scoped lang="scss">
.Table {
  padding-top: 15px;
  padding-left: 15px;
  position: absolute;
  right: 21%;
  bottom: 30px;
  background-color: black;
  opacity: 0.7;
  border-radius: 10px;
}

.drone-control-header {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  font-size: $FirstLevelTitleFontSize;
  font-family: $FirstLevelTitleFontFamily;
  color: $FirstLevelTitleColor;
  font-weight: $FirstLevelTitleFontWeight;
  padding: 16px 20px 0px 18px;
  box-sizing: border-box;
}

.orange-dot {
  width: 6px;
  height: 6px;
  background-color: $TouchColor;
}

.row{
  display: flex;
  justify-content: center;
  margin-top: 8px;
}

.big-btn{
  width: 75px;
  height: 25px;
  border-radius: 5px;
}

.btn {
  background: transparent;
  //鼠标悬浮
  &:hover {
    background: $TouchColor2;
    color: $TouchColor;
    border: 1px solid $TouchColor;
  }
  &:active {
    background: $TouchColor2;
    color: $TouchColor;
    border: 1px solid $TouchColor;
  }
  &:focus {
    background: $TouchColor2;
    color: $TouchColor;
    border: 1px solid $TouchColor;
  }
}

.box {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 10px;
    gap:38px;
}
</style>
  