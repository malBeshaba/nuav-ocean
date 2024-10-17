<template>
  <div class="drone-control-wrapper">
    <div class="drone-control-header">
      <div class="orange-dot"></div>
      <div>无人机控制</div>
    </div>
    <div class="drone-control-box">
     <div class="box">
       <div class="row">
         <div class="drone-control">
           <el-button class="btn" size="small" @click="onClickFightControl">{{ flightController ? '退出无人机控制' : '获取无人机控制'}}</el-button>
         </div>
       </div>
       <div class="row" style="display: flex; flex-wrap: wrap;">
         <el-button class="btn" size="small" type="ghost" @mousedown="onMouseDown(KeyCode.KEY_Q)" @mouseup="onMouseUp">
           <i class="el-icon-back"></i> Q
         </el-button>
         <el-button class="btn" size="small" type="ghost" @mousedown="onMouseDown(KeyCode.KEY_W)" @mouseup="onMouseUp">
           <i class="el-icon-caret-top"></i> W
         </el-button>
         <el-button class="btn" size="small" type="ghost" @mousedown="onMouseDown(KeyCode.KEY_E)" @mouseup="onMouseUp">
           <i class="el-icon-forward"></i> E
         </el-button>
         <el-button class="btn" size="small" type="ghost" @mousedown="onMouseDown(KeyCode.ARROW_UP)" @mouseup="onMouseUp">
           <i class="el-icon-arrow-up"></i> 上
         </el-button>
         <br>
         <el-button class="btn" size="small" type="ghost" @mousedown="onMouseDown(KeyCode.KEY_A)" @mouseup="onMouseUp">
           <i class="el-icon-caret-left"></i> A
         </el-button>
         <el-button class="btn" size="small" type="ghost" @mousedown="onMouseDown(KeyCode.KEY_S)" @mouseup="onMouseUp">
           <i class="el-icon-caret-bottom"></i> S
         </el-button>
         <el-button class="btn" size="small" type="ghost" @mousedown="onMouseDown(KeyCode.KEY_D)" @mouseup="onMouseUp">
           <i class="el-icon-caret-right"></i> D
         </el-button>
         <el-button class="btn" size="small" type="ghost" @mousedown="onMouseDown(KeyCode.ARROW_DOWN)" @mouseup="onMouseUp">
           <i class="el-icon-arrow-down"></i> 下
         </el-button>
<!--         <el-button type="primary" size="small" danger ghost @click="handleEmergencyStop" >-->
<!--           <i class="el-icon-pause-circle-outline"></i> Break-->
<!--         </el-button>-->
       </div>
       <div class="row">
         <div class="from">
           <el-form class="Table" :model="flyToForm" v-if="isShowFlyto">
             <el-form-item label="经度:">
              <el-input-number v-model="flyToForm.latitude"></el-input-number>
             </el-form-item>
             <el-form-item label="纬度:">
               <el-input-number v-model="flyToForm.longitude"></el-input-number>
             </el-form-item>
             <el-form-item label="高度(m):">
               <el-input-number v-model="flyToForm.height"></el-input-number>
             </el-form-item>
             <el-form-item>
               <el-button type="primary" @click="onSubmitFlyTo">Create</el-button>
               <el-button @click="Cancel">Cancel</el-button>
             </el-form-item>`
           </el-form>
           <el-button class="btn" size="small" @click="onShowFlyToPopover">顶点飞行</el-button>
           <el-button class="btn" size="small" @click="onStopFlyToPoint">停止飞行</el-button>
         </div>
         <div class="from">
           <el-form class="Table" :model="takeOffForm" v-if="takeOffFormShow">
             <el-form-item label="经度:">
               <el-input-number v-model="takeOffForm.latitude"></el-input-number>
             </el-form-item>
             <el-form-item label="纬度:">
               <el-input-number v-model="takeOffForm.longitude"></el-input-number>
             </el-form-item>
             <el-form-item label="高度(m):">
               <el-input-number v-model="takeOffForm.height"></el-input-number>
             </el-form-item>
             <el-form-item label="安全起飞高度(m):">
               <el-input-number v-model="takeOffForm.securityTakeoffHeight"></el-input-number>
             </el-form-item>
             <el-form-item label="返航高度(m):">
               <el-input-number v-model="takeOffForm.rthAltitude"></el-input-number>
             </el-form-item>
             <el-form-item label="失联动作(m):">
               <el-select v-model="takeOffForm.rcLostAction">
                 <div v-for="option in LostControlActionInCommandFLightOptions" :key="option">
                   <el-option :label="option.label" :value="option.value"></el-option>
                 </div>
               </el-select>
             </el-form-item>
             <el-form-item label="航线失联动作(m):">
               <el-select v-model="takeOffForm.exitWaylineWhenRcLost">
                 <div v-for="option in WaylineLostControlActionInCommandFlightOptions" :key="option">
                   <el-option :label="option.label" :value="option.value"></el-option>
                 </div>
               </el-select>
             </el-form-item>
             <el-form-item>
               <el-button type="primary" @click="onSubmitTakeOff">Create</el-button>
               <el-button>Cancel</el-button>
             </el-form-item>
           </el-form>
           <el-button class="btn" size="small" @click="onShowTakeoffToPointPopover">一键起飞</el-button>
         </div>
         <el-button class="btn" size="small" @click="returnHome">返航</el-button>
       </div>

     </div>
   </div>
 </div>
</template>

<script setup lang="ts">
import {ref, reactive, computed, onMounted, onUnmounted} from "vue";
import {useMyStore} from "@/store";
import {postDrcEnter, postDrcExit, postDrc} from "@/api/drc";
import {DeviceInfoType, PayloadInfo, ControlSource, DeviceOsdCamera} from "@/store/types/device";
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
import {LostControlActionInCommandFLightOptions, WaylineLostControlActionInCommandFlightOptions} from "@/pages/ResourceManagement/components/Drone/types/drone-control";

const store = useMyStore()
const flightController = ref(false)
const payloadController = ref(false)
const isShowFlyto = ref(false)
const props = defineProps<{
  sn: string,
  deviceInfo: DeviceInfoType,
  payloads: null | PayloadInfo[]
}>()
const flyToForm = reactive({
  latitude: 0.0,
  longitude: 0.0,
  height: 0
})
const takeOffForm = reactive({
  latitude: 23.1479628584375,
  longitude: 113.02278860922384,
  height: 100,
  securityTakeoffHeight: 100,
  rthAltitude: 100,
  rcLostAction: LostControlActionInCommandFLight.RETURN_HOME,
  exitWaylineWhenRcLost: WaylineLostControlActionInCommandFlight.CONTINUE
})
const onSubmitFlyTo = async () => {
  console.log(flyToForm)
  await postFlyToPoint(props.sn, {
    max_speed: 14,
    points: [{
      latitude: flyToForm.latitude,
      longitude: flyToForm.longitude,
      height: flyToForm.height
    }]
  })
}
const onShowFlyToPopover = () => {
  isShowFlyto.value = !isShowFlyto.value
}
const deviceTopicInfo: DeviceTopicInfo = reactive({
  sn: props.sn,
  pubTopic: '',
  subTopic: ''
})
type StatusOptions = {
  status: 'close';
  event?: CloseEvent;
} | {
  status: 'open';
  retryCount: number;
} | {
  status: 'pending';
}

const mqttState = ref<UranusMqtt | null>(null)
const connectMqtt = async () => {

  if (mqttState.value) return
  const result = await postDrc({})
  console.log(result)
  if (result?.code === 0) {
    const {address, client_id, username, password, expire_time} = result.data
    // @TODO: 校验 expire_time
    mqttState.value = new UranusMqtt(address, {
      clientId: client_id,
      username,
      password,
    })
    console.log('mqttSate', mqttState.value)
    mqttState.value?.initMqtt()
    mqttState.value?.on('onStatus', (statusOptions: StatusOptions) => {
      // @TODO: 异常case
    })
    store.commit('SET_MQTT_STATE', mqttState.value)
    store.commit('SET_CLIENT_ID', 'client_id')
    // console.log(''store.state.mqttState)
  }
  return
}
const exitMqtt = async () => {
  mqttState.value?.destroyed()
  mqttState.value = null
  store.commit('SET_MQTT_STATE', null)
  store.commit('SET_CLIENT_ID', '')
}

onMounted(() => {
  console.log('mounted', props.sn)
  connectMqtt()
  setTimeout(() => {
    useMqtt(deviceTopicInfo)
  }, 1000)
})
onUnmounted(() => {
  console.log('unmounted')
  exitMqtt()
})
async function onClickFightControl () {
  if (flightController.value) {
    await exitFlightControl()
    return
  }
  await enterFlightControl()
}
const clientId = computed(() => {
  return store.state.clientId
})
const payloadSelectInfo = {
  value: null as any,
  controlSource: undefined as undefined | ControlSource,
  options: [] as any,
  payloadIndex: '' as string,
  camera: undefined as undefined | DeviceOsdCamera // 当前负载osd信息
}
const { droneControlSource, payloadControlSource } = useDroneControlWsEvent(props.sn, payloadSelectInfo.value)

async function exitFlightControl () {
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
async function enterFlightControl () {
  try {
    const { code, data } = await postDrcEnter({
      client_id: clientId.value,
      dock_sn: props.sn,
    })
    console.log('postDrcEnter', data, code, props.sn)
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
const takeOffFormShow = ref(false)
const onShowTakeoffToPointPopover = () => {
  takeOffFormShow.value = !takeOffFormShow.value
}
const onStopFlyToPoint = async () => {
  await deleteFlyToPoint(props.sn)
}
const onSubmitTakeOff = async () => {
  await postTakeoffToPoint(props.sn, {
    target_latitude: takeOffForm.latitude,
    target_longitude: takeOffForm.longitude,
    target_height: takeOffForm.height,
    security_takeoff_height: takeOffForm.securityTakeoffHeight,
    rth_altitude: takeOffForm.rthAltitude,
    max_speed: 14,
    rc_lost_action: takeOffForm.rcLostAction,
    exit_wayline_when_rc_lost: takeOffForm.exitWaylineWhenRcLost
  }).then(res => {
    console.log(res)
    if (res.code === '0') {
      ElMessage.success('一键起飞成功')
    }
  })
}
const returnHome = async () => {
  await retuenHome(props.sn)
}
const Cancel = async () => {
  isShowFlyto.value = !isShowFlyto.value
  takeOffFormShow.value = !takeOffFormShow.value
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
</style>
