<template>

  <div class="task-list-item" :class="activeClass"
       @mouseover="bgHightlight=true" @mouseleave="bgHightlight=false" @click="handleOnClick">

      <div class="item-header">
        <div class="orange-dot"></div>
        <div class="item-header__left">
          {{ Props.planInfo.planName }}
        </div>
        <div class="item-header__center"></div>
        <div class="item-header__right" :style="{ color: taskStateColor[Props.planInfo.planStatus] ?? '#fff' }">
          <el-icon>
            <component :is="taskStateIcon[Props.planInfo.planStatus] ?? Clock"></component>
          </el-icon>
          {{ TaskStateName }}
        </div>
      </div>
      <div class="item-main">
        <div>
          <span class="item-main__header">任务创建时间</span>
          <span class="item-main__content">{{ Props.planInfo.createTime }}</span>
        </div>
        <div>
          <span class="item-main__header">任务策略</span>
          <span class="item-main__content">{{ TaskTypeName }}</span>
        </div>
        <div>
          <span class="item-main__header">执行航线</span>
          <span class="item-main__content">{{ wayline.waylineName }}</span>
        </div>
        <div>
          <el-button v-if="Props.planInfo.planStatus == 1" @click.stop="takeOff_click(Props.planInfo.deviceSn)">执行任务</el-button>
        </div>
        <div class="DeleteIcon" @click.stop="deleteTask(Props.planInfo)">
          <div class="TheDeleteIcon"></div>
        </div>
      </div>
  </div>


</template>

<script setup lang="ts">
import {computed, onMounted, onBeforeMount, ref, reactive, watch,defineEmits} from 'vue';
import {Clock, Finished, Histogram, Tickets} from '@element-plus/icons-vue'
import {getWaylineById, WaylineList} from '@/api/wayline'
import { useRoute, useRouter } from 'vue-router';
import bus from "@/utils/bus";
import {deleteFlightPlan, insertFlightTask, exectFlightTask} from '@/api/droneFlightPlan';
import {Wayline} from "@/store/types/wayline";
import {RemoveEntitiesByBatch} from "@/components/mapTools/BaseMapTools";
import {CheckWayLine} from "@/pages/TaskDeployment/components/WayLine/WayLineListCheckWayLine";


const route = useRoute();
const emit = defineEmits(['refresh'])

const Props = defineProps({
  planInfo: {
    type: Object,
  },
})

const handleOnClick = () => {
  console.log()
	CheckWayLine(window.cesiumViewer, Props.planInfo?.waylineId, false);
}

onMounted(() => {
  getWaylineInfo()
});

bus.on('clickResultTaskItem', (val: any) => {
  if (val === Props.planInfo.flightPlanId) {
    isActive.value = true
  } else {
    isActive.value = false
  }
})

// 是否选中
const bgHightlight = ref(false)
const isActive = ref(false)
// 任务状态颜色
const taskStateColor = ['#FFFFFF', '#FFBB40', '#65DDBC', '#F9E6C4', '#EA5B51', '#EA5B51']
// 任务状态图标
const taskStateIcon = [Histogram, Clock, Finished, Tickets]
// 显示任务状态
const TaskStateName = computed(() => {
  switch (Props.planInfo.planStatus) {
    case 1:
      return '待执行'
    case 2:
      return '执行中'
    case 3:
      return '已完成'
    case 4:
      return '已取消'
    case 5:
      return '执行失败'
    default:
      return '未连接'
  }
})

const deleteTask = (item: any) => {
    console.log(item,'item')
    deleteFlightPlan(item.flightPlanId).then(res=>{
      if(res.code === 0){
        ElMessage.success("删除成功")
        emit('refresh')
      }
    })
};



const WaylineName = computed(() => {
  console.log(wayline)
  if (wayline) {
    return wayline.waylineName
  } else {
    return str
  }
})
// 根据任务类型，显示class
const activeClass = computed(() => {
  if (bgHightlight.value) {
    return 'task-list-item__active__' + Props.planInfo.planStatus
  }
  if (isActive.value) {
    return 'task-list-item__active__' + Props.planInfo.planStatus
  }
})
// 显示任务类型
const TaskTypeName = computed(() => {
  if (Props.planInfo.planTaskType == 0) {
    return '立即'
  } else if (Props.planInfo.planTaskType == 1) {
    return '单次定时'
  } else if (Props.planInfo.planTaskType == 2) {
    return '重复定时'
  } else if (Props.planInfo.planTaskType == 3) {
    return '连续执行'
  } else {
    return '其它'
  }
})
// 获得航线信息
let wayline = ref({} as WaylineList);
const str = ref('--');
const getWaylineInfo = async () => {
  getWaylineById(Props.planInfo.waylineId).then(res => {
    if (res.code === 0 & res.data !== '') {
      wayline.value = res.data
    } else {
      wayline.value.waylineName = str.value
    }
  })
};
const exectFlightTaskParams = reactive({
  planId: '',
  deviceType: 1,
})
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
  taskParams.planName = Props.planInfo.planName + currentDate.toLocaleString();
  taskParams.waylineId = Props.planInfo.waylineId;
  taskParams.deviceSn = device_sn;
  taskParams.waylineType = Props.planInfo.waylineType;
  taskParams.taskType = 0;
  taskParams.rthAltitude = Props.planInfo.rthAltitude;
  taskParams.outOfControl = Props.planInfo.outOfControl;
  taskParams.planTaskType = Props.planInfo.planTaskType;
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

const wayline_prepare = ref({} as Wayline);

const CancelWayLineShow = () => {
  if(wayline_prepare.value.waylineId){
    // console.log('wayline.value.waylineId', wayline.value.waylineId)
    RemoveEntitiesByBatch(window.cesiumViewer, 'checkWayLine')
    CheckWayLine(window.cesiumViewer, String(wayline_prepare.value.waylineId), true)
  } else {
    console.log('11111')
  }
}
</script>

<style scoped lang="scss">
.task-list-item {
  width:100%;
  margin-bottom: 5px;
  padding: 4px 6px;
  border: 1px dashed transparent;
  cursor: pointer;
  font-family: $ContentFontFamily;
}

.task-list-item__active {
  background: #111;
  border: 1px dashed #5b897c;
  box-shadow: 0 0 5px #5b897c;
}

.task-list-item__active__1 {
  background: linear-gradient(rgba(39, 73, 85, 0.5) 20%, rgba(34,153,211,0.6) 100%);
  border: 1px solid $TouchColor;
}

.task-list-item__active__2 {
  background: linear-gradient(rgba(39, 73, 85, 0.5) 20%, rgba(34,153,211,0.6) 100%);
  border: 1px solid $TouchColor;
}

.task-list-item__active__3 {
  background: linear-gradient(rgba(39, 73, 85, 0.5) 20%, rgba(34,153,211,0.6) 100%);
  border: 1px solid $TouchColor;
}

.task-list-item__active__4 {
  background: linear-gradient(rgba(39, 73, 85, 0.5) 20%, rgba(34,153,211,0.6) 100%);
  border: 1px solid $TouchColor;
}

.task-list-item__active__5 {
  background: linear-gradient(rgba(39, 73, 85, 0.5) 20%, rgba(34,153,211,0.6) 100%);
  border: 1px solid $TouchColor;
}

.task-list-item__1 {
  background: linear-gradient(rgba(39, 73, 85, 0.5) 20%, rgba(34,153,211,0.6) 100%);
  border: 1px solid $TouchColor;
}

.task-list-item__2 {
  background: linear-gradient(rgba(39, 73, 85, 0.5) 20%, rgba(34,153,211,0.6) 100%);
  border: 1px solid $TouchColor;
}

.task-list-item__3 {
  background: linear-gradient(rgba(39, 73, 85, 0.5) 20%, rgba(34,153,211,0.6) 100%);
  border: 1px solid $TouchColor;
}

.task-list-item__4 {
  background: linear-gradient(rgba(39, 73, 85, 0.5) 20%, rgba(34,153,211,0.6) 100%);
  border: 1px solid $TouchColor;
}

.task-list-item__5 {
  background: linear-gradient(rgba(39, 73, 85, 0.5) 20%, rgba(34,153,211,0.6) 100%);
  border: 1px solid $TouchColor;
}

.orange-dot {
  width: 6px;
  height: 6px;
  background: $TouchColor;
  margin-right: 6px;
}

.item-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.item-header__left {
  font-size: $SecondLevelTitleFontSize;
  font-weight: $SecondLevelTitleFontWeight;
}

.item-header__center {
  flex-grow: 1;
  border: $UsualBorder;
  margin: 0 4px;
}

.item-header__right {
  padding: 6px;
  border-radius: 8px;
  display: inline-flex;
  gap: 2px;
  align-items: center;
  font-size: $ContentFontSize;
  font-weight: $ContentFontWeight;
}

.item-main {
  line-height: 22px;
  padding: 6px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-left: 6px;
  font-size: $ContentFontSize;
  font-weight: $ContentFontWeight;
}

.item-main__header {
  width: 95px;
  color: var(--el-color-primary-light);
  display: inline-block;
}

.item-main__content {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-main__time {
  color: var(--el-color-primary);
}

.DeleteIcon{
  // right: 35px;
  width: 14px;
  height: 13px;
  display: flex;
  position: relative;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  // background: #996300;
  top: -20px;
  left: 150px;
}

.TheDeleteIcon{
  background-image: url("../../../src/assets/TaskDeployment/DeleteIcon.png");
  width: 14px;
  height: 14px;
  background-size: cover;
}

</style>
