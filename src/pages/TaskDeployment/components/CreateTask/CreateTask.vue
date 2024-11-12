<template>
  <div class="create-task">
    <div class="list-header">
      新建任务{{ deviceInfo.device_name }}
    </div>
    <div class="list-main">
      <el-form :model="taskInfo" label-position="top">
        <el-form-item label="任务名称">
          <el-input v-model="taskInfo.planName" placeholder="请输入任务名称"/>
        </el-form-item>
        <el-form-item label="执行航线">
          <el-col :span="11">
            <el-input v-model="wayline.waylineName" placeholder="请选择"/>
          </el-col>
          <el-col :span="2" class="text-center">
            <span class="text-gray-500"> </span>
          </el-col>
          <el-col :span="11">
            <el-button plain size="small" @click="selectWayline()">选择航线</el-button>
          </el-col>
        </el-form-item>
        <el-form-item label="相对机场返航高度">
          <el-col :span="22">
            <el-input v-model="taskInfo.rthAltitude" placeholder="请输入"/>
          </el-col>
          <el-col :span="1" :offset="1" class="text-center">
            <span class="text-gray-500">米</span>
          </el-col>
        </el-form-item>
        <el-form-item label="任务策略">
          <el-radio-group v-model="taskInfo.taskType" size="small">
            <el-radio-button border label=0 @click="HideshowChooseTimePanel">立即</el-radio-button>
            <el-radio-button border label=1 @click="showChooseTimePanel">单次定时</el-radio-button>
            <el-radio-button border label=2 @click="showChooseTimePanelRepeat">重复定时</el-radio-button>
            <el-radio-button border label=3 @click="HideshowChooseTimePanel">连续执行</el-radio-button>
            <el-radio-button border label=4 @click="HideshowChooseTimePanel">预设任务</el-radio-button>
          </el-radio-group>
          <el-date-picker
              v-if="ChooseTimePanel"
              style="margin-top: 10px"
              v-model="ExecuteTime"
              type="datetime"
              class="ChooseTime"
              placeholder="选择日期时间">
          </el-date-picker>
          <el-checkbox-group v-if="ShowChooseWeekDay" v-model="ChooseWeekDay" size="small" style="margin-top: 15px">
            <el-checkbox-button class="WeekDayCell" v-for="WeekDay in WeekDays" :label="WeekDay" :key="WeekDay">
              {{ WeekDay }}
            </el-checkbox-button>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="航线飞行中失联">
          <el-radio-group v-model="taskInfo.outOfControl" size="small">
            <el-radio-button border label=0>返航</el-radio-button>
            <el-radio-button border label=1>继续执行</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="完成动作">
          <el-radio-group v-model="taskInfo.planTaskType" size="small">
            <el-radio-button border label=0>自动返航</el-radio-button>
            <el-radio-button border label=1>原地降落</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <!-- <el-form-item label="Activity time">
          <el-col :span="11">
            <el-date-picker
              v-model="form.date1"
              type="date"
              placeholder="Pick a date"
              style="width: 100%"
            />
          </el-col>
          <el-col :span="2" class="text-center">
            <span class="text-gray-500">-</span>
          </el-col>
          <el-col :span="11">
            <el-time-picker
              v-model="form.date2"
              placeholder="Pick a time"
              style="width: 100%"
            />
          </el-col>
        </el-form-item> -->
      </el-form>
    </div>
    <div class="list-footer">
      <el-button type="primary" color="#BF6C00" @click="createTask()" plain>确定</el-button>
      <el-button type="primary" @click="closeCreateTask()" plain>取消</el-button>
    </div>
    <WayLine></WayLine>
    <!-- <router-view name="wayline_list"></router-view> -->
    <el-dialog
        v-model="centerDialogVisible"
        title="注意"
        width="30%"
        destroy-on-close
        center
    >
      <span>
      离开本页面是可能造成表单数据丢失
      </span>
      <div>
        <strong>是否保留表单内容</strong>
      </div>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="dlCancel">否</el-button>
        <el-button type="primary" @click="dlConfirm">
          是
        </el-button>
      </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {ref, reactive, onMounted, watch, onBeforeUnmount} from 'vue'
import {useRoute, useRouter} from 'vue-router';
import {getWaylineById} from "@/api/wayline";
import WayLine from "@/pages/TaskDeployment/components/WayLine/Wayline.vue"
import {Wayline} from "@/store/types/wayline";
import {getBindingDeviceBySn} from '@/api/device'
import {insertFlightTask, exectFlightTask, insertFlightTaskPrepare} from "@/api/droneFlightPlan";
import {useCookies} from "vue3-cookies";

const {cookies} = useCookies()
const route = useRoute();
const router = useRouter();
import {useMyStore} from "@/store"
import {RemoveEntitiesByBatch} from '@/components/mapTools/BaseMapTools'
import {CheckWayLine} from '@/pages/TaskDeployment/components/WayLine/WayLineListCheckWayLine'

const store = useMyStore();
const ChooseTimePanel = ref(false);
const ShowChooseWeekDay = ref(false);
const WeekDays = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期天',];
const ChooseWeekDay = ref(['星期一']);
const wayline = ref({} as Wayline);
const taskInfo = ref({} as MyObject)
const centerDialogVisible = ref(false)
let isSave = true

function showChooseTimePanel() {
  ChooseTimePanel.value = true;
}

function showChooseTimePanelRepeat() {
  ChooseTimePanel.value = true;
  ShowChooseWeekDay.value = true;
}

function HideshowChooseTimePanel() {
  ChooseTimePanel.value = false;
  ShowChooseWeekDay.value = false;
}

onMounted(() => {
  window.addEventListener('beforeunload', save_cache)
  window.addEventListener('unload', save_cache)
  // taskInfo.rthAltitude = '111'
  createTaskInit()
  getDeviceInfo()
});
// 获取设备信息
const deviceInfo = reactive({
  child_device_sn: undefined,
  device_sn: undefined,
  device_name: undefined,
  deviceType: undefined,
})

function getDeviceInfo() {
  getBindingDeviceBySn({
    workspace_id: JSON.parse(localStorage.getItem('userInfo') as string).workspace_id,
    device_sn: route.query.device_sn as string
  }).then(res => {
    if (res.code === 0) {
      deviceInfo.device_sn = res.data.device_sn
      deviceInfo.device_name = res.data.device_name
      deviceInfo.deviceType = res.data.domain
      deviceInfo.child_device_sn = res.data.child_device_sn
      if (res.data.domain === 0) {
        exectFlightTaskParams.deviceType = 0
      } else if (res.data.domain === 3) {
        exectFlightTaskParams.deviceType = 1
      }
    }
  })
}

// 生成时间戳
const getTimeStamp = () => {
  return Date.now()
};

// 表单
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

// 选择航线
const selectWayline = () => {
  router.push({
    path: '/default/task/create/add-wayline',
    query: {
      device_sn: taskInfo.value.deviceSn
    },
  })
};

watch(() => store.state.selectWayline, (val, oldVal) => {
  wayline.value = val
  taskInfo.value.waylineId = store.state.selectWayline.waylineId as string
}, {deep: true})
// 返回
const closeCreateTask = () => {
  centerDialogVisible.value = true;
};
// 执行任务
const exectFlightTaskParams = reactive({
  planId: '',
  deviceType: 0,
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

function InsertTask() {
  isSave = false
  taskInfo.value.rthAltitude = 80;
  taskInfo.value.deviceSn = route.query.device_sn as string
  taskInfo.value.executeTime = getTimeStamp()
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

function createTask() {
  isSave = false
  taskInfo.value.rthAltitude = Number(taskInfo.value.rthAltitude)
  taskInfo.value.deviceSn = route.query.device_sn as string
  taskInfo.value.executeTime = getTimeStamp()
  console.log("taskInfo.value", taskInfo.value)
  removeCache()
  store.commit('CHANGE_CACHE_STYLE', {isReady: true, isAllow:true})
  if(Number(taskInfo.value.taskType) === 4){
    ElMessage({
      message: "创建预设任务成功",
      type: 'success'
    });
    InsertTask()
    router.push({
      path: '/default/task/task-list',
      query: {
        device_sn: taskInfo.value.deviceSn,
      },
    })
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
            CancelWayLineShow()
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

//任务创建时间相关函数
const pickerOptions = {
  disabledDate(time: any) {
    return time.getTime() > Date.now();
  },
  shortcuts: [
    {
      text: '今天',
      onClick(picker: any) {
        picker.emit('pick', new Date());
      }
    },
    {
      text: '昨天',
      onClick(picker: any) {
        const date = new Date();
        date.setTime(date.getTime() - 3600 * 1000 * 24);
        picker.emit('pick', date);
      }
    },
    {
      text: '一周前',
      onClick(picker: any) {
        const date = new Date();
        date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
        picker.emit('pick', date);
      }
    }
  ]
};
//新建了一个任务的执行时间
const ExecuteTime = ref('');

// 点击确定或取消时删除显示的航线
const CancelWayLineShow = () => {
  if (wayline.value.waylineId) {
    // console.log('wayline.value.waylineId', wayline.value.waylineId)
    RemoveEntitiesByBatch(window.cesiumViewer, 'checkWayLine')
    CheckWayLine(window.cesiumViewer, String(wayline.value.waylineId), true)
  } else {
    console.log('11111')
  }
}

const save_cache = () => {
  const device_sn = route.query.device_sn as string
  var temp = {} as any
  if (cookies.get('createTaskCache')) {
    temp = cookies.get('createTaskCache') as any;
  }
  temp[device_sn] = {
    'taskInfo': taskInfo.value,
    'task_wayline': wayline.value.waylineId as string
  }
  cookies.set('createTaskCache', JSON.stringify(temp))
}
const createTaskInit = () => {
  const taskCache = cookies.get('createTaskCache') as unknown as any
  console.log(taskCache)
  if (taskCache && taskCache[route.query.device_sn as string]) {
    taskInfo.value = taskCache[route.query.device_sn as string].taskInfo
    getWaylineById(taskCache[route.query.device_sn as string].task_wayline).then(res => {
      wayline.value = res.data
    })
  } else {
    taskInfo.value.deviceSn = route.query.device_sn as string
  }
}
const removeCache = () => {
  const taskCache = cookies.get('createTaskCache') as unknown as any
  if (taskCache[route.query.device_sn as string]) {
    delete taskCache[route.query.device_sn as string]
    console.log(taskCache)
    cookies.set('createTaskCache', JSON.stringify(taskCache))
  }
}
watch(() => store.state.isComSaveCache, (val) => {
  if (val.isReady && !val.isAllow)
    centerDialogVisible.value = true
})
onBeforeUnmount(() => {
  if (isSave) {
    save_cache()
  }
  CancelWayLineShow()
})

function dlConfirm() {
  centerDialogVisible.value = false
  save_cache()
  CancelWayLineShow()
  store.commit('CHANGE_CACHE_STYLE', {isAllow: true})
  router.push({
    path: '/default/task/task-list',
    query: {
      device_sn: taskInfo.value.deviceSn
    },
  })
}

function dlCancel() {
  centerDialogVisible.value = false
  isSave = false
  CancelWayLineShow()
  removeCache()
  store.commit('CHANGE_CACHE_STYLE', {isAllow: true})
  router.push({
    path: '/default/task/task-list',
    query: {
      device_sn: taskInfo.value.deviceSn
    },
  })
}
</script>

<style scoped lang="scss">
html {
  box-sizing: border-box;
}

*, *::before, *::after {
  box-sizing: inherit;
}

:root {
  --primary-color: $TouchColor
}

.create-task {
  width: 100%;
  height: 100%;
  background-color: $ComponentBackground;
  /* opacity: 0.38; */
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

::-webkit-scrollbar {
  width: 0 !important;
}

::-webkit-scrollbar {
  width: 0 !important;
  height: 0;
}

.list-header {
  width: 100%;
  height: 60px;
  line-height: 60px;
  text-align: center;
  background: $ComponentHeadBackground;
  border-bottom: 1px solid $TouchColor;
  color: $FirstLevelTitleColor;
  font-size: $FirstLevelTitleFontSize;
  font-weight: $FirstLevelTitleFontWeight;
  font-family: $FirstLevelTitleFontFamily;
}

.list-main {
  width: 100%;
  flex-grow: 1;
  padding: 26px 18px;
  color: #FFFFFF;
}

.WeekDayCell {

}

.list-footer {
  width: 100%;
  height: 56px;
  border-top: 1px solid $TouchColor;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
