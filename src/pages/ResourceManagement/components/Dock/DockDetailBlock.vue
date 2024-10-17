<!--机场详细信息元素-->
<template>
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
    <!-- 机场具体 -->
    <div class="dock-information">
      <el-row class="item-row">
        <el-col :span="12" class="item">
          <div class="item-title">累计运行时间</div>
          <div class="item-detail"> {{ CalAccTime }} </div>
        </el-col>
        <el-col :span="12" class="item">
          <div class="item-title">激活时间</div>
          <span class="item-detail">{{ new Date((deviceInfo?.dock.work_osd?.activation_time ?? 0) * 1000).toLocaleString() }}</span>
        </el-col>
      </el-row>
      <el-row class="item-row">
        <el-col :span="8" class="item">
          <div class="item-title">网络状态</div>
          <!-- <span :style="deviceInfo?.dock.basic_osd?.network_state?.type === 2 || deviceInfo?.dock.basic_osd?.network_state?.quality === 2 ?
                  'color: #00ee8b' : deviceInfo?.dock.basic_osd?.network_state?.quality === 1 ? 'color: yellow' : 'color: red'"> -->
          <span class="item-detail" >{{ deviceInfo?.dock.basic_osd?.network_state?.rate }} kb/s</span>
        </el-col>
        <el-col :span="8" class="item">
          <div class="item-title">执行任务总次数</div>
          <span class="item-detail" >{{ deviceInfo?.dock.work_osd?.job_number }} </span>
        </el-col>
        <el-col :span="8" class="item">
          <div class="item-title">媒体文件上传状态</div>
          <span class="item-detail">{{ deviceInfo?.dock.link_osd?.media_file_detail?.remain_upload }}</span>
        </el-col>
      </el-row>
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
      <el-row class="item-row">
        <el-col :span="8" class="item">
          <div class="item-title">工作电流</div>
          <span class="item-detail">{{ (deviceInfo?.dock.work_osd?.working_current ?? str) + ' mA' }}</span>
        </el-col>
        <el-col :span="8" class="item">
          <div class="item-title">无人机是否在机场中</div>
          <span class="item-detail">{{ DroneInDockEnum }}</span>
        </el-col>
      </el-row>
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
  </div>
</template>

<script setup lang="ts">
// import DroneBlock from "@/components/drone/drone_block.vue"
import VideoFrame from '@/pages/ResourceManagement/components/Dock/VideoFrame.vue'
import { onMounted, ref, reactive, watch, computed, onBeforeUnmount } from 'vue'
import { getBindingDeviceBySn } from "@/api/device";
import { stopLivestream, getLiveAddress, startLivestream, getAILive, getLivestatus } from "@/api/live"
import { DeviceInfo } from "@/store/types/device";
import dockIMG from "@/assets/images/dock.png"
import { Close, Clock } from '@element-plus/icons-vue'
import { useMyStore } from "@/store"
const store = useMyStore()
import { useRoute, useRouter } from 'vue-router';
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
  getDeviceInfo()
  getDockLiveStream()
});

const getDeviceInfo = async () => {
  getBindingDeviceBySn({
    workspace_id: JSON.parse(localStorage.getItem('userInfo') as string).workspace_id,
    device_sn: route.query.device_sn as string
  }).then(res => {
    // console.log(res)
    if(res.code === 0) {
      dockInfo = res.data
      getBindingDeviceBySn({
        workspace_id: JSON.parse(localStorage.getItem('userInfo') as string).workspace_id,
        device_sn: res.data.child_device_sn
      }).then(res => {
        if(res.code === 0) {
          droneInfo = res.data
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
  const timestamp = route.query.device_sn

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
  width: 100%;
  height: 100%;
  /* background-color: rgba(0, 0, 0, 0.7); */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: $ComponentGap;
  box-sizing: border-box;
}
/* 设备信息 */
.dock-info {
  width: 100%;
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
  color: $TouchColor;
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
  width: 100%;
  height: 340px;
  display: flex;
  flex-direction: column;
  padding: 16px 0px;
  box-sizing: border-box;
}

.item-row {
  flex: 1;
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
