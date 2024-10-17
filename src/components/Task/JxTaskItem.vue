<template>
  <div class="task-list-item" :class="activeClass"
       @mouseover="bgHightlight=true" @mouseleave="bgHightlight=false">
    <div class="item-header">
      <div class="orange-dot"></div>
      <div class="item-header__left">
        {{ Props.planInfo.name }}
      </div>
      <div class="item-header__center"></div>
      <div class="item-header__right" :style="{ color: taskStateColor[Props.planInfo.planStatus] ?? '#fff' }">
        <el-icon>
          <component :is="taskStateIcon[Props.planInfo.planStatus] ?? Clock"></component>
        </el-icon>
        {{ TaskStateName }}
      </div>

      <div class="item-header__right" :style="{ color: taskStateColor[Props.planInfo.planStatus] ?? '#fff' }">
        <el-dropdown>
          <span class="el-dropdown-link">
            <el-icon class="el-icon--right">
              <arrow-down/>
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="executeFly()">飞行</el-dropdown-item>
              <el-dropdown-item @click="deletePlan()">删除</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>

    </div>
    <div class="item-main">
      <div>
        <span class="item-main__header">任务类型</span>
        <span class="item-main__content">{{ TaskTypeName }}</span>
      </div>
      <div>
        <span class="item-main__header">执行航线名称</span>
        <span class="item-main__content">{{ Props.planInfo.strategyName ? Props.planInfo.strategyName : '--' }}</span>
      </div>
      <div>
        <span class="item-main__header">最后执行时间</span>
        <span class="item-main__content item-main__time">{{ Props.planInfo.latestExecuteTime }}</span>
      </div>
    </div>
    <JxTaskInfo v-if="showInfo" :plan-info="planInfo" :site-id="siteId"></JxTaskInfo>
  </div>
</template>

<script setup lang="ts">
import {computed, ref} from 'vue';
import {Clock, Finished, Histogram, Tickets} from '@element-plus/icons-vue'
import {useRoute, useRouter} from 'vue-router';
import bus from "@/utils/bus";
import {ArrowDown} from '@element-plus/icons-vue'
import {excuteMission, removeMissionConfig} from "@/api/jiexiang/jxDronePlan";
import JxTaskInfo from "@/pages/TaskDeployment/components/Task/JxTaskInfo.vue";
import { useMyStore } from '@/store'

const route = useRoute();
const router = useRouter();
const showInfo = ref(false);
const store = useMyStore()

const Props = defineProps({
  planInfo: {
    type: Object
  },
  siteId: {
    type: String
  }
})
const emit = defineEmits(["getTaskInfo"]);

const executeFly = () => {
  console.log(Props.planInfo)
  ElMessageBox.confirm('是否执行飞行任务？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    excuteMission({id: String(Props.planInfo?.id)}).then(res => {
      if (res.errorCode === '00000') {
        switchShowInfo()
        // 保存正在执行的任务id
        store.state.executePlanId = Props.planInfo?.id

        ElMessage.success('飞行任务执行成功')
        router.push({
          path: '/default/task/jx-task-list/detail',
          query: {
            planInfo: JSON.stringify(Props.planInfo),
            siteId: Props.siteId
          },
        })
      } else {
        ElMessage.error('执行失败')
      }
    })

  }).catch(() => {
        ElMessage.info('已取消操作')
      }
  );
}

const deletePlan = () => {
  removeMissionConfig({id: String(Props.planInfo?.id)}).then(res => {
    if (res.errorCode === '00000') {
      emit('getTaskInfo')
    } else {
      ElMessage.error('删除失败')
    }
  })
}

bus.on('clickResultTaskItem', (val: any) => {
  if (val === Props.planInfo?.flightPlanId) {
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
  return '已完成'
})

// 根据任务类型，显示class
const activeClass = computed(() => {
  if (bgHightlight.value) {
    return 'task-list-item__active__' + Props.planInfo?.type
  }
  if (isActive.value) {
    return 'task-list-item__active__' + Props.planInfo?.type
  }
})
// 显示任务类型
const TaskTypeName = computed(() => {
  if (Props.planInfo?.type == '1') {
    return '自动任务'
  } else if (Props.planInfo?.type == '2') {
    return '手动任务'
  } else if (Props.planInfo?.type == '3') {
    return '快速任务'
  } else {
    return '其它'
  }
})

const switchShowInfo = () => {
  showInfo.value = true
}
const hideShowInfo = ()=>{
  showInfo.value = false
}
// 暴露方法
defineExpose({ switchShowInfo, hideShowInfo })
</script>

<style scoped lang="scss">
.task-list-item {
  width: 100%;
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
  border: 1px dashed #FFBB40;
  box-shadow: 0 0 5px #FFBB40;
}

.task-list-item__active__2 {
  border: 1px dashed #65DDBC;
  box-shadow: 0 0 5px #65DDBC;
}

.task-list-item__active__3 {
  border: 1px dashed #F9E6C4;
  box-shadow: 0 0 5px #F9E6C4;
}

.task-list-item__active__4 {
  border: 1px dashed #EA5B51;
  box-shadow: 0 0 5px #EA5B51;
}

.task-list-item__active__5 {
  border: 1px dashed #EA5B51;
  box-shadow: 0 0 5px #EA5B51;
}

.task-list-item__1 {
  border: 1px dashed #FFBB40;
  box-shadow: 0 0 5px #FFBB40;
}

.task-list-item__2 {
  border: 1px dashed #65DDBC;
  box-shadow: 0 0 5px #65DDBC;
}

.task-list-item__3 {
  border: 1px dashed #F9E6C4;
  box-shadow: 0 0 5px #F9E6C4;
}

.task-list-item__4 {
  border: 1px dashed #EA5B51;
  box-shadow: 0 0 5px #EA5B51;
}

.task-list-item__5 {
  border: 1px dashed #EA5B51;
  box-shadow: 0 0 5px #EA5B51;
}

.orange-dot {
  width: 6px;
  height: 6px;
  background: orange;
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
  border: 1px dashed #999;
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

.example-showcase .el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}
</style>
