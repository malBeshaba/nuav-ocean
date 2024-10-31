<template>
  <div class="task-list-item" :class="activeClass"
       @mouseover="bgHightlight=true" @mouseleave="bgHightlight=false">
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
        <span class="item-main__content">{{ wayline? wayline.waylineName : str}}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, ref, reactive} from 'vue';
import {Clock, Finished, Histogram, Tickets} from '@element-plus/icons-vue'
import {getWaylineById, WaylineList} from '@/api/wayline'
import bus from "@/utils/bus";

const Props = defineProps<{
  planInfo: {
    flightPlanId: string,
		planName: string,
	  createTime: string,
	  waylineId: string,
    planTaskType: number,
	  planStatus: number,
  },
}>()

onMounted(() => {
  getWaylineInfo()
});

bus.on('clickResultTaskItem', (val: any) => {
	console.log('点击了', val)
})

// 是否浏览
const bgHightlight = ref(false)
// 是否选中
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
let wayline = reactive({} as WaylineList);
const str = ref('--');
const getWaylineInfo = async () => {
  getWaylineById(Props.planInfo.waylineId).then(res => {
    if (res.code === 0) {
      wayline = res.data
    }
  })
};
</script>

<style scoped lang="scss">
.task-list-item {
  width: 100%;
  padding: 4px 6px;
  border: 1px dashed transparent;
  margin-bottom: 8px;
  cursor: pointer;
  font-family: $ContentFontFamily;
}

.task-list-item__active {
  background: linear-gradient(rgba(39, 73, 85, 0.5) 20%, rgba(34,153,211,0.6) 100%);
  border: 1px solid $TouchColor;
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
  font-family: $SecondLevelTitleFontFamily;
  font-size: $SecondLevelTitleFontSize;
  font-weight: $SecondLevelTitleFontWeight;
}

.item-header__center {
  flex-grow: 1;
  border: 1px dashed $UsualColor;
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
  font-family: $ContentFontFamily;
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
  color: var(--el-color-warning);
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

</style>
