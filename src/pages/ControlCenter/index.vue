<template>
  <div class="equipment">
    <div class="left">
      <router-view name="equipment_list" class="equip-list"></router-view>
      <DronePlan class="drone-task"></DronePlan>
      <TaskInfo class="task-info"></TaskInfo>
    </div>
    <div class="bottom">
      <AnnualTask class="annual-task"></AnnualTask>
      <AnnualData class="annual-data"></AnnualData>
      <DataAcquisition class="data-acquire"></DataAcquisition>
    </div>
    <div class="right">
      <MutiLive class="mulilive"></MutiLive>
    </div>
  </div>
</template>

<script setup lang="ts">
import DronePlan from "@/pages/ControlCenter/components/DronePlan/DronePlan.vue";
import AnnualTask from "@/pages/ControlCenter/components/AnnualTask/AnnualTask.vue";
import TaskInfo from "@/pages/ControlCenter/components/TaskInfo/TaskInfo.vue";
import AnnualData from "@/pages/ControlCenter/components/AnnualData/AnnualData.vue";
import DataAcquisition from "@/pages/ControlCenter/components/DataAcquisition/DataAcquisition.vue";
import MutiLive from "@/pages/ControlCenter/components/MutiLive/MutiLive.vue";
import { onMounted, onBeforeUnmount } from 'vue'
import { useMyStore } from '@/store'
const store = useMyStore()

onMounted(() => {
	store.commit('SET_MAP_TOOL_SHOW', false)
})

onBeforeUnmount(() => {
	store.commit('SET_MAP_TOOL_SHOW', true)
})
</script>

<style scoped lang="scss">
// .equipment {
//   position: relative;
//   background: transparent;
// }
// .equip-list {
//   position: absolute;
//   width: 435px;
//   top: -50px;
// }
// .drone-task {
//   position: absolute;
//   width: 435px;
//   top: 220px;
// }
// .task-info {
//   position: absolute;
//   width: 435px;
//   top: 490px;
//   height: 287px;
// }
// .annual-task {
//   position: absolute;
//   top: 490px;
//   left: 435px;
// }
// .annual-data {
//   position: absolute;
//   top: 490px;
//   left: 1000px;
// }
// .data-acquire {
//   position: absolute;
//   top: 490px;
//   left: 1445px;
// }

// 新版本
.equipment {
  // background: transparent;
  // opacity: 0.7;
}

.left {
  position: fixed;
  top: 0px;
  left: 0px;
  height: calc(100% - $NavigationHeight);
  margin-top: $NavigationHeight;
  width: $LeftWidth;
  display: flex;
  flex-direction: column;
  background: transparent;
}
.equip-list {
  width: 100%;
  height: 100px;
  flex: 1;
}
.drone-task {
  width: 100%;
  height: 100px;
  flex: 1;
}
.task-info {
  width: 100%;
  height: $CenterBottomHeight;
}

.bottom {
  position: fixed;
  left: $LeftWidth;
  height: $CenterBottomHeight;
  right: 0px;
  bottom: 0px;
  display: flex;
  flex-direction: row;
  background: transparent;
}
.annual-task {
  flex: 1;
  height: 100%;
}
.annual-data {
  flex: 1;
  height: 100%;
}
.data-acquire {
  width: $RightWidth;
  height: 100%;
}

.right {
  position: fixed;
  top: 0px;
  right: 0px;
  height: calc(100% - $NavigationHeight - $CenterBottomHeight);
  margin-top: $NavigationHeight;
  width: $LeftWidth;
  display: flex;
  flex-direction: column;
  background: transparent;
}
</style>
