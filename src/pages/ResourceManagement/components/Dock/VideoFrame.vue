<template>
  <div class="dronevideo_frame" v-show="dronevideo_frame" ref="dronevideo_frame">
    <div>
      <WebrtcPlayer v-show="!isYoloAction" :videoSrc="isAI? aisource: videoSource.norsource"></WebrtcPlayer>
      <WebrtcPlayer v-show="false" id="videoFusion" :videoSrc="isAI? aisource: videoSource.norsource"></WebrtcPlayer>
      <WebrtcPlayer v-if="isYoloAction" :videoSrc="yoloVideoSource"></WebrtcPlayer>
    </div>
    <el-select v-if="videoSource.sn" v-model="vtCode" placeholder="video" :class="isFullScreen? 'Bbutton_': 'Bbutton'" style="width: 120px">
      <el-option
          v-for="item in video_types"
          :key="item.value"
          :label="item.label"
          :value="item.value"
      >
      </el-option>
    </el-select>
    <el-select v-if="videoSource.sn" v-model="aiCode" placeholder="AI"  style="width: 120px; margin-left: 70px;">
      <el-option
          v-for="item in aiList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
      >
      </el-option>
    </el-select>
    <br>
    <div class="red-comp" v-if="vtCode === 'ir'">
      <el-tooltip :content="isotherm_state? '关闭等温线': '开启等温线'" placement="top">
        <el-switch v-if="videoSource.sn" v-model="isotherm_state" class="isotherm-switch" style="width: 40px; margin-right: 20px;--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"></el-switch>
      </el-tooltip>
      <el-select v-if="videoSource.sn" v-model="vtColor" size="small" placeholder="video" :class="isFullScreen? 'Bbutton_': 'Bbutton'" style="width: 70px;">
        <el-option
            v-for="item in palette_style"
            :key="item.value"
            :label="item.label"
            :value="item.value"
        >
        </el-option>
      </el-select>
      <el-input-number
          v-if="videoSource.sn"
          v-model="lower_limit"
          :min="-20"
          :max="150"
          size="small"
          controls-position="right"
          :class="isFullScreen? 'Bbutton_': 'Bbutton'"
          style="width: 80px; margin-left: 10px"
          @change="handleLowChange"
      />
      <el-input-number
          v-if="videoSource.sn"
          v-model="upper_limit"
          :min="-20"
          :max="150"
          size="small"
          controls-position="right"
          :class="isFullScreen? 'Bbutton_': 'Bbutton'"
          style="width: 80px;  margin-left: 10px;"
          @change="handleUpChange"
      />
    </div>
<!--    <div class="video_fusion">-->
<!--      &lt;!&ndash;		  <el-tooltip :content="isShowVideo? '开启视频融合': '关闭视频融合'" placement="top">&ndash;&gt;-->
<!--      &lt;!&ndash;        <el-switch v-model="isShowVideo" class="isotherm-switch" style="width: 40px; margin-right: 20px;&#45;&#45;el-switch-on-color: #13ce66; &#45;&#45;el-switch-off-color: #ff4949"></el-switch>&ndash;&gt;-->
<!--      &lt;!&ndash;      </el-tooltip>&ndash;&gt;-->
<!--&lt;!&ndash;      <el-switch&ndash;&gt;-->
<!--&lt;!&ndash;          v-model="isShowVideo"&ndash;&gt;-->
<!--&lt;!&ndash;          active-color="$TouchColor"&ndash;&gt;-->
<!--&lt;!&ndash;          inactive-color="$TouchColor"&ndash;&gt;-->
<!--&lt;!&ndash;          active-text="开启视频融合"&ndash;&gt;-->
<!--&lt;!&ndash;          inactive-text="关闭视频融合"&ndash;&gt;-->
<!--&lt;!&ndash;      ></el-switch><br />&ndash;&gt;-->
<!--      <span v-if="isShowVideo">分辨率</span>-->
<!--      <span v-if="isShowVideo">-->
<!--				长：<el-input style="width: 60px" v-model="paramsList.photoPixelWidth" placeholder="Please input" />-->
<!--				宽：<el-input style="width: 60px" v-model="paramsList.photoPixelHeight" placeholder="Please input" />-->
<!--		  </span>-->
<!--    </div>-->
    <!--    <span v-if="videoSource.aisource" :class="isFullScreen? 'Abutton_': 'Abutton'" id="ai_button" @click="selectAIVideo" :style="aiHeightLight">AI</span>-->
    <!--    <span :class="isFullScreen?'full_sc_ iconfont icon-quanping': 'full_sc iconfont icon-quanping'" id="full_sc" @click="toFull_sc" ></span>-->
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, reactive, ref, watch, onBeforeUnmount} from 'vue';
import WebrtcPlayer from "@/components/video/WebrtcPlayer.vue";
import {getListByType} from "@/api/aiAlgorithm"
import {getAILive, getLivestatus, setRedR, stopAlgorithm, switchLive} from "@/api/live"
import {VideoFusion} from '@/components/mapTools/class/NewVideoFusionClass'
// @ts-ignore
import droneModel from '@assets/models/airDrone.glb'
import * as Cesium from 'cesium'
import store from '@/store'
import {getDockSnByDroneSn} from "@/api/device";
import {string} from "mathjs";

const Props = defineProps<{
  videoSource: {
    norsource: string;
    sn: string;
    // type: any,
  },
}>()
const isotherm_state = ref(true)
const upper_limit = ref(40)
const lower_limit = ref(-20)
const isAI = ref(false);
const isFullScreen = ref(false);
const dronevideo_frame = ref(false);
// const videoSource = ref('http://192.168.1.106:8080/live/livestream.flv');
const dockSource = ref('');
const options = reactive({
  isLive: true, //切换为直播流的时候必填
  format: 'flv',  //切换为直播流的时候必填
  width: '100%',
  height: '100%',
  videoWidth: '100%',
  videoHeight:'100%',
  preload: true,
  autoplay: true
});
const aiCode = ref('');
const aiList = reactive([{value: '', label: '原视频'}]);
const source = ref("http://218.192.100.219:8080/live/livestream3.flv");
const aisource = ref('');
const video_types = ref([{value: 'wide', label: '默认'}, {value: 'ir', label: '红外'}]);
const vtCode = ref('wide');
const vtColor = ref('0')
const isYoloAction = ref(false)
const yoloVideoSource = ref("")
const palette_style = [
  {value: '0', label: '红热'},
  {value: '1', label: '黑热'},
  {value: '2', label: '白热'},
  {value: '3', label: '绿热'},
  {value: '4', label: '融合'},
  {value: '5', label: '彩虹'},
  {value: '6', label: '铁虹1'},
  {value: '7', label: '铁虹2'},
  {value: '8', label: '冰火'},
  {value: '9', label: '棕褐'},
  {value: '10', label: '彩虹光'},
  {value: '11', label: '颜色1'},
  {value: '12', label: '颜色2'},
  {value: '13', label: '雨'},
  {value: '14', label: '热点'},
  {value: '15', label: '彩虹2'},
  {value: '16', label: '灰色'},
  {value: '17', label: '金属'},
  {value: '18', label: '冷点'}
]
let aiSourceList:any = []

const paramsList = ref<{photoPixelWidth: number, photoPixelHeight: number}>({
  photoPixelWidth: 6240,
  photoPixelHeight: 4168
})

const aiHeightLight = computed(() => {
  return isAI.value ? {'color': '#ece535'}: {'color': 'white'};
});

const getDataFromList = () => {
  dronevideo_frame.value = true
}

const close = () => {
  dronevideo_frame.value = false
}

const emit = defineEmits(["toFullScreen"]);
const toFull_sc = () => {
  isFullScreen.value = !isFullScreen.value;
  // emit("toFullScreen", isFullScreen.value);
};

const selectAIVideo = () => {
  isAI.value = !isAI.value
};


onMounted(() => {
  // console.log('open', Props.videoSource)
  getListByType({pageNo: 1, pageSize: 10}).then(res => {
    console.log('-------aiList-------', res)
    if (res.code === 0) {
      for (var i = 0; i < res.data.list.length; i++) {
        aiList.push({value: res.data.list[i].id, label: res.data.list[i].algorithmName})
      }
      getLivestatus("1631525384183484418"+ Props.videoSource.sn).then(res => {
        if (res.data.webRtcStream) {
          yoloVideoSource.value = res.data.webRtcStream

        } else {
          getAILive("1631525384183484418", Props.videoSource.sn).then(res => {
            yoloVideoSource.value = res.data.webRtcStream
          })
        }
      })
    }
  })
});

const initAiSourceList = (newCode)=>{
  getLivestatus(newCode + Props.videoSource.sn).then(res => {
    if (res.data.webRtcStream) {
      aiSourceList.push({id:newCode,url:res.data.webRtcStream})
      // aisource.value = res.data.webRtcStream
      // isAI.value = true
      // console.log(aisource.value, isAI.value)
    } else {
      getAILive(newCode, Props.videoSource.sn).then(res => {
        aiSourceList.push({id:newCode,url:res.data.webRtcStream})
        // console.log('getAIlive', res)
        // aisource.value = res.data.webRtcStream
        // isAI.value = true
        // console.log(aisource.value, isAI.value)
      })
    }
  })
}

watch(vtCode, (newCode, oldCode) => {
  const vid = Props.videoSource.sn +'/53-0-0/' + newCode + '-0'
  // console.log(vid)
  switchLive({
    url_type: '1',
    url: Props.videoSource.norsource,
    video_id: vid,
    video_quality: '2',
    video_type: newCode
  }).then(res => {
    console.log(res)
  })
}, { deep: true });

watch(aiCode, (newCode, oldCode) => {

  if (newCode === '') {
    isAI.value = false
    isYoloAction.value = false
  } else {
    if(newCode ==="1631525384183484418"){
      isYoloAction.value = true

    }else{
      isYoloAction.value = false
      getLivestatus(newCode + Props.videoSource.sn).then(res => {
        if (res.data.webRtcStream) {
          aisource.value = res.data.webRtcStream
          isAI.value = true
          console.log(aisource.value, isAI.value)
        } else {
          getAILive(newCode, Props.videoSource.sn).then(res => {
            console.log('getAIlive', res)
            aisource.value = res.data.webRtcStream
            isAI.value = true
            console.log(aisource.value, isAI.value)
          })
        }
      })

    }
    // getLivestatus(newCode + Props.videoSource.sn).then(res => {
    //   if (res.data.webRtcStream) {
    //     aisource.value = res.data.webRtcStream
    //     isAI.value = true
    //     console.log(aisource.value, isAI.value)
    //   } else {
    //     getAILive(newCode, Props.videoSource.sn).then(res => {
    //       console.log('getAIlive', res)
    //       aisource.value = res.data.webRtcStream
    //       isAI.value = true
    //       console.log(aisource.value, isAI.value)
    //     })
    //   }
    // })
  }
  if (oldCode !== '' && oldCode !== "1631525384183484418") {
    stopAlgorithm(oldCode).then(res => {
      console.log('stoplive',res)
    })
  }
}, { deep: true, immediate:true });

// watch(Props.videoSource, (newData, oldData) => {
//   console.log('新的', newData)
// })
let currentUrl = window.location.href;
let url = new URL(currentUrl);
let drone_sn :string = ''
drone_sn = string(url.searchParams.get("device_sn"));
console.log('drone_sn', drone_sn)
let airport_sn : string = ""

const getBindingDeviceBySn = async () => {
  getDockSnByDroneSn({
    workspace_id: JSON.parse(localStorage.getItem('userInfo') as string).workspace_id,
    drone_sn: drone_sn
  }).then(res => {
    console.log('getDockSnByDroneSn', res)
    if (res.code === 0) {
      airport_sn = res.data.device_sn
      console.log('airport_sn', airport_sn)
    }
  })
}
getBindingDeviceBySn()

watch(vtColor, (newCode, oldCode) => {
  setRedR(airport_sn, {thermal_current_palette_style: parseInt(newCode)}).then(res => {
    if (res.code === 0) {
      ElMessage.success(res.message)
    } else {
      // ElMessage.error(res.message)
    }
  })
})
const handleLowChange = (value: number) => {
  console.log(value)
  setRedR(airport_sn, {thermal_isotherm_lower_limit: value}).then(res => {
    if (res.code === 0) {
      ElMessage.success(res.message)
    } else {
      // ElMessage.error(res.message)
    }
  })
}
const handleUpChange = (value: number) => {
  console.log(value)
  setRedR(airport_sn, {thermal_isotherm_upper_limit: value}).then(res => {
    if (res.code === 0) {
      ElMessage.success(res.message)
    } else {
      // ElMessage.error(res.message)
    }
  })
}
watch(isotherm_state, (newCode, oldCode) => {
  setRedR(airport_sn, {thermal_isotherm_state: newCode? 1: 0}).then(res => {
    if (res.code === 0) {
      ElMessage.success(res.message)
    } else {
      // ElMessage.error(res.message)
    }
  })
},)

// 视频融合
let isShowVideo = ref(false)
let VideoFusionModel: VideoFusion | null = null
let position = Cesium.Cartesian3.fromDegrees(113.02209373872853, 23.147927035993092, 140)
// 机身横滚角
let videoHeading = 0
let videoPitch = 180
let videoRoll = 0
let droneList:any[] = []


//用来下载姿态数据
const downLoadDroneList = ()=>{
  // 将数组转换为字符串
  const content = JSON.stringify(droneList, null, 2);

  // 创建一个Blob对象，将字符串放入其中
  const blob = new Blob([content], { type: 'text/plain' });

  // 创建一个下载链接并触发点击
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = window.URL.createObjectURL(blob);
  a.download = 'data.txt'; // 文件名

  // 将链接添加到DOM中并模拟点击
  document.body.appendChild(a);

  a.click();

  // 释放URL对象资源
  window.URL.revokeObjectURL(a.href);

  // 删除下载链接
  document.body.removeChild(a);
}

watch(isShowVideo, (value) => {
  if(value) {
    droneList = []
    const videoElement = document.getElementById('videoFusion') as HTMLVideoElement
    VideoFusionModel = initVideoFusionModel(videoElement, Props.videoSource.sn)
    store.commit('SET_VIDEO_FUSION_STATE', {sn: Props.videoSource.sn, state: true})
  } else {
    // downLoadDroneList()
    if(VideoFusionModel !== null) {
      VideoFusionModel.clearAll()
      VideoFusionModel = null
      store.commit('SET_VIDEO_FUSION_STATE', {sn: '', state: false})
    }
  }
})

let videoPoints:any[] = []
const numberOfInterpolatedPoints = 48;
let timer =null
watch(store.state.deviceState.deviceInfo, (value) => {
  if(value) {
    Object.keys(value).forEach((key: string) => {
      if(key === Props.videoSource.sn) {
        // console.log('视频融合', value[key])
        droneList.push(value[key])
        position = Cesium.Cartesian3.fromDegrees(value[key].longitude, value[key].latitude, Number(value[key].height))

        //视频融合平滑
        videoPoints.push(position)
        if (videoPoints.length <= 1) {
          // console.log("pass");
          return
        }
        const interpolatedPoints:any[] = [];
        const lastIndex = videoPoints.length - 1;
        const prevPoint = videoPoints[lastIndex - 1];
        const currPoint = videoPoints[lastIndex];
        for (let i = 0; i < numberOfInterpolatedPoints; i++) {
          const t = i / (numberOfInterpolatedPoints - 1);
          const interpolatedPoint = Cesium.Cartesian3.lerp(prevPoint, currPoint, t, new Cesium.Cartesian3());
          interpolatedPoints.push(interpolatedPoint);
        }
        //视频融合平滑


        videoHeading = (Number(value[key].attitude_head) + 360) % 360
        videoPitch = (Number(value[key].payloads[0].gimbal_pitch) + 270) % 360

        let video = document.getElementById('videoFusion') as HTMLVideoElement
        video.style.transform = `rotate(${videoHeading}deg)`
        if(isShowVideo.value) {
          if(timer!==null){
            clearInterval(timer)
          }
          // console.log('开启视频融合', value[key])
          // const position = Cesium.Cartesian3.fromDegrees(value[key].longitude, value[key].latitude, Number(value[key].height))
          const perspectiveFrustumType = {
            fov: 62,
            near: 0.1,
            far: Number(value[key].height),
            aspectRatioWidth: (Number(value[key].height))*1.0483,
            aspectRatioHeight:( Number(value[key].height))*1.3978,
          }

          //视频融合平滑
          let count = 0;
          const intervalTime = 2000 / numberOfInterpolatedPoints; // 24 次每秒
          timer = setInterval(() => {
            if (count < numberOfInterpolatedPoints) {
              // 在这里执行你的操作
              // console.log(targetPoint);
              let targetPoint = interpolatedPoints[count]
              VideoFusionModel?.update(targetPoint, [videoHeading, videoPitch, 0], perspectiveFrustumType, true)
              // console.log(`执行第 ${count + 1} 次操作`);
              count++;
            } else {
              clearInterval(timer); // 当执行 24 次后清除计时器
            }
          }, intervalTime);

          videoPoints.shift();
          //视频融合平滑
          // VideoFusionModel?.update(position, [videoHeading, videoPitch, 0], perspectiveFrustumType, true)
        }
      }
    })
  }
})

const initVideoFusionModel = (videoElement: HTMLElement | null, ModelID: string) => {
  return new VideoFusion({
    id: 'device_sn.value',
    position: position,
    perspectiveFrustumType: {
      fov: 69,
      near: 0.1,
      far: 100,
      aspectRatioWidth: 100,
      aspectRatioHeight: 200,
    },
    droneModelUri: droneModel,
    hpr: [videoHeading, 180, 0],
    videoSource: videoElement,
    show: true
  })
}

onBeforeUnmount(() => {
  if(VideoFusionModel !== null) {
    VideoFusionModel.clearAll()
    VideoFusionModel = null
    isShowVideo.value = false
  }
  stopAlgorithm(aiCode.value).then(res => {
    console.log('stoplive',res)
  })
})

</script>

<style scoped>
/*@import "//at.alicdn.com/t/c/font_3880304_e4fxdavqiq7.css";*/
.dronevideo_frame {
  position: relative;
}
.dronevideo_frame .full_sc {
  position: absolute;
  color: white;
  bottom: 13%;
  right: 5.3%;
  width: 10px;
  height: 10px;
  z-index: 20;
}
.dronevideo_frame .full_sc_ {
  position: absolute;
  color: white;
  bottom: 2.6%;
  right: 2%;
  width: 20px;
  height: 20px;
  z-index: 20;
}
.dronevideo_frame .Abutton {
  /*position: absolute;*/
  color: white;
  /*right: 15%;*/
  bottom: 7%;
  font-size: 15px;
  z-index: 200;
}
.dronevideo_frame .Abutton_ {
  /*position: absolute;*/
  color: white;
  z-index: 200;
}
.dronevideo_frame .Bbutton {
  /*position: absolute;*/
  color: white;
  font-size: 15px;
  z-index: 200;
}
.dronevideo_frame .Bbutton_ {
  color: white;
  z-index: 200;
}
.el-select .el-input .el-select__caret.el-icon {
  display: none;
}
.el-input__wrapper {
  background-color: rgba(0, 0, 0, 0);
  box-shadow: 0 0 0 0;
}
.el-input__inner {
  color: white;
}
</style>
