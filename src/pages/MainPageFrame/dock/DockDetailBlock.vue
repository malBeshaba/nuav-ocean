<!--机场详细信息元素-->
<template>
<!--  <div style="display: flex">-->

    <div class="dock-detail">
      <!-- 设备 -->
      <div class="dock-info">
        <div class="info-left">
          <el-avatar shape="square" style="width: 34px; height: 29px; background-color: transparent;" :src="dockIMG" />
        </div>
        <div class="info-center">
          <div class="info-center__title"> {{dockInfo.device_name}} </div>
          <div> {{dockInfo.device_sn}} </div>
        </div>
        <div class="info-right">
          <div class="circle" :style="deviceInfo?.dock.basic_osd?.mode_code === -1 ? 'backgroud: red;' : 'background: #19BE6B;'"> </div>
          <div style="padding-left: 12px;width: 75%;"> {{ EDockModeCode }} </div>
        </div>
      </div>

      <div class="dock-video">
        <div class="video-item" v-if="dockOutLiveStream !== ''">
          <VideoFrame  @toFullScreen="toFull_sc" :videoSource="{aisource: aiDockStream, norsource: dockOutLiveStream}"
                       :class="isFull?'dronevideo_frame_':'dronevideo_frame'"
                       ref="dronevideo_frame"></VideoFrame>
        </div>
        <div class="video-item" v-if="droneOutLiveStream">
          <VideoFrame @toFullScreen="toFull_sc" :videoSource="{aisource: aiDockStream, norsource: droneOutLiveStream}"
                      :class="isFull?'dronevideo_frame_':'dronevideo_frame'"
                      ref="dronevideo_frame"></VideoFrame>
        </div>
      </div>

      <!--     机场具体 -->
      <div class="dock-information">
        <!--      <el-row class="item-row">-->
        <!--        <el-col :span="12" class="item">-->
        <!--          <div class="item-title">累计运行时间</div>-->
        <!--          <div class="item-detail"> {{ CalAccTime }} </div>-->
        <!--        </el-col>-->
        <!--        <el-col :span="12" class="item">-->
        <!--          <div class="item-title">激活时间</div>-->
        <!--          <span class="item-detail">{{ new Date((deviceInfo?.dock.work_osd?.activation_time ?? 0) * 1000).toLocaleString() }}</span>-->
        <!--        </el-col>-->
        <!--      </el-row>-->
        <!--      <el-row class="item-row">-->
        <!--        <el-col :span="8" class="item">-->
        <!--          <div class="item-title">网络状态</div>-->
        <!--          &lt;!&ndash; <span :style="deviceInfo?.dock.basic_osd?.network_state?.type === 2 || deviceInfo?.dock.basic_osd?.network_state?.quality === 2 ?-->
        <!--                  'color: #00ee8b' : deviceInfo?.dock.basic_osd?.network_state?.quality === 1 ? 'color: yellow' : 'color: red'"> &ndash;&gt;-->
        <!--          <span class="item-detail" >{{ deviceInfo?.dock.basic_osd?.network_state?.rate }} kb/s</span>-->
        <!--        </el-col>-->
        <!--        <el-col :span="8" class="item">-->
        <!--          <div class="item-title">执行任务总次数</div>-->
        <!--          <span class="item-detail" >{{ deviceInfo?.dock.work_osd?.job_number }} </span>-->
        <!--        </el-col>-->
        <!--        <el-col :span="8" class="item">-->
        <!--          <div class="item-title">媒体文件上传状态</div>-->
        <!--          <span class="item-detail">{{ deviceInfo?.dock.link_osd?.media_file_detail?.remain_upload }}</span>-->
        <!--        </el-col>-->
        <!--      </el-row>-->
        <el-row class="item-row">
          <el-col :span="8" class="item">
            <div class="item-title">风速</div>
            <span class="item-detail">{{ (deviceInfo?.dock.basic_osd?.wind_speed ?? str) + ' m/s'}}</span>
          </el-col>
          <el-col :span="8" class="item">
            <div class="item-title">降雨量</div>
            <span class="item-detail">{{ RainfallEnum }}</span>
          </el-col>
          <el-col :span="8" class="item">
            <div class="item-title">环境温度</div>
            <span class="item-detail">{{ deviceInfo?.dock.basic_osd?.environment_temperature }} °C</span>
          </el-col>
        </el-row>
        <el-row class="item-row">
          <el-col :span="8" class="item">
            <div class="item-title">机场温度</div>
            <span class="item-detail">{{ deviceInfo?.dock.basic_osd?.temperature }} °C</span>
          </el-col>
          <el-col :span="8" class="item">
            <div class="item-title">机场湿度</div>
            <span class="item-detail">{{ deviceInfo?.dock.basic_osd?.humidity }}</span>
          </el-col>
          <el-col :span="8" class="item">
            <div class="item-title">工作电压</div>
            <span class="item-detail">{{ (deviceInfo?.dock.work_osd?.working_voltage ?? str) + ' mV' }}</span>
          </el-col>
        </el-row>
        <!--      <el-row class="item-row">-->
        <!--        <el-col :span="8" class="item">-->
        <!--          <div class="item-title">工作电流</div>-->
        <!--          <span class="item-detail">{{ (deviceInfo?.dock.work_osd?.working_current ?? str) + ' mA' }}</span>-->
        <!--        </el-col>-->
        <!--        <el-col :span="8" class="item">-->
        <!--          <div class="item-title">无人机是否在机场中</div>-->
        <!--          <span class="item-detail">{{ DroneInDockEnum }}</span>-->
        <!--        </el-col>-->
        <!--      </el-row>-->
      </div>

      <div class="option" style="display: flex;justify-content: space-around;align-items: center">
        <el-select
            v-model="flightValue"
            placeholder="Select"
            size="small"
            style="width: 140px"
            @change="handleTaskChange"
        >
          <el-option
              v-for="item in flightOptions"
              :key="item.flightPlanId"
              :label="item.planName"
              :value="item.flightPlanId"
          />
        </el-select>
        <el-button type="success" size="small" @click="takeOff_click(deviceSn)">一键起飞</el-button>
      </div>
  </div>

</template>

<script setup lang="ts">
import { Edit, View as IconView } from '@element-plus/icons-vue'
// import DroneBlock from "@/components/drone/drone_block.vue"
import VideoFrame from '@/pages/ResourceManagement/components/Dock/VideoFrame.vue'
import {onMounted, ref, reactive, watch, computed, onBeforeUnmount, defineEmits, toRaw} from 'vue'
import { getBindingDeviceBySn } from "@/api/device";
import { stopLivestream, getLiveAddress, startLivestream, getAILive, getLivestatus } from "@/api/live"
import { DeviceInfo } from "@/store/types/device";
import dockIMG from "@/assets/images/dock.png"
import {RemoveEntitiesByBatch} from "@/components/mapTools/BaseMapTools";
import {CheckWayLine} from "@/pages/TaskDeployment/components/WayLine/WayLineListCheckWayLine";
import {
  exectFlightTask,
  getFlightPlan,
  getFlightPlanList,
  insertFlightTask,
  insertFlightTaskPrepare
} from "@/api/droneFlightPlan"
import { useMyStore } from "@/store"
const store = useMyStore()
import { useRoute, useRouter } from 'vue-router';
import {useCookies} from "vue3-cookies";

const {cookies} = useCookies()
const route = useRoute();
const router = useRouter();

const str = '--'
interface deviceInfoType {
  dock: {
    basic_osd: {
      mode_code: number;
      network_state: {
        type: number;
        quality: number;
        rate: string;
      };
      wind_speed: string;
      rainfall: number;
      drone_in_dock: number;
      environment_temperature: string;
      temperature: string;
      humidity: string;
    };
    work_osd: {
      activation_time: number;
      job_number: string;
      working_voltage: string;
      working_current: string;
    };
    link_osd: {
      media_file_detail: {
        remain_upload: string;
      };
    };
  };
}
const deviceInfo = reactive({
  dock: {
    basic_osd: {
      mode_code: -1,
      network_state: {
        type: 2,
        quality: 0,
        rate: str
      },
      wind_speed: str,
      rainfall: 0,
      drone_in_dock: -1,
      environment_temperature: str,
      temperature: str,
      humidity: str,
    },
    work_osd: {
      activation_time: 0,
      job_number: str,
      working_voltage: str,
      working_current: str
    },
    link_osd: {
      media_file_detail: {
        remain_upload: str
      }
    }
  }
} as deviceInfoType)
const acc_time = ref(0 as number)

let dockInfo = reactive({} as DeviceInfo)
let droneInfo = reactive({} as DeviceInfo)

let rtmpUrl = ref(null)
const dockOutLiveStream = ref('' as string)
const droneOutLiveStream = ref(false)
const aiDockStream = ref('')
// const dockLoaded = ref(false as boolean)
const isFull = ref(false as boolean)


const isShowInfo = ref(false)
// const emit = defineEmits(['show-info-changed']);

const deviceSn = ref("")

// 一键起飞选项
const flightValue = ref('')

const flightOptions = ref([])


// // Emit event when isShowInfo changes
// watch(isShowInfo, (newVal) => {
//   emit('show-info-changed', newVal);
// });


const RainfallEnum = computed(() => {
  switch (deviceInfo?.dock.basic_osd?.rainfall) {
    case 0:
      return '无'
    case 1:
      return '小雨'
    case 2:
      return '中雨'
    case 3:
      return '大雨'
    default:
      return '错误'
  }
})

const DroneInDockEnum = computed(() => {
  switch (deviceInfo?.dock.basic_osd?.drone_in_dock) {
    case 0:
      return '在机场外'
    case 1:
      return '在机场中'
    default:
      return '错误'
  }
})

const EDockModeCode = computed(() => {
  switch (deviceInfo?.dock.basic_osd?.mode_code) {
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

const CalAccTime = computed(() => {
  let timeArr = []
  let time = acc_time.value
  // 计算月份
  if (time >= 2592000) {
    let month = Math.floor(time / 2592000)
    timeArr.push(`${month}m`)
    time -= month * 2592000
  }
  // 计算天数
  if (time >= 86400) {
    let day = Math.floor(time / 86400)
    timeArr.push(`${day}d`)
    time -= day * 86400
  }
  // 计算小时数
  if (time >= 3600) {
    let hour = Math.floor(time / 3600)
    timeArr.push(`${hour}h`)
    time -= hour * 3600
  }
  // 计算分钟数
  if (time >= 60) {
    let minute = Math.floor(time / 60)
    timeArr.push(`${minute}min`)
    time -= minute * 60
  }
  // 计算秒数
  // timeArr.push(`${Math.floor(time)}s`)
  // 返回计算结果
  return timeArr.join(' ')
})



onMounted(() => {
  // getDeviceInfo()
  // getDockLiveStream()
  // console.log(store.state.iframeDockSn)
  deviceSn.value = store.state.iframeDockSn
  getDeviceInfo()
  getDockLiveStream()
  // const preFlightPlanRes =  getFlightPlanList()

  getFlightPlanList(JSON.parse(localStorage.getItem('userInfo')).workspace_id, {

    deviceSn: deviceSn.value,
    taskType:"4"
  }).then(res => {
    // console.log(res)
    if (res.code === 0) {
      flightOptions.value = []
      res.data.forEach((item: any) => {
        flightOptions.value.push(item)
      })
      // console.log(res.data,"查询结果")
      // taskTotal.value = res.data.pagination.total

    }
  })

  console.log('flightOptions', flightOptions.value)

});



interface MyObject {
  planName: string;
  waylineId: string;
  deviceSn: string;
  waylineType: number;
  taskType: number;
  rthAltitude: number;
  outOfControl: number;
  planTaskType: number;
  executeTime: number;
}

const taskInfo = ref({} as MyObject)
const flightPlan = ref({} as any);
const handleOnTaskChange = (val: any) => {
  flightPlan.value = val;
  console.log('val', flightPlan.value, val, val.value)
}

const CancelWayLineShow = () => {
  if(wayline_prepare.value.waylineId){
    // console.log('wayline.value.waylineId', wayline.value.waylineId)
    RemoveEntitiesByBatch(window.cesiumViewer, 'checkWayLine')
    CheckWayLine(window.cesiumViewer, String(wayline_prepare.value.waylineId), true)
  } else {
    console.log('11111')
  }
}

const takeOff_click = (device_sn: string) => {
  console.log("device_sn",device_sn)
  let taskParams: MyObject = {
    planName: '',
    waylineId: '',
    deviceSn: '',
    waylineType: 0,
    taskType: 0,
    rthAltitude: 0,
    outOfControl: 0,
    planTaskType: 0,
    executeTime: 0,
  };
  const currentDate = new Date();
  taskParams.planName = flightPlan.value.planName + currentDate.toLocaleString();
  taskParams.waylineId = flightPlan.value.waylineId;
  taskParams.deviceSn = deviceSn.value;
  taskParams.waylineType = flightPlan.value.waylineType;
  taskParams.taskType = 0;
  taskParams.rthAltitude = flightPlan.value.rthAltitude;
  taskParams.outOfControl = flightPlan.value.outOfControl;
  taskParams.planTaskType = flightPlan.value.planTaskType;
  taskParams.executeTime = Date.now();
  console.log("taskParams",taskParams)
  insertFlightTask(taskParams).then(res => {
    console.log(res); // 打印响应
    if(res.code === 0) {
      console.log('res_insertFlightTask', res.data)
      exectFlightTaskParams.planId = res.data.flightPlanId
      console.log('exectFlightTaskParams', exectFlightTaskParams)
      exectFlightTask(JSON.parse(localStorage.getItem('userInfo') as string).workspace_id, exectFlightTaskParams).then(res2 => {
        console.log('res_exectFlightTask', res.data)
        console.log('res2',res2.data)
        if (res2.code === 0) {
          ElMessage.success({
            message: "执行成功!",
            offset: window.screen.height / 2,
          })
          store.commit('SET_TASK_FLIGHT_PLAN_INFO', {
            flightPlanId: res.data.flightPlanId,
            device_sn: deviceInfo.child_device_sn
          })
          console.log('store.state.taskFlightPlanInfo', store.state.taskFlightPlanInfo)
          router.push({
            path: '/default/task/task-list',
            query: {
              device_sn: taskParams.deviceSn,
              flightPlanId: res.data.flightPlanId
            },
          })
        }
        CancelWayLineShow()
      })
    } else {
      ElMessage.error({
        message: "执行失败！",
        offset: window.screen.height / 2,
      })
    }
  })
}


// 执行任务
const exectFlightTaskParams = reactive({
  planId: '',
  deviceType: 1,
})
interface InsertTaskParams {
  planName: string;
  waylineId: string;
  deviceSn: string;
  waylineType: number;
  taskType: number;
  rthAltitude: number;
  outOfControl: number;
  planTaskType: number;
  planStatus: number;
  executeTime: number;
}
const preparetaskInfo = ref({} as InsertTaskParams)

const removeCache = () => {
  const taskCache = cookies.get('createTaskCache') as unknown as any
  if (taskCache[route.query.device_sn as string]) {
    delete taskCache[route.query.device_sn as string]
    console.log(taskCache)
    cookies.set('createTaskCache', JSON.stringify(taskCache))
  }
}

// 生成时间戳
const getTimeStamp = () => {
  return Date.now()
};
let isSave = true

function InsertTask() {
  isSave = false
  taskInfo.value.rthAltitude = Number(taskInfo.value.rthAltitude)
  taskInfo.value.deviceSn = route.query.device_sn as string
  taskInfo.value.executeTime = getTimeStamp()
  console.log("taskInfo.value", taskInfo.value)
  preparetaskInfo.value.planName = taskInfo.value.planName
  preparetaskInfo.value.waylineId = taskInfo.value.waylineId
  preparetaskInfo.value.deviceSn = taskInfo.value.deviceSn
  //preparetaskInfo.value.waylineType = taskInfo.value.waylineType
  preparetaskInfo.value.taskType = taskInfo.value.taskType
  preparetaskInfo.value.rthAltitude = taskInfo.value.rthAltitude
  preparetaskInfo.value.outOfControl = taskInfo.value.outOfControl
  preparetaskInfo.value.planTaskType = taskInfo.value.planTaskType
  preparetaskInfo.value.planStatus = 1
  preparetaskInfo.value.executeTime = taskInfo.value.executeTime
  console.log("preparetaskInfo.value", preparetaskInfo.value)
  removeCache()
  store.commit('CHANGE_CACHE_STYLE', {isReady: true, isAllow:true})
  insertFlightTaskPrepare(preparetaskInfo.value)
}


// 执行飞行任务
function handleExitFlight() {
  isSave = false
  taskInfo.value.rthAltitude = Number(taskInfo.value.rthAltitude)
  taskInfo.value.deviceSn = deviceSn.value
  taskInfo.value.executeTime = getTimeStamp()
  removeCache()
  store.commit('CHANGE_CACHE_STYLE', {isReady: true, isAllow:true})
  if(Number(taskInfo.value.taskType) === 4){
    ElMessage({
      message: "创建预设任务成功",
      type: 'success'
    });
    InsertTask()
  } else {
    ElMessage({
      message: "创建任务成功,并将于指定时间起飞",
      type: 'success'
    });
    insertFlightTask(taskInfo.value).then(res => {
      if (res.code === 0) {
        console.log('res_insertFlightTask', res.data)
        exectFlightTaskParams.planId = res.data.flightPlanId
        console.log('exectFlightTaskParams', exectFlightTaskParams)
        exectFlightTask(JSON.parse(localStorage.getItem('userInfo') as string).workspace_id, exectFlightTaskParams).then(res2 => {
          console.log('res_exectFlightTask', res.data)
          if (res2.code === 0) {
            ElMessage.success({
              message: "执行成功!",
              offset: window.screen.height / 2,
            })
            store.commit('SET_TASK_FLIGHT_PLAN_INFO', {
              flightPlanId: res.data.flightPlanId,
              device_sn: deviceInfo.child_device_sn
            })
            console.log('store.state.taskFlightPlanInfo', store.state.taskFlightPlanInfo)
            router.push({
              path: '/default/task/task-list',
              query: {
                device_sn: taskInfo.value.deviceSn,
                flightPlanId: res.data.flightPlanId
              },
            })
            // CancelWayLineShow()
            // RemoveEntitiesByBatch(window.cesiumViewer, 'checkWayLine')
            // CheckWayLine(window.cesiumViewer, String(wayline.value.waylineId), true)
          }
        })
      } else {
        ElMessage.error({
          message: "执行失败！",
          offset: window.screen.height / 2,
        })
      }
    })
  }
}


const handleTaskChange = ()=>{
  // 获取当前被选中的对象
  flightPlan.value = flightOptions.value.find((item: any) => item.flightPlanId === flightValue.value)
  console.log('currentTask1111111111111', flightPlan.value)
}

// // 点击确定或取消时删除显示的航线
// const CancelWayLineShow = () => {
//   if (wayline.value.waylineId) {
//     // console.log('wayline.value.waylineId', wayline.value.waylineId)
//     RemoveEntitiesByBatch(window.cesiumViewer, 'checkWayLine')
//     CheckWayLine(window.cesiumViewer, String(wayline.value.waylineId), true)
//   } else {
//     console.log('11111')
//   }





const getDeviceInfo = async () => {
  getBindingDeviceBySn({
    workspace_id: JSON.parse(localStorage.getItem('userInfo') as string).workspace_id,
    device_sn: deviceSn.value
  }).then(res => {
    // console.log(res)
    if(res.code === 0) {
      dockInfo = res.data
      // 存储匹配的无人机sn
      store.commit('SET_IFRAME_DRONE_SN', res.data.child_device_sn);
      getBindingDeviceBySn({
        workspace_id: JSON.parse(localStorage.getItem('userInfo') as string).workspace_id,
        device_sn: res.data.child_device_sn
      }).then(res => {
        if(res.code === 0) {
          droneInfo = res.data
          console.log('机场信息：1111111111111111111', dockInfo)
          // getDroneLiveStream(dockInfo.child_device_sn)
        }
      })
    }
  })
};

onBeforeUnmount(() => {
  closeLiveStream()
});


const toFull_sc = (isF: boolean) => {
  isFull.value = isF
}

// 视频流
const closeLiveStream = () => {
  if (dockOutLiveStream && store.state.liveStreamState[dockInfo.device_sn]) {
    stopLivestream({
      video_id: store.state.liveStreamState[dockInfo.device_sn]
    }).then(res => {
      console.log('机场' + dockInfo.device_sn + '直播流已断开')
    })
  }
  if (droneOutLiveStream && store.state.liveStreamState[dockInfo.child_device_sn as string]) {
    stopLivestream({
      video_id: store.state.liveStreamState[dockInfo.child_device_sn as string]
    }).then(res => {
    })
  }
}
const getDockLiveStream = async () => {
  let rtmpUrl = await getLiveAddress()
  const timestamp = deviceSn.value

  let liveUrl = rtmpUrl.data + timestamp
  let videoID = timestamp + '/165-0-7/normal-0'
  let urlType = '1'
  let videoQ = '2'
  getLivestatus(timestamp as string).then(res => {
    if (res.data.webRtcStream) {
      dockOutLiveStream.value = res.data.webRtcStream
      store.commit('SET_LIVE_STREAM', {sn: timestamp, vid: videoID})
      // dockLoaded.value = true
    } else {
      startLivestream({
        url: liveUrl,
        video_id: videoID,
        url_type: urlType,
        video_quality: videoQ
      }).then(res => {
        if (res.data.url) {
          dockOutLiveStream.value = res.data.url
          store.commit('SET_LIVE_STREAM', {sn: timestamp, vid: videoID})
          // dockLoaded.value = true
        }
      })
    }
  })
};
const getDroneLiveStream = async (timestamp: string) => {
  let rtmpUrl = await getLiveAddress()
  let liveUrl = rtmpUrl.data + timestamp
  let videoID = timestamp + '/53-0-0/normal-0'
  let urlType = '1'
  let videoQ = '2'
  getLivestatus(timestamp).then(res => {
    if (res.data.webRtcStream) {
      droneOutLiveStream.value = res.data.webRtcStream
      store.commit('SET_LIVE_STREAM', {sn: timestamp, vid: videoID})
      console.log('无人机视频：', droneOutLiveStream.value)
    } else {
      startLivestream({
        url: liveUrl,
        video_id: videoID,
        url_type: urlType,
        video_quality: videoQ
      }).then(res => {
        if (res.data.url) {
          droneOutLiveStream.value = res.data.webRtcStream
          store.commit('SET_LIVE_STREAM', {sn: timestamp, vid: videoID})
          console.log('无人机视频：', droneOutLiveStream.value)
        }
      })
    }
  })
}

watch(() => store.state.deviceState, (newData, oldData) => {
  // console.log('dock', newData)
  if (newData.currentType === 3 && newData.dockInfo[newData.currentSn]) {
    if (dockInfo.device_sn === newData.currentSn) {
      deviceInfo.dock = newData.dockInfo[dockInfo.device_sn]
      if (deviceInfo.dock.work_osd && deviceInfo.dock.link_osd && deviceInfo.dock.basic_osd) {
        acc_time.value = deviceInfo.dock.work_osd.activation_time
      }
    } else {
    }
  }

}, { deep: true, immediate: true})

watch([dockInfo, droneInfo], ([newDockInfo, newDroneInfo]) => {
  // getDockLiveStream()
  // if (newDockInfo && newDroneInfo) {
  //   title.value = `${newDockInfo.device_name}-${newDroneInfo.device_name}`;
  // } else if (newDockInfo) {
  //   title.value = newDockInfo.device_name;
  // }
}, { deep: true, immediate: true});
</script>

<style scoped lang="scss">
div {
  box-sizing: border-box;
}
*, *::before, *::after {
  box-sizing: inherit;
}
/* 整体 */
.dock-detail {
  width: 280px;
  height: 100%;
  /* background-color: rgba(0, 0, 0, 0.7); */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;
}
/* 设备信息 */
.dock-info {
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
  color: $LightColor;
  padding-bottom: 8px;
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
/* 设备具体信息 */
.dock-information {
  width: 300px;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding-bottom: 10px;
}

.item-row {
  flex: 1;
  margin-bottom: 5px;
  margin-top: 5px;
}

.item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.item-title {
  height: 14px;
  font-size: $AnnotateFontSize;
  font-family: $AnnotateFontFamily;
  color: $AnnotateColor;
  font-weight: $AnnotateFontWeight;
}

.item-detail {
  flex-grow: 1;
  display: flex;
  align-items: center;
  font-size: $ContentFontSize;
  font-family: $ContentFontFamily;
  color: $ContentColor;
  font-weight: $ContentFontWeight;
}

/* 设备视频 */
.dock-video {
  width: 100%;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

</style>
