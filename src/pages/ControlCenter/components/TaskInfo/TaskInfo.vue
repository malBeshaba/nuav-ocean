<template>
  <div class="task-info">
    <list-head title="任务信息" style="width: 100%;"></list-head>
    <div style="display: flex;">
      <div class="task-block" v-for="info in taskBlocks" :key="info" style="margin-left: 30px; margin-top: 22px;">
        <TaskBlock :info="info"></TaskBlock>
      </div>
    </div>
    <div class="task-line" v-for="info in taskLines" :key="info">
      <TaskLine :info="info"></TaskLine>
    </div>
  </div>
</template>

<script setup lang="ts">
import TaskBlock from "@/pages/ControlCenter/components/TaskInfo/TaskBlock.vue";
import TaskLine from "@/pages/ControlCenter/components/TaskInfo/TaskLine.vue";
import ListHead from "@/components/Head/ListHead.vue";
import FlyIcon from "@/assets/ControlCenter/fly.png"
import DistIcon from "@/assets/ControlCenter/state.png"
import {taskInfoStatistic} from "@/api/data-statistics/taskStatistic"
import {reactive, ref} from "vue";
const taskinfoObj = ref({} as any)
const taskBlocks = reactive([{
  value: 9,
  unit: "次",
  title: "累计执行任务"
},{
  value: 2,
  unit: "次",
  title: "当日执行任务"
},{
  value: 0,
  unit: "次",
  title: "计划中任务"
}])
const taskLines = reactive([{
  icon: FlyIcon,
  title: '当日任务距离',
  distance: 2455
},{
  icon: DistIcon,
  title: '累计任务距离',
  distance: 2455
}])
taskInfoStatistic().then(res => {
  console.log('taskInfoStatistic', res)
  taskinfoObj.value = res.data
  taskBlocks[0].value = res.data.tasked_count
  taskBlocks[1].value = res.data.task_day_count
  taskLines[0].distance = res.data.task_day_distance
  taskLines[1].distance = res.data.tasked_distance
})
</script>

<style scoped lang="scss">
.task-info {
  background-color: $ComponentBackground;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.task-block {

}
</style>
