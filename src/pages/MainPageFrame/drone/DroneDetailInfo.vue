<template>
  <div class="drone_block_parent">
    <div class="drone_block">
      <div class="BlockContent">
        <div class="drone-info">
          <div class="info-center">
            <div class="info-center__title">
              名称： {{ droneInfo.nickname }}
            </div>
            <div>
              型号：{{ droneInfo.device_name ? droneInfo.device_name : str }}
            </div>
          </div>
          <div class="info-right">
            <div class="circle" :style="deviceInfo?.device?.mode_code !== 14 ? 'background: #19BE6B;' : 'background: red;'"> </div>
            <div style="padding-left: 12px;width: 75%;"> {{ EDroneModeCode }} </div>
          </div>
        </div>
        <div class="flex-display">
          <VideoFrame @toFullScreen="toFull_sc" :videoSource="{aisource: '', norsource: droneOutLiveStream, sn: device_sn}"
                      :class="isFull?'dronevideo_frame_':'dronevideo_frame'"
                      ref="dronevideo_frame"></VideoFrame>
        </div>

        <div class="drone_option" style="display: flex;justify-content: center;padding-top: 15px">
          <el-link @click="isShowInfo=!isShowInfo" :type="isShowInfo? 'danger' : 'success'" style="margin-right: 15px">
            {{isShowInfo? "关闭无人机详情":"无人机详情"}}<el-icon ><icon-view /></el-icon>
          </el-link>
          <el-link @click="isShowControl=!isShowControl" :type="isShowControl? 'danger' : 'success'" style="margin-left: 15px">
            {{isShowControl? "关闭无人机控制":"无人机控制"}}<el-icon ><icon-view /></el-icon>
          </el-link>
        </div>
      </div>
    </div>

    <div class="drone-info_1" v-if="isShowInfo">
      <div class="drone-control-header">
        <div class="orange-dot"></div>
        <div>无人机详情</div>
      </div>
      <div class="TableFirstRow">
        <div class="TableBox DroneElectricitLevel" >
          <div class="table-title">无人机电量<br></div>
          <div class="table-content">{{!deviceInfo.device.battery.capacity_percent || deviceInfo.device.battery.capacity_percent === str ? str : deviceInfo.device.battery?.capacity_percent + ' %'}}</div>
        </div>
        <div class="TableBox" >
          <div class="table-title">GPS<br></div>
          <div class="table-content">{{deviceInfo.device.position_state.gps_number ? deviceInfo.device.position_state.gps_number : str}}</div>
        </div>
        <div class="TableBox" >
          <div class="table-title">RTK<br></div>
          <div class="table-content">{{deviceInfo.device.position_state.rtk_number ? deviceInfo.device.position_state.rtk_number : str}}</div>
        </div>
      </div>
      <div class="TableFirstRow">
        <div class="TableBox DroneElectricitLevel" >
          <div class="table-title">飞行模式<br></div>
          <div class="table-content">{{EGear}}</div>
        </div>
        <div class="TableBox " >
          <div class="table-title">海拔高度<br></div>
          <div class="table-content">{{!deviceInfo.device.height || deviceInfo.device.height === str ? str : deviceInfo.device?.height.toFixed(2) + ' m'}}</div>
        </div>
        <div class="TableBox " >
          <div class="table-title">相对起飞点高度<br></div>
          <div class="table-content">{{!deviceInfo.device.elevation || deviceInfo.device.elevation === str ? str : deviceInfo.device?.elevation.toFixed(2) + ' m'}}</div>
        </div>
      </div>
      <div class="TableFirstRow">
        <div class="TableBox DroneElectricitLevel" >
          <div class="table-title">相距起飞点距离<br></div>
          <div class="table-content">{{!deviceInfo.device.home_distance || deviceInfo.device.home_distance === str ? str : deviceInfo.device?.home_distance.toFixed(2) + ' m'}}</div>
        </div>
        <div class="TableBox " >
          <div class="table-title">水平速度<br></div>
          <div class="table-content">{{!deviceInfo.device.horizontal_speed || deviceInfo.device?.horizontal_speed === str ? str : deviceInfo.device?.horizontal_speed.toFixed(2) + ' m/s'}}</div>
        </div>
        <div class="TableBox " >
          <div class="table-title">垂直速度<br></div>
          <div class="table-content">{{!deviceInfo.device.vertical_speed || deviceInfo.device.vertical_speed === str ? str : deviceInfo.device?.vertical_speed.toFixed(2) + ' m/s'}}</div>
        </div>
      </div>
      <div class="TableFirstRow">
        <div class="TableBox DroneElectricitLevel" >
          <div class="table-title">相距起飞点距离<br></div>
          <div class="table-content">{{!deviceInfo.device.home_distance || deviceInfo.device.home_distance === str ? str : deviceInfo.device?.home_distance.toFixed(2) + ' m'}}</div>
        </div>
        <div class="TableBox " >
          <div class="table-title">水平速度<br></div>
          <div class="table-content">{{!deviceInfo.device.horizontal_speed || deviceInfo.device?.horizontal_speed === str ? str : deviceInfo.device?.horizontal_speed.toFixed(2) + ' m/s'}}</div>
        </div>
        <div class="TableBox " >
          <div class="table-title">垂直速度<br></div>
          <div class="table-content">{{!deviceInfo.device.vertical_speed || deviceInfo.device.vertical_speed === str ? str : deviceInfo.device?.vertical_speed.toFixed(2) + ' m/s'}}</div>
        </div>
      </div>
      <div class="TableFirstRow">
        <div class="TableBox DroneElectricitLevel" >
          <div class="table-title">风速<br></div>
          <div class="table-content">{{!deviceInfo.device.wind_speed || deviceInfo.device.wind_speed === str ? str : (deviceInfo.device?.wind_speed / 10).toFixed(2) + ' m/s'}}</div>
        </div>
        <div class="TableBox " >
        </div>
        <div class="TableBox " >
        </div>
      </div>
    </div>

    <div class="drone_control" v-if="isShowControl">
      <drone-control payloads="" :sn="control_sn" :device-info="deviceInfo"></drone-control>
      <pay-load-control :sn="control_sn" :device-info="deviceInfo"></pay-load-control>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed, onMounted, onBeforeUnmount,defineEmits,defineExpose } from 'vue'
import VideoFrame from '@/pages/MainPageFrame/components/VideoFrame.vue'
import DroneControl from "@/pages/ResourceManagement/components/Drone/DroneControl.vue";
import PayLoadControl from "@/pages/ResourceManagement/components/Drone/PayLoadControl.vue";
import { DeviceOsd, DeviceInfo } from "@/store/types/device";
import { getBindingDeviceBySn,updateDroneInfo } from '@/api/device'
import {Close, MessageBox} from '@element-plus/icons-vue'
import { stopLivestream, getLiveAddress, startLivestream, getAILive, getLivestatus } from "@/api/live"
import { useRoute, useRouter } from 'vue-router';
import { useMyStore } from "@/store"
import {
    Check,
} from '@element-plus/icons-vue'
import { Edit, View as IconView } from '@element-plus/icons-vue'
const emit = defineEmits(['show-info-changed']);

const store = useMyStore()
const route = useRoute();
const router = useRouter();

// 设备信息
const str = ref('--')
const deviceInfo = reactive({
  device: {
    gear: -1,
    mode_code: 14,
    height: str,
    home_distance: str,
    horizontal_speed: str,
    vertical_speed: str,
    wind_speed: str,
    wind_direction: str,
    elevation: str,
    position_state: {
      gps_number: str,
      is_fixed: 0,
      rtk_number: str
    },
    battery: {
      capacity_percent: str,
      landing_power: str,
      remain_flight_time: 0,
      return_home_power: str,
    },
    latitude: 0,
    longitude: 0,
  },
  dock: {
    link_osd: {
      sdr: {
        up_quality: str,
        down_quality: str
      }
    }
  },
  waylineId: 'waylineId',
  deviceSn: 'deviceSn',
  createTime: 'createTime'
  });

const dronePicture = ref('https://img1.imgtp.com/2023/03/20/cvEc1DpG.png')
const control_sn = ref()
const device_sn = ref("");

// 信息是否展开
const isShowInfo = ref(false)
const isShowControl = ref(false)

watch(isShowInfo,()=>{
  if(isShowInfo.value){
    emit('show-info-changed', isShowInfo.value);
    isShowControl.value = false
  }else {
    if(isShowControl.value === false){
      emit('show-info-changed', isShowInfo.value);
    }
  }
})

watch(isShowControl,()=>{
  if(isShowControl.value){
    emit('show-info-changed', isShowControl.value);
    isShowInfo.value = false
  }else{
    if(isShowInfo.value === false){
      emit('show-info-changed', isShowControl.value);
    }
  }
})

const closeAll =()=>{
  isShowInfo.value = false
  isShowControl.value = false
}

defineExpose({ closeAll });

onMounted(() => {
  isEditing.value = false
  getDeviceInfo()
  device_sn.value = store.state.iframeDroneSn
  getBindingDeviceBySn({
    workspace_id: JSON.parse(localStorage.getItem('userInfo') as string).workspace_id,
    device_sn: '4TADL2L0010027'
  }).then(res => {
    // console.log(res)
    if(res.code === 0) {
      if (res.data.child_device_sn == device_sn.value) {
        control_sn.value = '4TADL2L0010027'
      } else {
        control_sn.value = device_sn.value
      }
    }
  })
})

// 获取设备信息
let droneInfo = reactive({} as DeviceInfo)
const getDeviceInfo = async () => {
  if (route.query.device_sn) {
    getBindingDeviceBySn({
      workspace_id: JSON.parse(localStorage.getItem('userInfo') as string).workspace_id,
      device_sn: route.query.device_sn as string
    }).then(res => {
      // console.log(res)
      if(res.code === 0) {
        droneInfo = res.data
          inputValue.value = droneInfo.nickname
        getDroneLiveStream()
      }
    })
  }
};

// 监听设备信息
watch(() => store.state.deviceState, (newData, oldData) => {
  if (newData.currentType === 2 && newData.deviceInfo[newData.currentSn]) {
    // console.log('drone', newData)
    deviceInfo.device = newData.deviceInfo[droneInfo.device_sn]
	  // videoFusionValue(deviceInfo.device, droneInfo.device_sn)
  }
}, { deep: true, })

// 监听路由
watch(() => route.query.device_sn, (newData, oldData) => {
  getDeviceInfo()
}, { deep: true })

const SnName = computed (()=>{
  return droneInfo.device_name
})

const EModeCode = computed (()=>{
  switch (deviceInfo.device?.mode_code) {
    case 0:
      return '待命' // 新建计划
    case 1:
      return '准备中' // 已有计划
    case 2:
      return '已就绪'
    case 3:
      return '手动操作'
    case 4:
      return '自动操作'
    case 5:
      return '航点'
    case 6:
      return '全景'
    case 7:
      return '自动跟踪'
    case 8:
      return '广播式自动相关监视'
    case 9:
      return '返航中'
    case 10:
      return '着陆中'
    case 11:
      return '迫降中'
    case 12:
      return '三桨叶着陆中'
    case 13:
      return '升级中' //禁用
    case 14:
      return '未连接' //禁用
    default:
      return '未连接'
  }
})

const EGear = computed (()=>{
  switch (deviceInfo.device?.gear) {
    case 0:
      return 'A'
    case 1:
      return 'P'
    case 2:
      return 'NAV'
    case 3:
      return 'FPV'
    case 4:
      return 'FROM'
    case 5:
      return 'S'
    case 6:
      return 'F'
    case 7:
      return 'M'
    case 8:
      return 'G'
    case 9:
      return 'T'
    default:
      return '--'
  }
})

const isFull = ref(false)
const toFull_sc = (isF: any) => {
  isFull.value = isF
};

// deviceWatch(droneOutLiveStream, (val) => {
//   getAILive(droneInfo.device_sn).then(res => {
//     console.log('getAIlive', res)
//     this.aiDroneStream = res.data.webRtcStream
//   })
// })

// deviceWatch(() => props.deviceInfo, (newData, oldData) => {
//     if ( newData.device && !droneOutLiveStream.value && isloading.value ) {
//       getDroneLiveStream()
//     }
//   }, { deep: true }
// // )

const droneOutLiveStream = ref(false)
const aiDroneStream = ref(null)
const isloading = ref(false)

const getDroneLiveStream = async function () {
  let rtmpUrl = await getLiveAddress()
  isloading.value = !isloading.value

  const timestamp = route.query.device_sn
  let liveUrl = rtmpUrl.data + timestamp
  let videoID = droneInfo.device_sn + '/53-0-0/normal-0'
  let urlType = '1'
  let videoQ = '2'
  console.log(liveUrl)
  getLivestatus(timestamp as string).then(res => {
    // console.log(res)
    if (res.data.webRtcStream) {
      droneOutLiveStream.value = res.data.webRtcStream
      store.commit('SET_LIVE_STREAM', {sn: timestamp, vid: videoID})
    } else {
      startLivestream({
        url: liveUrl,
        video_id: videoID,
        url_type: urlType,
        video_quality: videoQ
      }).then(res => {
        // console.log('start', res)
        if (res.data.url) {
          droneOutLiveStream.value = res.data.url
          store.commit('SET_LIVE_STREAM', {sn: timestamp, vid: videoID})
        }
      })
    }
  })
}

const EDroneModeCode = computed(() => {
  switch (deviceInfo.device?.mode_code) {
    case 0:
      return '待命' // 新建计划
    case 1:
      return '准备中' // 已有计划
    case 2:
      return '已就绪'
    case 3:
      return '手动操作'
    case 4:
      return '自动操作'
    case 5:
      return '航点'
    case 6:
      return '全景'
    case 7:
      return '自动跟踪'
    case 8:
      return '广播式自动相关监视'
    case 9:
      return '返航中'
    case 10:
      return '着陆中'
    case 11:
      return '迫降中'
    case 12:
      return '三桨叶着陆中'
    case 13:
      return '升级中' //禁用
    case 14:
      return '未连接' //禁用
    default:
      return '未连接'
  }
})


onBeforeUnmount(() => {
  closeLiveStream()
});
const closeLiveStream = () => {
  if (droneInfo && store.state.liveStreamState[droneInfo.device_sn]) {
    stopLivestream({
      video_id: store.state.liveStreamState[droneInfo.device_sn]
    }).then(res => {
      console.log('无人机' + droneInfo.device_sn + '直播流已断开')
    })
  }
}
const back = () => {
  router.back()
}


// 设备名称更改
const isEditing = ref(true)
const toggleEdit = () => {
    if (isEditing.value) {
        // console.log("droneInfo",droneInfo)
        droneInfo.nickname = inputValue.value
        updateDroneInfo(droneInfo).then(res => {
            // console.log(res)
            if (res.code === 0) {
                ElMessage({
                    message: '修改成功',
                    type: 'success'
                })
            }else{
                ElMessage({
                    message: res.message,
                    type: 'error'
                })
            }
        })
        // 提交
        console.log('提交')
    } else {
        // 编辑
        console.log('编辑')
    }
  isEditing.value = !isEditing.value
  inputValue.value = droneInfo.nickname
}
const inputValue = ref("")

</script>

<style scoped lang="scss">
.drone_block_parent{
  display: flex;
}

.editNickName{
  width:120px;
  font-size: 12px;
  color: white;
  background: transparent;
  border: none;
  padding: 0;
  margin: 0;
}
.drone_block {
  width: 300px;
  height: 100%;
  // overflow: hidden auto;
  background-color: $ComponentBackground;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.flex-display {
  display: flex;
  width: calc(100% - 16px);
  padding-top: 16px;
  padding-left: 16px;
}
.circle {
  border-radius: 50%;
  width: 10px;
  height: 10px;
  margin-top: auto;
  margin-bottom: auto;
  margin-left: 10px;
}
.ml10 {
  margin-left: 10px;
  font-size: 14px;
  color: white;
}

.AssociatedDevice{
  display: flex;
  border-radius: 4px;
  width: 340px;
  height: 61px;
  background: #F9A100;
  font-size: 10px;
  padding-bottom: 3px;
  font-weight: 400;
  margin-top: 17px;
  margin-right: 28px;
  margin-left: 20px;
}
.DeviceImg{
  margin-top: 5px;
  margin-left: 12px;
}
.DeviceName{
  margin-top: 14px;
  margin-left:10px ;
  line-height: 1.5;
  color: white;
  width: 100px;
}
.green-dot {
  width: 5px;
  height: 5px;
  background: #19BE6B;
  border-radius: 50%;
  margin-left: 80px;
  margin-top: 30px;
}
.DeviceState1{
  margin-top: 24px;
  margin-left:10px ;
  line-height: 1.5;
  color: white;
}
.TableFirstRow{
  margin-top: 16px;
  display: flex;
  justify-content: space-between;
  width: 100%;
}
.TableBox{
  width: 50%;
  text-align: center;
}
.table-title {
  font-size: $AnnotateFontSize;
  font-family: $AnnotateFontFamily;
  color: $AnnotateColor;
  font-weight: $AnnotateFontWeight;
}
.table-content {
  padding-top: 16px;
  font-size: $ContentFontSize;
  font-family: $ContentFontFamily;
  color: $ContentColor;
  font-weight: $ContentFontWeight;
}
.BlockTitle{
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  width: 300px;
  font-size: $FirstLevelTitleFontSize;
  font-family: $FirstLevelTitleFontFamily;
  color: $FirstLevelTitleColor;
  font-weight: $FirstLevelTitleFontWeight;
  box-sizing: border-box;
}
.PlanName{
  width: 150px;
  flex: 1;
}
.orange-dot {
  width: 6px;
  height: 6px;
  background-color: $TouchColor;
}
.btn-backward {
  font-size: $IconSize;
  color: $IconColor;
}
.btn-backward:hover {
  cursor: pointer;
  color: $TouchColor;
}

/* 设备信息 */
.drone-info {
  width: 280px;
  height: 62px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0px;
  box-sizing: border-box;
  font-size: $ContentFontSize;
  font-family: $ContentFontFamily;
  color: $ContentColor;
  font-weight: $ContentFontWeight;
  background: $TouchColor2;
  border-radius: 4px;
  margin: 0px $ComponentGap;
  box-sizing: border-box;
}

.drone-info_1{
  width: 280px;
  height: 62px;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0px;
  box-sizing: border-box;
  font-size: $ContentFontSize;
  font-family: $ContentFontFamily;
  color: $ContentColor;
  font-weight: $ContentFontWeight;
  background: $TouchColor2;
  border-radius: 4px;
  margin: 0px $ComponentGap;
  box-sizing: border-box;
}

.drone_control{
  width: 300px;
}

.info-left {
  width: 76px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.info-center {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.info-center__title {
  color: $TouchColor;
  padding-bottom: 8px;
  font-size: 15px
}

.info-right {
  width: 76px;
  display: flex;
  align-items: center;
}

.circle {
  border-radius: 50%;
  width: 8px;
  height: 8px;
}

.BlockContent {
  overflow: hidden auto;
}

.BlockContent::-webkit-scrollbar {
  height: $ScrollbarHeight;
  width: $ScrollbarWidth;
}
.BlockContent::-webkit-scrollbar-thumb {
  border-radius: $ScrollbarBorderRadius;
  -webkit-box-shadow: $ScrollbarBoxShadow;
  background: $ScrollbarColor;
}
.BlockContent::-webkit-scrollbar-track {
  -webkit-box-shadow: $ScrollbarBoxShadow;
  border-radius: $ScrollbarBorderRadius;
  background: $ScrollbarBackgroundColor;
}

.TheEditIcon{
  position:absolute;
  background-image: url("../../../../assets/TaskDeployment/EditIcon.png");
  width: 20px;
  height: 20px;
  background-size: cover;
  left: 240px;
  top: 60px;
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
</style>
