<template>
  <div class="DetailInformationPanel">
    <div class="PlanTitle">
      <div class="orange-dot"></div>
      <div class="PlanName">{{PlanTitle}}</div>
      <div class="CloseDetailInformationPanel" @click="backToEquipmentDetail()">×</div>
    </div>
    <div class="PlanExecuteType">
      <img class="TypeImg" src="@assets/TaskDeployment/Mission.png" >
      <div class="PlanExecutetypeText">{{PlanExecutetype}}</div>
    </div>
    <div class="switch_view">
      <el-switch
        v-model="switchView"
        active-color="$TouchColor"
        inactive-color="$TouchColor"
        active-text="跟随飞行"
        inactive-text="鸟瞰视角"
        @change="switchViewChange"></el-switch>
    </div>
    <div class="PlanTextInformation">
      <div class="CompletionDegree">完成度： {{CompletionDegree}}%</div>
<!--      <div class="TaskAccessTime">任务开始时间： {{TaskStartTime}}</div>-->
      <div class="TaskAccessDuration">航线长度： {{lineDistance}}m</div>
<!--      <div class="EstimatedCompletionTime">预计完成时间： {{EstimatedCompletionTime}}</div>-->
      <div class="RemainingDuration">任务所需时长： {{RemainingDuration}}</div>
    </div>
    <div class="TableFirstRow">
      <div class="TableBox DroneElectricitLevel" >
        <span class="table-title">无人机电量<br></span>
        <span class="table-content">{{deviceInfo.device && deviceInfo.device.battery.capacity_percent !== str ? deviceInfo.device?.battery.capacity_percent + ' %' : str}}</span>
      </div>
      <div class="TableBox " >
        <span class="table-title">GNSS 卫星数<br></span>
        <span class="table-content">{{deviceInfo.device ? deviceInfo.device.position_state.gps_number : str}}</span>
      </div>
      <div class="TableBox " >
        <span class="table-title">无人机挡位<br></span>
        <span class="table-content">{{EGear}}</span>
      </div>
    </div>
<!--    这里的类名实际上应当顺序为第二行第三行，但是为了少一点css所以还是写了重复的类名-->
    <div class="TableFirstRow">
      <div class="TableBox " >
        <span class="table-title">绝对海拔<br></span>
        <span class="table-content">{{!deviceInfo.device || deviceInfo.device.height === str ? str : deviceInfo.device?.height.toFixed(2) + ' m'}}</span>
      </div>
      <div class="TableBox " >
        <span class="table-title">执行到的航点<br></span>
        <span class="table-content">{{WaypointCount}}</span>
      </div>
      <div class="TableBox " >
        <span class="table-title">相对地面高度<br></span>
        <span class="table-content">{{!deviceInfo.device || deviceInfo.device.elevation === str ? str : deviceInfo.device?.elevation.toFixed(2) + ' m'}}</span>
      </div>
    </div>
    <div class="TableFirstRow">
      <div class="TableBox " >
        <span class="table-title">水平分速度一<br></span>
        <span class="table-content">{{HorizontalVelocity1}}</span>
      </div>
<!--      <div class="TableBox " >-->
<!--        <span class="table-title">拍照数<br></span>-->
<!--        <span class="table-content">{{PhotosTakenNum}}</span>-->
<!--      </div>-->
      <div class="TableBox " >
        <span class="table-title">纵向速度<br></span>
        <span class="table-content">{{!deviceInfo.device || deviceInfo.device.vertical_speed === str ? str : deviceInfo.device?.vertical_speed.toFixed(2) + ' m/s'}}</span>
      </div>
      <div class="TableBox " >
        <span class="table-title">水平分速度二<br></span>
        <span class="table-content">{{HorizontalVelocity2}}</span>
      </div>
<!--      <div class="TableBox " >-->
<!--        <span class="table-title">录像数<br></span>-->
<!--        <span class="table-content">{{RecordingNum}}</span>-->
<!--      </div>-->
    </div>
    <div class="TableFirstRow">


      <div class="TableBox " ></div>
    </div>
    <VideoFrame style="width: 340px; margin-left: 33px;" v-if="droneOutLiveStream" :videoSource="{sn: String(drone_sn), norsource: String(droneOutLiveStream)}"
                ref="dronevideo_frame"></VideoFrame>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted, watch, computed, reactive, onBeforeUnmount} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useMyStore } from "@/store"
import {getFlightPlanById} from "@/api/droneFlightPlan";
import {DeviceInfo, DeviceOsd, DockOsd} from "@/store/types/device";
import VideoFrame from '@/pages/ResourceManagement/components/Dock/VideoFrame.vue'
import {getLiveAddress, getLivestatus, startLivestream, stopLivestream} from "@/api/live";
import {getBindingDeviceBySn} from "@/api/device";
import WebrtcPlayer from '@/components/video/WebrtcPlayer.vue'
import {VideoFusion} from '@/components/mapTools/class/MapVideoFusionClass'
// @ts-ignore
import droneModel from '@assets/models/airDrone.glb'
import * as Cesium from 'cesium'
import {DrawPolyline, RemoveEntitiesByBatch} from '@/components/mapTools/BaseMapTools'
import * as geolib from 'geolib';
import {getWaylineById, getWaylineGlobalParamsByWaylineId} from "@/api/wayline";
import {getWayLinePointByGlobalParamsId} from "@/api/wayLinePoint";
import {WayLinePointUpload} from "@/store/types/wayline";
import {DrawWayLinePoint} from "@/components/mapTools/BaseMapToolsCreatePoint";
import {NotFlyPolylineLabel} from "@/components/mapTools/mapMaterial/mapMaterialStyle";
const store = useMyStore()
const str = '--'
// 获取设备名
const route = useRoute();
const TaskStartTime=ref("飞行器未起飞，请稍等")
const WayPointNum=ref(0);
const router = useRouter();
const device_sn = ref('');
const flightPlanId = ref('')
const flightplan = ref({} as any)
const coordinates=[]//存储航线中的坐标
const deviceInfo = ref({device: {} as DeviceOsd, dock: {} as DockOsd})
const EDroneModeCode = computed(() => {
  switch (deviceInfo.value.device?.mode_code) {
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
const EDockModeCode = computed(() => {
  switch (deviceInfo.value.dock.basic_osd?.mode_code) {
    case -1:
      return '未连接' // 禁用
    case 0:
      return '空闲'
    case 1:
      return '调试中' // 禁用
    case 2:
      return '远程调试中' // 禁用
    case 3:
      return '升级中' //禁用
    case 4:
      return '工作中'
  }
})
const EGear = computed(() => {
  switch (deviceInfo.value.device?.gear) {
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
const RemainingDuration = ref('22min 45s')
const lineDistance=ref(0)
const EstimatedCompletionTime = ref('2023/3/14 14:55:08')
onMounted(() => {
  if(TaskStartTime.value=='飞行器未起飞，请稍等'){
    EstimatedCompletionTime.value='飞行器未起飞，请稍等'
  }
  device_sn.value = route.query.device_sn as string;
  flightPlanId.value = route.query.flightPlanId as string;
	// 拼接实时视频流地址
  // deviceInfo.value = store.state.deviceState.deviceInfo[device_sn.value]
  getFlightPlanById(flightPlanId.value).then(res => {
    flightplan.value = res.data
    PlanTitle.value = res.data.planName
    getWaylineGlobalParamsByWaylineId(flightplan.value.waylineId).then(res5 =>{//判断是旧版航线还是新版航线
      if(res5.data === ''){//是旧版航线

        ComputeWaylineLength()
      }else {//是新版
        ComputeWaylineLengthOldVersion(res5)
      }
          })
    let device_snTmp = ''
      Object.keys(store.state.deviceState.dockInfo).forEach((key: string) => {
        if (key === device_sn.value) {
          device_snTmp = String(store.state.deviceState.dockInfo[key].basic_osd.sub_device.device_sn)
          if(store.state.deviceTakeOffTime[device_snTmp]!=='0'&&store.state.deviceTakeOffTime[device_snTmp]!=='NaN/NaN/NaN NaN:NaN:NaN'){
            ComputeExecuteTime(store.state.deviceTakeOffTime,device_snTmp)
          }
        }
      })
      if (device_snTmp === '') {
        device_snTmp = String(device_sn.value)
      }
  })
  getDeviceInfo()
});
const ComputeWaylineLength=()=>{
  store.state.deviceCurrentWaypointIndex[device_sn.value]=0
  let TemWaylineId=flightplan.value.waylineId
  const coordinates: any[] =[]
  //还需要读出航线文件，然后从航线文件中读出每一个航点的坐标
  let PointPostion:any={}

  getWaylineById(TemWaylineId).then(res => {
    if (res.code === 0) {
      let wayLineData = res.data.templateContent.Folder.placemark
      WayPointNum.value=wayLineData.length
      wayLineData.forEach((item: any) => {
        let tmpPosition=item.Point.coordinates.split(",")
        PointPostion.latitude = tmpPosition[0]
        PointPostion.longitude = tmpPosition[1]
        coordinates.push(PointPostion)
        PointPostion = {}
      })
    }
    console.log( coordinates)
    const distances = [];
    for (let i = 1; i < coordinates.length; i++) {
      const startPoint = coordinates[i - 1];
      const endPoint = coordinates[i];
      const distance = geolib.getDistance(
          { latitude: startPoint.latitude, longitude: startPoint.longitude },
          { latitude: endPoint.latitude, longitude: endPoint.longitude }
      );
      distances.push(distance);
    }
    lineDistance.value = distances.reduce((total, currentDistance) => total + currentDistance, 0);
    console.log("当前航线的长度为",lineDistance.value)
    const speed = 10;
    const timeInSeconds = lineDistance.value / (speed+(15*WayPointNum.value)+20);
    const timeInMinutes = Math.floor(timeInSeconds / 60);
    const hours = Math.floor(timeInMinutes / 60);
    const minutes = timeInMinutes % 60;
    const seconds = Math.floor(timeInSeconds % 60);
    RemainingDuration.value = `${hours}h${minutes}min${seconds}s`;
   })
  }

const ComputeWaylineLengthOldVersion=(res:any)=>{
  store.state.deviceCurrentWaypointIndex[device_sn.value]=0
  let TemWaylineId=flightplan.value.waylineId
  const coordinates: any[] =[]
  //还需要读出航线文件，然后从航线文件中读出每一个航点的坐标
  let PointPostion:any={}

  getWayLinePointByGlobalParamsId(res.data.globalParamsId).then(wayLineData => {
    if (wayLineData.code === 0) {
      const wayLinePointData = wayLineData.data
      wayLinePointData.sort((a: any, b: any) => {
        return a.pIndex - b.pIndex
      })
      wayLinePointData.forEach((item: WayLinePointUpload, index: number) => {
        PointPostion.latitude =Number(item.pointX)
        PointPostion.longitude =Number(item.pointY)
        coordinates.push(PointPostion)
        PointPostion = {}
      })
      WayPointNum.value=wayLinePointData.length
      console.log( coordinates)
      const distances = [];
      for (let i = 1; i < coordinates.length; i++) {
        const startPoint = coordinates[i - 1];
        const endPoint = coordinates[i];
        const distance = geolib.getDistance(
            { latitude: startPoint.latitude, longitude: startPoint.longitude },
            { latitude: endPoint.latitude, longitude: endPoint.longitude }
        );
        distances.push(distance);
      }
      lineDistance.value = distances.reduce((total, currentDistance) => total + currentDistance, 0);
      console.log("当前航线的长度为",lineDistance.value)
      const speed = 10;
      const timeInSeconds = lineDistance.value / speed+40;
      const timeInMinutes = Math.floor(timeInSeconds / 60);
      const hours = Math.floor(timeInMinutes / 60);
      const minutes = timeInMinutes % 60;
      const seconds = Math.floor(timeInSeconds % 60);
      RemainingDuration.value = `${hours}h${minutes}min${seconds}s`;
    }
  })
}

let droneInfo = reactive({} as DeviceInfo)
let drone_sn = ref()

const getDeviceInfo = async () => {
  getBindingDeviceBySn({
    workspace_id: JSON.parse(localStorage.getItem('userInfo') as string).workspace_id,
    device_sn: route.query.device_sn as string
  }).then(res => {
    // console.log(res)
    if(res.code === 0) {
      droneInfo = res.data
      if (droneInfo.child_device_sn === '') {
        drone_sn.value = droneInfo.device_sn
      } else {
        drone_sn.value = droneInfo.child_device_sn
      }
      getDroneLiveStream()
    }
  })
};
watch(store.state.deviceState, (newVal, oldVal) => {
  if (droneInfo.child_device_sn === '') {
    deviceInfo.value.device = newVal.deviceInfo[device_sn.value]
  } else {
    deviceInfo.value.device = newVal.deviceInfo[droneInfo.child_device_sn as string]
  }

}, {deep: true})
watch(store.state.deviceTakeOffTime, (newVal, oldVal) => {
  let device_snTmp = ''
  Object.keys(store.state.deviceState.dockInfo).forEach((key: string) => {
    if (key === device_sn.value) {
      device_snTmp = String(store.state.deviceState.dockInfo[key].basic_osd.sub_device.device_sn)
    }
  })
  if (device_snTmp === '') {
    device_snTmp = String(device_sn.value)
    return
  }
  //通过前面的步骤将实际飞行的飞行器的sn号取出
  if (
      newVal[device_snTmp] !== undefined && newVal[device_snTmp]!== '0'
  ) {
   ComputeExecuteTime(newVal,device_snTmp)
  }
  if(newVal[device_snTmp] === undefined || newVal[device_snTmp]=== '0'|| newVal[device_snTmp]==='NaN/NaN/NaN NaN:NaN:NaN'){
    TaskStartTime.value="飞行器未起飞，请稍等"
    EstimatedCompletionTime.value="飞行器未起飞，请稍等"

  }
}, {deep: true})
const ComputeExecuteTime=(newVal:any,device_snTmp:string)=>{
  if(newVal[device_snTmp]!== '0'&& newVal[device_snTmp]!=='NaN/NaN/NaN NaN:NaN:NaN'){

    TaskStartTime.value=newVal[device_snTmp]
    const timeInSeconds = lineDistance.value / 10+24;
    const startTime = new Date(TaskStartTime.value);

// 计算任务完成时间
    const completionTime = new Date(startTime.getTime() + timeInSeconds * 1000);
    const formatTwoDigits = (number:number) => {
      return number < 10 ? `0${number}` : `${number}`;
    };
    EstimatedCompletionTime.value=
        `${completionTime.getFullYear()}/` +
        `${completionTime.getMonth() + 1}/` +
        `${completionTime.getDate()} ` +
        `${formatTwoDigits(completionTime.getHours())}:` +
        `${formatTwoDigits(completionTime.getMinutes())}:` +
        `${formatTwoDigits(completionTime.getSeconds())}`;
    TaskStartTime.value=
        `${completionTime.getFullYear()}/` +
        `${completionTime.getMonth() + 1}/` +
        `${completionTime.getDate()} ` +
        `${formatTwoDigits(startTime.getHours())}:` +
        `${formatTwoDigits(startTime.getMinutes())}:` +
        `${formatTwoDigits(startTime.getSeconds())}`;
  }
}
watch(store.state.deviceCurrentWaypointIndex, (newVal, oldVal) => {
  if(newVal[device_sn.value]!=0){
    WaypointCount.value=newVal[device_sn.value].toString()
    CompletionDegree.value=((newVal[device_sn.value]/WayPointNum.value)*100).toFixed(2).toString()
  }
}, {deep: true})

// 返回
const backToEquipmentDetail = () => {
	switchView.value = false
	let device_snTmp = ''
	Object.keys(store.state.deviceState.dockInfo).forEach((key: string) => {
		if (key === device_sn.value) {
			device_snTmp = String(store.state.deviceState.dockInfo[key].basic_osd.sub_device.device_sn)
		}
	})
	if (device_snTmp === '') {
		device_snTmp = String(device_sn.value)
	}
	store.commit('SELECT_VIEW_STATE', {sn: device_snTmp, state: switchView.value})
	RemoveEntitiesByBatch(window.cesiumViewer, 'TaskingWayLine')
  router.back()
}
// 定义响应式变量
const PlanTitle = ref('华南师范大学南海校区航拍')
const PlanExecutetype = ref('单次定时')
const CompletionDegree = ref('0')
const TaskAccessTime = ref('2023/3/14 14:33:23')
const TaskAccessDuration = ref('1m 4d 9h 38min 40s')
const DroneElectricitLevel = ref('27%')
const SatelliteCount = ref('0')
const Gear = ref('P')
const AbsoluteAltitude = ref('39.85m')
const WaypointCount = ref('0')
const RelativeGroundHeight = ref('0.0m')
const PhotosTakenNum = ref('0')
const LongitudinalSpeed = ref('0.0m/s')
const RecordingNum = ref('0')
const HorizontalVelocity1 = ref('0')
const HorizontalVelocity2 = ref('0')
const DeviceState = ref('在线')
const DeviceState2 = ref('在线')
const droneOutLiveStream = ref(false)
const aiDroneStream = ref(null)
const isloading = ref(false)
const getDroneLiveStream = async function () {
  let rtmpUrl = await getLiveAddress()
  isloading.value = !isloading.value

  const timestamp = droneInfo.child_device_sn === '' ? droneInfo.device_sn: droneInfo.child_device_sn
  let liveUrl = rtmpUrl.data + timestamp
  let videoID = timestamp + '/53-0-0/normal-0'
  let urlType = '1'
  let videoQ = '2'
  console.log(liveUrl, timestamp)
  getLivestatus(timestamp as string).then(res => {
    console.log(res)
    if (res.data.webRtcStream) {
      droneOutLiveStream.value = res.data.webRtcStream
      store.commit('SET_LIVE_STREAM', {sn: timestamp, vid: videoID})
    } else {
      console.log({
        url: liveUrl,
        video_id: videoID,
        url_type: urlType,
        video_quality: videoQ
      })
      startLivestream({
        url: liveUrl,
        video_id: videoID,
        url_type: Number(urlType),
        video_quality: Number(videoQ)
      }).then(res => {
        console.log('start', res)
        if (res.data.url) {
          droneOutLiveStream.value = res.data.url
          store.commit('SET_LIVE_STREAM', {sn: timestamp, vid: videoID})
        }
      })
    }
  })
}
onBeforeUnmount(() => {
	switchView.value = false
	let device_snTmp = ''
	Object.keys(store.state.deviceState.dockInfo).forEach((key: string) => {
		if (key === device_sn.value) {
			device_snTmp = String(store.state.deviceState.dockInfo[key].basic_osd.sub_device.device_sn)
		}
	})
	if (device_snTmp === '') {
		device_snTmp = String(device_sn.value)
	}
	store.commit('SELECT_VIEW_STATE', {sn: device_snTmp, state: switchView.value})
	RemoveEntitiesByBatch(window.cesiumViewer, 'TaskingWayLine')
  closeLiveStream()
});
const closeLiveStream = () => {
  console.log(droneInfo.child_device_sn)
  if (droneOutLiveStream && store.state.liveStreamState[droneInfo.child_device_sn as string]) {
    console.log(store.state.liveStreamState[droneInfo.child_device_sn as string])
    stopLivestream({
      video_id: store.state.liveStreamState[droneInfo.child_device_sn  as string]
    }).then(res => {
    })
  }
}

// 无人机视角地图视角切换
const switchView = ref(false)
const switchViewChange = () => {
	let device_snTmp = ''
	Object.keys(store.state.deviceState.dockInfo).forEach((key: string) => {
		if (key === device_sn.value) {
			device_snTmp = String(store.state.deviceState.dockInfo[key].basic_osd.sub_device.device_sn)
		}
	})
	if (device_snTmp === '') {
		device_snTmp = String(device_sn.value)
	}
	if(switchView.value) {
		store.commit('SELECT_VIEW_STATE', {sn: device_snTmp, state: switchView.value})
		console.log('无人机视角', device_snTmp)
	} else {
		store.commit('SELECT_VIEW_STATE', {sn: device_snTmp, state: switchView.value})
		console.log('地图视角', device_snTmp)
	}
}

</script>

<style scoped lang="scss">
.DetailInformationPanel{
  box-shadow: 8px 0px 4px 0px $TouchColor;
  background-color: $ComponentBackground;
  position: fixed;
  top: 0px;
  right: 0;
  width: $RightWidth;
  height: 790px;
  margin-top: $NavigationHeight;
  height: calc(100% - $NavigationHeight);
  border-top: $ComponentHeaderBorder;
}
.PlanTitle{
  display: flex;
  width: 360px;
  height: 16px;
  padding-top: 22px;
  font-size: $FirstLevelTitleFontSize;
  text-align: left;
  line-height: 16px;
  /*margin-top: 10px;*/
  margin-left: 16px;
  margin-bottom: 15px;
}
.PlanName{
  white-space: nowrap;
  width: 130px;
  height: 17px;
  font-size: $FirstLevelTitleFontSize;
  font-weight: $FirstLevelTitleFontWeight;
  color: $FirstLevelTitleColor;
}
.orange-dot {
  width: 6px;
  height: 6px;
  background-color: $TouchColor;
  margin-right: 15px;
  margin-top: 5px;
}
.CloseDetailInformationPanel{
  margin-left: 190px;
  font-size: 24px;
  font-weight: 100;
  color: white;
}
.PlanExecuteType{
  justify-content: center;
  align-items: center;
  margin-left: 27px;
  margin-top: 8px;
  display: flex;
  width: 78px;
  height: 20px;
  background: $TouchColor;
  opacity: 0.4;
  border-radius: 4px;
}
.PlanExecutetypeText{
  width: 54px;
  height: 11px;
  font-size: $ContentFontSize;
  padding-bottom: 3px;
  font-weight: $ContentFontWeight;
  color: $ContentColor;
}
.TypeImg{
  margin-left: 6px;
  width: 10px;
  height: 10px;
}
.PlanTextInformation{
  margin-left: 27px;
  margin-top: 14px;
  font-family: $InforFontFamily;
  font-size: $InforFontSize;
  font-weight: $InforFontWeight;
  color: $InforColor;
  line-height: 2;
  text-align: left;
}
.TableFirstRow{
  margin-top: 22px;
  display: flex;
  justify-content: space-between;
  width: 100%;
  font-family: $FirstLevelTitleFontFamily;
  font-size: $FirstLevelTitleFontSize;
  font-weight: $FirstLevelTitleFontWeight;
  color: $FirstLevelTitleColor;
}
.TableBox{
  width: 50%;
  text-align: center;
}
.AssociatedDevice{
  display: flex;
  border-radius: 4px;
  width: 340px;
  height: 61px;
  background: $TouchColor;
  font-size: $ContentFontSize;
  padding-bottom: 3px;
  font-weight: $ContentFontWeight;
  margin-top: 17px;
  margin-right: 28px;
  margin-left: 20px;
}
.DeviceImg{
  margin-top: 18px;
  margin-left: 25px;
  width: 48px;
  height: 29px;
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
  margin-left: 10px;
  line-height: 1.5;
  color: $ContentColor;
}
.AssociatedDevice2{
  display: flex;
  border-radius: 4px;
  width: 340px;
  height: 61px;
  background: $TouchColor;
  font-size: $ContentFontSize;
  padding-bottom: 3px;
  font-weight: $ContentFontWeight;
  margin-top: 17px;
  margin-right: 28px;
  margin-left: 20px;
}
.table-title {
  font-size: 12px;
}
.table-content {
  font-size: 18px;
}
.switch_view {
	width: 200px;
	height: 30px;
	margin-left: 10px;
}
</style>
