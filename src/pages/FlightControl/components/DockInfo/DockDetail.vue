<!--机场详细信息元素-->
<template>
    <div class="dock-detail">
        <!-- 设备 -->
        <div class="dock-info">
            <div class="info-left">
                <el-avatar shape="square" style="width: 34px; height: 29px; background-color: transparent;"
                    :src="dockIMG" />
            </div>
            <div class="info-center">
                <div class="info-center__title"> {{ dockInfo.nickname }} </div>
                <div> {{ dockInfo.device_sn }} </div>
            </div>
            <div class="info-right">
                <div class="circle"
                    :style="deviceInfo?.dock.basic_osd?.mode_code === -1 ? 'backgroud: red;' : 'background: #19BE6B;'">
                </div>
                <div style="padding-left: 12px;width: 75%;"> {{ EDockModeCode }} </div>
            </div>
        </div>
        <!--     机场具体 -->
        <div class="dock-information">
            <el-row class="item-row">
                <el-col :span="8" class="item">
                    <div class="item-title">风速</div>
                    <span class="item-detail">{{ (deviceInfo?.dock.basic_osd?.wind_speed ?? str) + ' m/s' }}</span>
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
        </div>
        <div class="option" style="display: flex;justify-content: space-around;align-items: center; gap: 5px">
            <el-select v-model="flightValue" placeholder="选择航线" style="width: 140px;"
                @change="handleTaskChange">
                <el-option v-for="item in flightOptions" :key="item.flightPlanId" :label="item.planName"
                    :value="item.flightPlanId" />
            </el-select>
            <el-button type="primary" round @click="takeOff_click(deviceSn)">一键起飞</el-button>
            <el-button type="primary" round @click="takeOff">一键返航</el-button>
        </div>
        <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; width: 100%;">
            <ListHead title="小窗预览" />
            <div class="dock-video">
                <div class="video-item">
                    <VideoFrame @toFullScreen="toFull_sc" v-if="dockOutLiveStream"
                        :videoSource="{ aisource: aiDockStream, norsource: dockOutLiveStream }"
                         ref="dockvideo_frame"></VideoFrame>
                    <el-empty v-else description="机场视频未连接" class="empty-video" />
                </div>
            </div>
            <div v-if="!droneOutLiveStream" style="height: 50px"></div>
            <div class="drone-video" style="width: 100%;">
                <VideoFrame v-if="droneOutLiveStream" @toFullScreen="toFull_sc" :videoSource="{aisource: '', norsource: droneOutLiveStream, sn: droneInfo.device_sn}"
                          :class="isFull?'dronevideo_frame_':'dronevideo_frame'"
                          ref="dronevideo_frame"></VideoFrame>
                <el-empty v-else description="无人机视频未连接" class="empty-video" />

            </div>
        </div>
    </div>

</template>

<script setup lang="ts">
import ListHead from '@/components/Head/ListHead.vue';
import VideoFrame from '@/pages/ResourceManagement/components/Dock/VideoFrame.vue'
import { onMounted, ref, reactive, watch, computed, onBeforeUnmount, defineEmits, toRaw } from 'vue'
import { getBindingDeviceBySn } from "@/api/device";
import { stopLivestream, getLiveAddress, startLivestream, getLivestatus } from "@/api/live"
import { DeviceInfo } from "@/store/types/device";
import dockIMG from "@/assets/images/dock.png"
import {
    exectFlightTask,
    getFlightPlanList,
    insertFlightTask,
} from "@/api/droneFlightPlan";
import { useMyStore } from "@/store";
import {retuenHome} from "@/api/drone-control/drone";
const Props = defineProps({
    deviceSn: {
        type: String,
        default: ''
    }
})

const store = useMyStore();

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
    },
    child_device_sn: string;
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
    },
} as deviceInfoType)
const acc_time = ref(0 as number)

let dockInfo = reactive({} as DeviceInfo)
let droneInfo = reactive({} as DeviceInfo)

const dockOutLiveStream = ref('' as string)
const droneOutLiveStream = ref('' as string)
const aiDockStream = ref('')
const isFull = ref(false as boolean)

const deviceSn = ref("")

// 一键起飞选项
const flightValue = ref('')

const flightOptions = ref([] as any[])

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

// 一键返航
const takeOff = () => {
    retuenHome(dockInfo.device_sn);
}

const initialize = () => {
    deviceSn.value = Props.deviceSn
    getDeviceInfo()
    getDockLiveStream()
    getFlightPlanList(JSON.parse(localStorage.getItem('userInfo') as string).workspace_id, {
        deviceSn: deviceSn.value,
        taskType: "4"
    }).then(res => {
        if (res.code === 0) {
            flightOptions.value = []
            res.data.forEach((item: any) => {
                flightOptions.value.push(item)
            })
        }
    })
}

onMounted(() => {
    initialize();
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

const flightPlan = ref({} as any);
const handleOnTaskChange = (val: any) => {
    flightPlan.value = val;
    console.log('val', flightPlan.value, val, val.value)
}

const CancelWayLineShow = () => {
    // wayline_prepare未定义
    // if(wayline_prepare.value.waylineId){
    //   // console.log('wayline.value.waylineId', wayline.value.waylineId)
    //   RemoveEntitiesByBatch(window.cesiumViewer, 'checkWayLine')
    //   CheckWayLine(window.cesiumViewer, String(wayline_prepare.value.waylineId), true)
    // }
}

const takeOff_click = (device_sn: string) => {
    console.log("device_sn", device_sn)
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
    console.log("taskParams", taskParams)
    insertFlightTask(taskParams).then(res => {
        // console.log(res); // 打印响应
        if (res.code === 0) {
            console.log('res_insertFlightTask', res.data)
            exectFlightTaskParams.planId = res.data.flightPlanId
            console.log('exectFlightTaskParams', exectFlightTaskParams)
            exectFlightTask(JSON.parse(localStorage.getItem('userInfo') as string).workspace_id, exectFlightTaskParams).then(res2 => {
                console.log('res_exectFlightTask', res.data)
                console.log('res2', res2.data)
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

const handleTaskChange = () => {
    // 获取当前被选中的对象
    flightPlan.value = flightOptions.value.find((item: any) => item.flightPlanId === flightValue.value)
    // console.log('currentTask1111111111111', flightPlan.value)
}

const getDeviceInfo = async () => {
    getBindingDeviceBySn({
        workspace_id: JSON.parse(localStorage.getItem('userInfo') as string).workspace_id,
        device_sn: deviceSn.value
    }).then(res => {
        if (res.code === 0) {
            dockInfo = res.data
            // 存储匹配的无人机sn
            store.commit('SET_IFRAME_DRONE_SN', res.data.child_device_sn);
            getBindingDeviceBySn({
                workspace_id: JSON.parse(localStorage.getItem('userInfo') as string).workspace_id,
                device_sn: res.data.child_device_sn
            }).then(res => {
                if (res.code === 0) {
                    droneInfo = res.data
                    store.commit('SET_IFRAME_DRONE_SN', res.data.device_sn)
                    // console.log('机场信息：1111111111111111111', dockInfo)
                    getDroneLiveStream(droneInfo.device_sn);
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
            // console.log('机场' + dockInfo.device_sn + '直播流已断开')
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
    dockOutLiveStream.value = ''
    let rtmpUrl = await getLiveAddress()
    const timestamp = deviceSn.value

    let liveUrl = rtmpUrl.data + timestamp
    let videoID = timestamp + '/165-0-7/normal-0'
    let urlType = '1'
    let videoQ = '1'
    getLivestatus(timestamp as string).then(res => {
        if (res.data.webRtcStream) {
            dockOutLiveStream.value = res.data.webRtcStream
            store.commit('SET_LIVE_STREAM', { sn: timestamp, vid: videoID })
            // dockLoaded.value = true
        } else {
            startLivestream({
                url: liveUrl,
                video_id: videoID,
                url_type: urlType,
                video_quality: videoQ
            }).then(res => {
                if (res?.data?.url) {
                    dockOutLiveStream.value = res.data.url
                    store.commit('SET_LIVE_STREAM', { sn: timestamp, vid: videoID })
                    // dockLoaded.value = true
                } else {
                    dockOutLiveStream.value = ''
                }
            }).catch(err => {
                dockOutLiveStream.value = ''
            })
        }
    })
};
const getDroneLiveStream = async (timestamp: string) => {
    droneOutLiveStream.value = ''
    let rtmpUrl = await getLiveAddress()
    let liveUrl = rtmpUrl.data + timestamp
    let videoID = timestamp + '/53-0-0/normal-0'
    let urlType = '1'
    let videoQ = '1'
    getLivestatus(timestamp).then(res => {
        if (res.data.webRtcStream) {
            droneOutLiveStream.value = res.data.webRtcStream
            store.commit('SET_LIVE_STREAM', { sn: timestamp, vid: videoID })
        } else {
            startLivestream({
                url: liveUrl,
                video_id: videoID,
                url_type: urlType,
                video_quality: videoQ
            }).then(res => {
                if (res.data.url) {
                    droneOutLiveStream.value = res.data.webRtcStream
                    store.commit('SET_LIVE_STREAM', { sn: timestamp, vid: videoID })
                } else {
                    droneOutLiveStream.value = ''
                }
            })
        }
    })
}
const singlo = ref(true)
watch(() => store.state.deviceState, (newData, oldData) => {
    // console.log('dock', newData)
    if (newData.currentType === 3 && newData.dockInfo[newData.currentSn]) {
        if (dockInfo.device_sn === newData.currentSn) {
            deviceInfo.dock = newData.dockInfo[dockInfo.device_sn] as any;
            if (deviceInfo.dock.work_osd && deviceInfo.dock.link_osd && deviceInfo.dock.basic_osd) {
                acc_time.value = deviceInfo.dock.work_osd.activation_time;
            }
        }
    }
    if (newData.currentType === 2 && newData.deviceInfo[newData.currentSn]) {
        if (singlo.value && newData.currentSn === droneInfo.device_sn) {
            singlo.value = false
            getDroneLiveStream(droneInfo.device_sn)
        }
    	  // videoFusionValue(deviceInfo.device, droneInfo.device_sn)
    }

}, { deep: true, immediate: true })

watch(() => Props.deviceSn, () => {
    initialize()
})
</script>

<style scoped lang="scss">
div {
    box-sizing: border-box;
}

*,
*::before,
*::after {
    box-sizing: inherit;
}

/* 整体 */
.dock-detail {
    /* background-color: rgba(0, 0, 0, 0.7); */
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
}

/* 设备信息 */
.dock-info {
    margin-top: 10px;
    width: 95%;
    height: 45px;
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
    border-top-right-radius: 6px;
    border-top-left-radius: 6px;
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
    width: 95%;
    height: 95%;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    padding-bottom: 3px;
    background: $TouchColor2;
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
    margin-top: 10px;
    width: 100%;
    height: 220px;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
}

.empty-video {
    margin-bottom: 30px;
    width: 100%;
    height: 250px;
    border: 2px solid $SecondTouchColor;
    border-radius: 3px;
}

.dronevideo_frame {
    max-height: 250px;
}

.option {
    margin-bottom: 10px;
    padding-bottom: 10px;
    width: 95%;
    background: $TouchColor2;
    border-bottom-right-radius: 6px;
    border-bottom-left-radius: 6px;
}
</style>
